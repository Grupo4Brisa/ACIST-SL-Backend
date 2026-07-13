import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { randomUUID } from 'crypto';

import { LoginToken } from './entities/login-token.entity';

import { CreateLoginTokenDto } from './dto/create-login-token.dto';
import { UpdateLoginTokenDto } from './dto/update-login-token.dto';



@Injectable()
export class LoginTokensService {


  constructor(

    @InjectRepository(LoginToken)
    private readonly loginTokensRepository:
      Repository<LoginToken>,

  ) {}







  // =====================================
  // CRIAR TOKEN AUTOMÁTICO
  //
  // Validade: 7 dias
  // =====================================
  async createToken(
    companyId:number,
  ){


    const token =
      randomUUID();



    const expiresAt =
      new Date();



    expiresAt.setDate(
      expiresAt.getDate() + 7,
    );



    const loginToken =
      this.loginTokensRepository.create({

        companyId,

        token,

        expiresAt,

        used:false,

      });



    return this.loginTokensRepository.save(
      loginToken,
    );

  }









  // =====================================
  // CRIAR TOKEN MANUAL
  // =====================================
  async create(
    createLoginTokenDto:CreateLoginTokenDto,
  ){


    const loginToken =
      this.loginTokensRepository.create(
        createLoginTokenDto,
      );


    return this.loginTokensRepository.save(
      loginToken,
    );

  }









  // =====================================
  // VALIDAR TOKEN
  //
  // Usado no link do email
  // =====================================
  async validateToken(
    token:string,
  ){


    const loginToken =
      await this.loginTokensRepository.findOne({

        where:{
          token,
        },

      });





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
      new Date()
      >
      loginToken.expiresAt
    ){

      throw new BadRequestException(
        'Token expirado.',
      );

    }





    return {

      valid:true,

      companyId:
        loginToken.companyId,

    };

  }









  // =====================================
  // BUSCAR TOKEN PELO VALOR
  //
  // Usado no fluxo de completar cadastro
  // =====================================
  async findByToken(
    token:string,
  ){

    return this.loginTokensRepository.findOne({

      where:{
        token,
      },

    });

  }









  // =====================================
  // MARCAR TOKEN COMO UTILIZADO
  //
  // Usado após completar cadastro
  // =====================================
  async markAsUsed(
    token:string,
  ){


    const loginToken =
      await this.findByToken(
        token,
      );





    if(!loginToken){

      throw new NotFoundException(
        'Token não encontrado.',
      );

    }





    loginToken.used =
      true;




    return this.loginTokensRepository.save(
      loginToken,
    );

  }









  // =====================================
  // CONSUMIR TOKEN
  //
  // Após completar cadastro
  // =====================================
  async consumeToken(
    token:string,
  ){


    const loginToken =
      await this.loginTokensRepository.findOne({

        where:{
          token,
        },

      });





    if(!loginToken){

      throw new NotFoundException(
        'Token não encontrado.',
      );

    }





    loginToken.used =
      true;




    return this.loginTokensRepository.save(
      loginToken,
    );

  }









  // =====================================
  // LISTAR TOKENS
  // =====================================
  findAll(){

    return this.loginTokensRepository.find({

      order:{
        createdAt:'DESC',
      },

    });

  }









  // =====================================
  // BUSCAR POR ID
  // =====================================
  findOne(
    id:number,
  ){

    return this.loginTokensRepository.findOne({

      where:{
        id,
      },

    });

  }









  // =====================================
  // ATUALIZAR
  // =====================================
  async update(
    id:number,
    updateLoginTokenDto:UpdateLoginTokenDto,
  ){


    await this.loginTokensRepository.update(

      id,

      updateLoginTokenDto,

    );



    return this.findOne(id);

  }









  // =====================================
  // REMOVER
  // =====================================
  async remove(
    id:number,
  ){


    await this.loginTokensRepository.delete(
      id,
    );



    return {

      message:
        'Token removido com sucesso.',

    };

  }


}
