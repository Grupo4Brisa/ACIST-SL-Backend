import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CompanySolution } from './entities/company-solution.entity';

import { CreateCompanySolutionDto } from './dto/create-company-solution.dto';

import { UpdateCompanySolutionDto } from './dto/update-company-solution.dto';

@Injectable()
export class CompanySolutionsService {
  constructor(
    @InjectRepository(CompanySolution)
    private readonly repo: Repository<CompanySolution>,
  ) {}

  /*
  ==================================================
      CREATE - UM VÍNCULO
  ==================================================
  */

  async create(data: CreateCompanySolutionDto) {
    const exists = await this.repo.findOne({
      where: {
        companyId: data.companyId,

        solutionId: data.solutionId,
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Esta empresa já possui essa solução vinculada',
      );
    }

    const entity = this.repo.create(data);

    return this.repo.save(entity);
  }

  /*
  ==================================================
      CREATE MANY
      SALVAR CHECKBOXES SELECIONADOS
  ==================================================
  */

  async createMany(
    companyId: number,

    solutionIds: number[],
  ) {
    if (!solutionIds || solutionIds.length === 0) {
      throw new BadRequestException('Nenhuma solução selecionada');
    }

    const created: CompanySolution[] = [];

    for (const solutionId of solutionIds) {
      const exists = await this.repo.findOne({
        where: {
          companyId,

          solutionId,
        },
      });

      /*
      Evita duplicidade
      */

      if (!exists) {
        const entity = this.repo.create({
          companyId,

          solutionId,
        });

        const saved = await this.repo.save(entity);

        created.push(saved);
      }
    }

    return {
      message: 'Soluções vinculadas com sucesso',

      data: created,
    };
  }

  /*
  ==================================================
      READ ALL
  ==================================================
  */

  async findAll() {
    return this.repo.find();
  }

  /*
  ==================================================
      BUSCAR POR ID
  ==================================================
  */

  async findOne(id: number) {
    const entity = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(`CompanySolution ${id} not found`);
    }

    return entity;
  }

  /*
  ==================================================
      LISTAR SOLUÇÕES DE UMA EMPRESA
  ==================================================
  */

  async findByCompany(companyId: number) {
    return this.repo.find({
      where: {
        companyId,
      },
    });
  }

  /*
  ==================================================
      UPDATE
  ==================================================
  */

  async update(
    id: number,

    data: UpdateCompanySolutionDto,
  ) {
    const entity = await this.findOne(id);

    Object.assign(
      entity,

      data,
    );

    return this.repo.save(entity);
  }

  /*
  ==================================================
      DELETE
  ==================================================
  */

  async remove(id: number) {
    await this.findOne(id);

    await this.repo.delete(id);

    return {
      message: 'CompanySolution deleted successfully',
    };
  }
}
