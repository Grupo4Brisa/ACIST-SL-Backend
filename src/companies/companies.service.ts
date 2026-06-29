import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompleteCompanyDto } from './dto/complete-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyStatus } from './company-status.enum';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // =========================
  // LISTAR TODAS
  // =========================
  findAll() {
    return this.companyRepository.find();
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  findOne(id: number) {
    return this.companyRepository.findOne({ where: { id } });
  }

  // =========================
  // ETAPA 1 - CRIAÇÃO INICIAL
  // =========================
  createLanding(companyData: CreateCompanyDto) {
    const company = this.companyRepository.create({
      ...companyData,
      status: CompanyStatus.INCOMPLETE,
    });

    return this.companyRepository.save(company);
  }

  // =========================
  // ETAPA 2 - COMPLETAR CADASTRO
  // =========================
  async complete(id: number, data: CompleteCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) return null;

    const updated = this.companyRepository.merge(company, {
      ...data,
      status: CompanyStatus.ACTIVE,

      // 🔥 CORREÇÃO AQUI (NÃO USAR null)
      foundationDate: data.foundationDate
        ? new Date(data.foundationDate)
        : undefined,

      associationDate: data.associationDate
        ? new Date(data.associationDate)
        : undefined,

      // 🔥 garante número correto se vier string
      employeesCount: data.employeesCount
        ? Number(data.employeesCount)
        : undefined,
    });

    return this.companyRepository.save(updated);
  }

  // =========================
  // UPDATE GERAL (ADMIN)
  // =========================
  async update(id: number, data: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) return null;

    const updated = this.companyRepository.merge(company, data);

    return this.companyRepository.save(updated);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    await this.companyRepository.delete(id);

    return {
      message: 'Empresa removida com sucesso',
    };
  }
}
