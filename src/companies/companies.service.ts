import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  findAll() {
    return this.companyRepository.find();
  }

  findOne(id: number) {
    return this.companyRepository.findOne({
      where: { id },
    });
  }

  create(companyData: CreateCompanyDto) {
    const company = this.companyRepository.create(companyData);

    return this.companyRepository.save(company);
  }

  async update(
    id: number,
  updateCompanyDto: UpdateCompanyDto) {
    await this.companyRepository.update(id,updateCompanyDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.companyRepository.delete(id);

    return {
      message: 'Empresa removida com sucesso',
    };
  }
}
