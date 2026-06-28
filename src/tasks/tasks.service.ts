import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  findAll() {
    return this.taskRepository.find();
  }

  create(taskData: CreateTaskDto) {
    const task = this.taskRepository.create(taskData);

    return this.taskRepository.save(task);
  }

  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  update(id: number, taskData: UpdateTaskDto) {
    return this.taskRepository.update(id, taskData);
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }
}
