import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanySolution } from './entities/company-solution.entity';
import { CreateCompanySolutionDto } from './dto/create-company-solution.dto';
import { UpdateCompanySolutionDto } from './dto/update-company-solution.dto';

@Injectable()
export class CompanySolutionsService {
  constructor(
    @InjectRepository(CompanySolution)
    private readonly companySolutionRepository: Repository<CompanySolution>,
  ) {}

  // CREATE
  async create(data: CreateCompanySolutionDto) {
    const entity = this.companySolutionRepository.create(data);
    return this.companySolutionRepository.save(entity);
  }

  // READ ALL
  async findAll() {
    return this.companySolutionRepository.find();
  }

  // READ ONE
  async findOne(id: number) {
    const entity = await this.companySolutionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`CompanySolution ${id} not found`);
    }

    return entity;
  }

  // UPDATE
  async update(id: number, data: UpdateCompanySolutionDto) {
    const entity = await this.findOne(id);

    Object.assign(entity, data);

    return this.companySolutionRepository.save(entity);
  }

  // DELETE
  async remove(id: number) {
    await this.findOne(id);

    await this.companySolutionRepository.delete(id);

    return { message: 'CompanySolution deleted successfully' };
  }
}
