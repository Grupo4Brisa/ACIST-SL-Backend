import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  // =========================
  // LISTAR
  // =========================

  findAll() {
    return this.repository.find();
  }

  findByCompany(companyId: number) {
    return this.repository.find({ where: { companyId } });
  }

  // =========================
  // BUSCAR
  // =========================

  async findOne(id: number) {
    const task = await this.repository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  // =========================
  // CREATE
  // =========================

  async create(data: CreateTaskDto) {
    if (new Date(data.dueDate).getTime() < Date.now()) {
      throw new BadRequestException('A data limite não pode estar no passado');
    }

    const task = this.repository.create({
      ...data,
      status: 'PENDING',
    });

    return this.repository.save(task);
  }

  // =========================
  // UPDATE
  // =========================

  async update(id: number, data: UpdateTaskDto) {
    const task = await this.findOne(id);

    if (data.dueDate && new Date(data.dueDate).getTime() < Date.now()) {
      throw new BadRequestException('A data limite não pode estar no passado');
    }

    const updated = this.repository.merge(task, data);

    return this.repository.save(updated);
  }

  // =========================
  // DELETE
  // =========================

  async remove(id: number) {
    await this.findOne(id);

    await this.repository.delete(id);

    return {
      message: 'Tarefa removida com sucesso',
    };
  }
}
