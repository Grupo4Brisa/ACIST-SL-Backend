import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
  In,
} from 'typeorm';

import * as bcrypt from 'bcrypt';


import { Company } from './entities/company.entity';


import { CreateCompanyDto } from './dto/create-company.dto';
import { CompleteCompanyDto } from './dto/complete-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FilterCompanyDto } from './dto/filter-company.dto';

import { MailService } from '../mail/mail.service';


import {
  CompanyStatus,
} from './company-status.enum';


import {
  ApprovalsService,
} from '../approvals/approvals.service';


import {
  ApprovalAction,
} from '../approvals/approval-action.enum';


import {
  LoginTokensService,
} from '../login-tokens/login-tokens.service';



@Injectable()
export class CompaniesService {


  constructor(


    @InjectRepository(Company)

    private readonly companyRepository:
      Repository<Company>,



    private readonly approvalsService:
      ApprovalsService,



    private readonly configService:
      ConfigService,



    private readonly loginTokensService:
      LoginTokensService,

    private readonly mailService: MailService,

  ) {}



  // =====================================
  // LISTAR EMPRESAS
  // =====================================

  async findAll(
    filters: FilterCompanyDto,
  ) {


    const query =
      this.companyRepository
        .createQueryBuilder('company');



    if(filters.companyName){

      query.andWhere(
        `
        (
          company.companyName ILIKE :companyName
          OR
          company.corporateName ILIKE :companyName
        )
        `,
        {
          companyName:
            `%${filters.companyName}%`,
        },
      );

    }



    if(filters.city){

      query.andWhere(
        'company.city ILIKE :city',
        {
          city:
            `%${filters.city}%`,
        },
      );

    }



    if(filters.companySize){

      query.andWhere(
        'company.companySize = :companySize',
        {
          companySize:
            filters.companySize,
        },
      );

    }



    if(filters.establishmentType){

      query.andWhere(
        'company.establishmentType ILIKE :establishmentType',
        {
          establishmentType:
            `%${filters.establishmentType}%`,
        },
      );

    }



    if(filters.status){

      query.andWhere(
        'company.status = :status',
        {
          status:
            filters.status,
        },
      );

    }



    return query.getMany();

  }





  // =====================================
  // BUSCAR EMPRESA POR ID
  // =====================================

  async findOne(
    id:number,
  ){


    const company =
      await this.companyRepository.findOne({

        where:{
          id,
        },

      });



    if(!company){

      throw new NotFoundException(
        'Empresa não encontrada.',
      );

    }



    return company;

  }





  // =====================================
  // BUSCAR NOMES/RAMO EM LOTE
  // Usado pelo DocumentsService.findAll()
  // para enriquecer a lista de documentos
  // com companyName e establishmentType
  // sem fazer N+1 queries.
  // =====================================

  async findNamesByIds(
    ids: number[],
  ){


    if(ids.length === 0){

      return [];

    }



    return this.companyRepository.find({

      where:{
        id: In(ids),
      },


      select:[
        'id',
        'companyName',
        'establishmentType',
      ],

    });


  }





  // =====================================
  // LOGIN EMPRESA
  // =====================================

  async findAuthCompanyByEmail(
    email:string,
  ){


    const associateLogin =
      this.configService.get<boolean>(
        'features.associateLogin',
      );



    if(!associateLogin){

      return null;

    }



    return this.companyRepository.findOne({

      where:{
        email,
      },


      select:[
        'id',
        'companyName',
        'email',
        'password',
        'status',
      ],

    });


  }
    // =====================================
  // CADASTRO INICIAL LANDING
  // =====================================

  async createLanding(
    companyData: CreateCompanyDto,
  ){


    const exists =
      await this.companyRepository.findOne({

        where:[

          {
            email:
              companyData.email,
          },

          {
            cnpjcpf:
              companyData.cnpjcpf,
          },

        ],

      });



    if(exists){

      throw new ConflictException(
        'Email ou CNPJ/CPF já cadastrado.',
      );

    }




    let passwordHash:
      string | undefined;



    const landingPassword =
      this.configService.get<boolean>(
        'features.landingPassword',
      );



    if(
      landingPassword &&
      companyData.password
    ){


      passwordHash =
        await bcrypt.hash(
          companyData.password,
          10,
        );


    }





    const company =
      this.companyRepository.create({

        ...companyData,


        password:
          passwordHash,


        status:
          CompanyStatus.INCOMPLETE,

      });





    const saved =
      await this.companyRepository.save(
        company,
      );





    const {
      password,
      ...companyWithoutPassword
    } = saved;

    await this.approvalsService.createLog({
      companyId: saved.id,
      userId:    null,
      action:    ApprovalAction.CREATED,
      observation: 'Cadastro iniciado pela landing page.',
    });

    return companyWithoutPassword;


  }








  // =====================================
  // COMPLETAR CADASTRO
  // EMPRESA OU COLABORADOR
  // =====================================

