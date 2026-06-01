import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyContact } from './entities/company-contact.entity';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';

@Injectable()
export class CompanyContactsService {
  constructor(
    @InjectRepository(CompanyContact)
    private readonly companyContactRepository: Repository<CompanyContact>,
  ) {}

  findAll() {
    return this.companyContactRepository.find();
  }

  create(contactData: CreateCompanyContactDto) {
    const contact = this.companyContactRepository.create(contactData);

    return this.companyContactRepository.save(contact);
  }
}
