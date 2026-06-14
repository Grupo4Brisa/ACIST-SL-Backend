import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanySolution } from './entities/company-solution.entity';
import { CreateCompanySolutionDto } from './dto/create-company-solution.dto';

@Injectable()
export class CompanySolutionsService {
  constructor(
    @InjectRepository(CompanySolution)
    private readonly companySolutionRepository: Repository<CompanySolution>,
  ) {}

  findAll() {
    return this.companySolutionRepository.find();
  }

  create(data: CreateCompanySolutionDto) {
    const companySolution = this.companySolutionRepository.create(data);

    return this.companySolutionRepository.save(companySolution);
  }
}
