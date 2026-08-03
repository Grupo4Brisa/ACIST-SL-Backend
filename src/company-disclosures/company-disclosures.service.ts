import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CompanyDisclosure } from './entities/company-disclosure.entity';

import { CreateCompanyDisclosureDto } from './dto/create-company-disclosure.dto';

import { UpdateCompanyDisclosureDto } from './dto/update-company-disclosure.dto';

@Injectable()
export class CompanyDisclosuresService {
  constructor(
    @InjectRepository(CompanyDisclosure)
    private readonly repo: Repository<CompanyDisclosure>,
  ) {}

  // ==================================================
  // CREATE
  // Criar divulgação da empresa
  // ==================================================

  async create(data: CreateCompanyDisclosureDto) {
    const exists = await this.repo.findOne({
      where: {
        companyId: data.companyId,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Esta empresa já possui uma divulgação cadastrada',
      );
    }

    const disclosure = this.repo.create(data);

    return this.repo.save(disclosure);
  }

  // ==================================================
  // LISTAR TODAS
  // ==================================================

  async findAll() {
    return this.repo.find();
  }

  // ==================================================
  // BUSCAR POR ID
  // ==================================================

  async findOne(id: number) {
    const disclosure = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!disclosure) {
      throw new NotFoundException(`CompanyDisclosure ${id} não encontrada`);
    }

    return disclosure;
  }

  // ==================================================
  // BUSCAR POR EMPRESA
  // ==================================================

  async findByCompany(companyId: number) {
    return this.repo.findOne({
      where: {
        companyId,
      },
    });
  }

  // ==================================================
  // UPDATE
  // ==================================================

  async update(
    id: number,

    data: UpdateCompanyDisclosureDto,
  ) {
    const disclosure = await this.findOne(id);

    Object.assign(
      disclosure,

      data,
    );

    return this.repo.save(disclosure);
  }

  // ==================================================
  // DELETE
  // ==================================================

  async remove(id: number) {
    await this.findOne(id);

    await this.repo.delete(id);

    return {
      message: 'Divulgação removida com sucesso',
    };
  }
}
