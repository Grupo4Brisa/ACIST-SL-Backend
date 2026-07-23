import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';


import { CompanyContact } from './entities/company-contact.entity';

import { CreateCompanyContactDto } from './dto/create-company-contact.dto';



@Injectable()
export class CompanyContactsService {


  constructor(

    @InjectRepository(CompanyContact)

    private readonly companyContactRepository:
      Repository<CompanyContact>,

  ) {}





  // =====================================
  // LISTAR TODOS OS CONTATOS
  // =====================================

  findAll() {

    return this.companyContactRepository.find();

  }





  // =====================================
  // LISTAR CONTATOS POR EMPRESA
  // =====================================

  findByCompany(
    companyId:number,
  ) {

    return this.companyContactRepository.find({

      where:{
        companyId,
      },

      order:{
        id:'ASC',
      },

    });

  }





  // =====================================
  // CRIAR UM CONTATO
  // =====================================

  async create(
    contactData:CreateCompanyContactDto,
  ) {


    const contact =
      this.companyContactRepository.create(
        contactData,
      );


    return this.companyContactRepository.save(
      contact,
    );

  }





  // =====================================
  // CRIAR VÁRIOS CONTATOS
  // USADO NO CADASTRO DA EMPRESA
  // =====================================

  async createMany(
    contacts:CreateCompanyContactDto[],
  ) {


    const entities =
      this.companyContactRepository.create(
        contacts,
      );


    return this.companyContactRepository.save(
      entities,
    );

  }





}