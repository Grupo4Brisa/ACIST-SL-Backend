import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyContact } from './entities/company-contact.entity';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';
import { UpdateCompanyContactDto } from './dto/update-company-contact.dto';

@Injectable()
export class CompanyContactsService {
  constructor(
    @InjectRepository(CompanyContact)
    private readonly companyContactRepository: Repository<CompanyContact>,
  ) {}

  findAll() {
    return this.companyContactRepository.find();
  }

  findOne(id: number) {
    return this.companyContactRepository.findOneBy({ id });
  }

  create(contactData: CreateCompanyContactDto) {
    const contact = this.companyContactRepository.create(contactData);

    return this.companyContactRepository.save(contact);
  }

  update(id: number, contactData: UpdateCompanyContactDto) {
    return this.companyContactRepository.update(id, contactData);
  }

  remove(id: number) {
    return this.companyContactRepository.delete(id);
  }
}
