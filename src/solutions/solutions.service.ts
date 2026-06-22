import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Solution } from './entities/solution.entity';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

@Injectable()
export class SolutionsService {
  constructor(
    @InjectRepository(Solution)
    private readonly solutionRepository: Repository<Solution>,
  ) {}

  findAll() {
    return this.solutionRepository.find();
  }

  create(solutionData: CreateSolutionDto) {
    const solution = this.solutionRepository.create(solutionData);

    return this.solutionRepository.save(solution);
  }

  findOne(id: number) {
    return this.solutionRepository.findOneBy({ id });
  }

  update(id: number, solutionData: UpdateSolutionDto) {
    return this.solutionRepository.update(id, solutionData);
  }

  remove(id: number) {
    return this.solutionRepository.delete(id);
  }
}