  async complete(

    id:number,

    data:CompleteCompanyDto,

    user:any,

  ){



    const company =
      await this.findOne(id);





    /*
    =====================================
    EMPRESA:
    só pode completar o próprio cadastro

    COLABORADOR:
    acesso controlado pela rota

    TOKEN:
    usado no primeiro acesso

    =====================================
    */



    if(

      user?.type === 'COMPANY' &&

      Number(user.id) !== Number(company.id)

    ){


      throw new UnauthorizedException(

        'Empresa não autorizada a alterar este cadastro.',

      );


    }







    if(

      company.status === CompanyStatus.ACTIVE ||

      company.status === CompanyStatus.INACTIVE

    ){


      throw new BadRequestException(

        'Este cadastro não pode mais ser alterado.',

      );


    }








    const updated =

      this.companyRepository.merge(

        company,

        {



          ...data,





          foundationDate:

            data.foundationDate

              ? new Date(
                  data.foundationDate,
                )

              : company.foundationDate,







          associationDate:

            data.associationDate

              ? new Date(
                  data.associationDate,
                )

              : company.associationDate,







          employeesCount:

            data.employeesCount !== undefined

              ? Number(
                  data.employeesCount,
                )

              : company.employeesCount,







          status:

            CompanyStatus.PENDING_APPROVAL,


        },

      );







    const savedComplete = await this.companyRepository.save(

      updated,

    );

    await this.approvalsService.createLog({
      companyId: id,
      userId:    user?.id ?? null,
      action:    ApprovalAction.COMPLETED,
      observation: 'Cadastro completado/atualizado.',
    });

    return savedComplete;


  }












  // =====================================
  // COMPLETAR CADASTRO POR TOKEN
  // =====================================

  async completeByToken(

    token:string,

    data:CompleteCompanyDto,

  ){



    const loginToken =

      await this.loginTokensService.findByToken(

        token,

      );





    if(!loginToken){


      throw new NotFoundException(

        'Token inválido.',

      );


    }







    if(loginToken.used){


      throw new BadRequestException(

        'Token já utilizado.',

      );


    }







    if(

      loginToken.expiresAt < new Date()

    ){


      throw new BadRequestException(

        'Token expirado.',

      );


    }







    const company =

      await this.complete(

        loginToken.companyId,

        data,

        {

          type:'TOKEN',

          id:loginToken.companyId,

        },

      );







    await this.loginTokensService.markAsUsed(

      token,

    );







    return company;


  }
    // =====================================
  // APROVAR EMPRESA
  // SOMENTE COLABORADOR APROVADOR
  // =====================================

  async approve(

    companyId:number,

    userId:number,

  ){



    const company =

      await this.findOne(

        companyId,

      );







    if(

      company.status !==

      CompanyStatus.PENDING_APPROVAL

    ){


      throw new BadRequestException(

        'Empresa não está aguardando aprovação.',

      );


    }








    company.status =

      CompanyStatus.ACTIVE;








    await this.companyRepository.save(

      company,

    );









    await this.approvalsService.createLog({



      companyId,



      userId,



      action:

        ApprovalAction.APPROVED,





      observation:

        'Empresa aprovada pelo aprovador.',



    });

    await this.mailService.sendApprovalEmail(
    company.email,
    company.companyName,
  );



    const associateLogin =

      this.configService.get<boolean>(

        'features.associateLogin',

      );









    /*
    =====================================
    Caso a empresa não tenha login próprio

    gera token para primeiro acesso

    =====================================
    */



    if(!associateLogin){



      const loginToken =

        await this.loginTokensService.createToken(

          company.id,

        );







      return {


        company,



        completionToken:

          loginToken.token,



        expiresAt:

          loginToken.expiresAt,


      };


    }







    return company;


  }













  // =====================================
  // REPROVAR EMPRESA
  // SOMENTE COLABORADOR APROVADOR
  // =====================================

  async reject(

    companyId:number,

    userId:number,

  ){



    const company =

      await this.findOne(

        companyId,

      );







    if(

      company.status !==

      CompanyStatus.PENDING_APPROVAL

    ){


      throw new BadRequestException(

        'Empresa não está aguardando aprovação.',

      );


    }








    company.status =

      CompanyStatus.INACTIVE;








    await this.companyRepository.save(

      company,

    );









    await this.approvalsService.createLog({



      companyId,



      userId,



      action:

        ApprovalAction.REJECTED,





      observation:

        'Empresa rejeitada pelo aprovador.',



    });









    return company;


  }
    // =====================================
  // ATUALIZAR EMPRESA
  // EMPRESA OU COLABORADOR
  // =====================================

  async update(

    id:number,

    data:UpdateCompanyDto,

    user?:any,

  ){



    const company =

      await this.findOne(

        id,

      );







    /*
    =====================================
    REGRA DE ACESSO

    COMPANY:
    somente altera o próprio cadastro

    COLABORADOR:
    acesso controlado pela rota

    =====================================
    */



    if(

      user?.type === 'COMPANY' &&

      Number(user.id) !== Number(company.id)

    ){


      throw new UnauthorizedException(

        'Empresa não autorizada a alterar este cadastro.',

      );


    }








    /*
    =====================================
    CRIPTOGRAFAR NOVA SENHA
    =====================================
    */


    if(data.password){



      data = {


        ...data,


        password:

          await bcrypt.hash(

            data.password,

            10,

          ),


      };


    }








    /*
    =====================================
    STATUS NÃO PODE SER ALTERADO PELO UPDATE

    Apenas os fluxos:

    complete()
    approve()
    reject()

    podem alterar status.

    =====================================
    */


    delete data.status;








    const updated =

      this.companyRepository.merge(

        company,

        data,

      );








    const savedUpdate = await this.companyRepository.save(

      updated,

    );

    await this.approvalsService.createLog({
      companyId: id,
      userId:    user?.id ?? null,
      action:    ApprovalAction.COMPLETED,
      observation: user?.type === 'COMPANY' ? 'Cadastro editado pela própria empresa.' : 'Cadastro editado por colaborador.',
    });

    return savedUpdate;


  }












  // =====================================
  // REMOVER EMPRESA
  // SOMENTE ADMIN/APROVADOR
  // =====================================


  async remove(

    id:number,

  ){



    await this.findOne(

      id,

    );







    await this.companyRepository.delete(

      id,

    );







    return {


      message:

        'Empresa removida com sucesso.',


    };


  }


}
