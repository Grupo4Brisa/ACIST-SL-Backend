import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Solution } from './entities/solution.entity';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

@Injectable()
export class SolutionsService {
  constructor(
    @InjectRepository(Solution)
    private readonly repo: Repository<Solution>,
  ) {}

  // =========================
  // LISTAR
  // =========================
  findAll() {
    return this.repo.find();
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  async findOne(id: number) {
    const solution = await this.repo.findOne({ where: { id } });

    if (!solution) {
      throw new NotFoundException('Solution não encontrada');
    }

    return solution;
  }

  // =========================
  // CREATE (NOME ÚNICO)
  // =========================
  async create(data: CreateSolutionDto) {
    const exists = await this.repo.findOne({
      where: { name: data.name },
    });

    if (exists) {
      throw new ConflictException('Já existe uma solution com esse nome');
    }

    const solution = this.repo.create(data);

    return this.repo.save(solution);
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, data: UpdateSolutionDto) {
    const solution = await this.findOne(id);

    if (data.name) {
      const exists = await this.repo.findOne({
        where: { name: data.name },
      });

      if (exists && exists.id !== id) {
        throw new ConflictException('Nome já está em uso');
      }
    }

    const updated = this.repo.merge(solution, data);

    return this.repo.save(updated);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const solution = await this.findOne(id);

    await this.repo.delete(id);

    return {
      message: 'Solution removida com sucesso',
    };
  }
}
