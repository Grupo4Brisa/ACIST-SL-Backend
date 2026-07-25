import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { SolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

@ApiTags('Solutions')
@Controller('solutions')
export class SolutionsController {
  constructor(private readonly service: SolutionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar soluções' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar solução por ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar solução' })
  create(@Body() body: CreateSolutionDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar solução' })
  update(
    @Param('id') id: string,
    @Body() body: UpdateSolutionDto,
  ) {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover solução' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
