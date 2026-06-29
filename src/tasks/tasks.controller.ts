import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { TasksService } from './tasks.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas as tarefas',
  })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar tarefa por ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar tarefa',
  })
  create(
    @Body()
    body: CreateTaskDto,
  ) {
    return this.tasksService.create(body);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar tarefa',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir tarefa',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.tasksService.remove(id);
  }
}
