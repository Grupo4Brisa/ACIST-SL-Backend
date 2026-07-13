import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';

import { Company } from './entities/company.entity';

import { CreateCompanyDto } from './dto/create-company.dto';
import { CompleteCompanyDto } from './dto/complete-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FilterCompanyDto } from './dto/filter-company.dto';

import { CompanyStatus } from './company-status.enum';

import { ApprovalsService } from '../approvals/approvals.service';
import { ApprovalAction } from '../approvals/approval-action.enum';


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

  ) {}



  // =========================
  // LISTAR EMPRESAS
  // =========================
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





  // =========================
  // BUSCAR POR ID
  // =========================
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





  // =========================
  // BUSCAR EMPRESA LOGIN
  // =========================
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





  // =========================
  // CADASTRO LANDING
  // =========================
  async createLanding(
    companyData:CreateCompanyDto,
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



    return companyWithoutPassword;

  }





  // =========================
  // COMPLETAR CADASTRO
  // =========================
  async complete(
    id:number,
    data:CompleteCompanyDto,
  ){


    const company =
      await this.findOne(id);



    if(
      company.status !==
      CompanyStatus.INCOMPLETE
    ){

      throw new BadRequestException(
        'Cadastro já concluído.',
      );

    }



    const updated =
      this.companyRepository.merge(

        company,

        {

          ...data,


          status:
            CompanyStatus.PENDING_APPROVAL,


          foundationDate:
            data.foundationDate
              ? new Date(
                  data.foundationDate,
                )
              : undefined,


          associationDate:
            data.associationDate
              ? new Date(
                  data.associationDate,
                )
              : undefined,


          employeesCount:
            data.employeesCount !== undefined
              ? Number(
                  data.employeesCount,
                )
              : undefined,

        },

      );



    return this.companyRepository.save(
      updated,
    );

  }





  // =========================
  // APROVAR
  // =========================
  async approve(
    companyId:number,
    userId:number,
  ){

    const company =
      await this.findOne(companyId);



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



    return company;

  }





  // =========================
  // REPROVAR
  // =========================
  async reject(
    companyId:number,
    userId:number,
  ){

    const company =
      await this.findOne(companyId);



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





  // =========================
  // UPDATE
  // =========================
  async update(
    id:number,
    data:UpdateCompanyDto,
  ){


    const company =
      await this.findOne(id);



    if(data.password){

      data.password =
        await bcrypt.hash(
          data.password,
          10,
        );

    }



    const updated =
      this.companyRepository.merge(
        company,
        data,
      );



    return this.companyRepository.save(
      updated,
    );

  }





  // =========================
  // REMOVER
  // =========================
  async remove(
    id:number,
  ){

    await this.findOne(id);



    await this.companyRepository.delete(
      id,
    );



    return {

      message:
        'Empresa removida com sucesso.',

    };

  }

}
