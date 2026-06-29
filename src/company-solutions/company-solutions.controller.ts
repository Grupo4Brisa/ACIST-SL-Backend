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
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { CompanySolutionsService } from './company-solutions.service';
import { CreateCompanySolutionDto } from './dto/create-company-solution.dto';
import { UpdateCompanySolutionDto } from './dto/update-company-solution.dto';

@ApiTags('Company Solutions')
@Controller('company-solutions')
export class CompanySolutionsController {
  constructor(private readonly service: CompanySolutionsService) {}

  // CREATE
  @Post()
  @ApiOperation({
    summary: 'Criar vínculo entre empresa e solução',
    description:
      'Associa uma solução a uma empresa. Não permite duplicidade.',
  })
  @ApiBody({ type: CreateCompanySolutionDto })
  @ApiResponse({ status: 201, description: 'Vínculo criado com sucesso' })
  create(@Body() body: CreateCompanySolutionDto) {
    return this.service.create(body);
  }

  // READ ALL
  @Get()
  @ApiOperation({
    summary: 'Listar todos os vínculos empresa x solução',
  })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  findAll() {
    return this.service.findAll();
  }

  // READ ONE
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar vínculo por ID',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // UPDATE
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar vínculo empresa x solução',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateCompanySolutionDto })
  update(
    @Param('id') id: string,
    @Body() body: UpdateCompanySolutionDto,
  ) {
    return this.service.update(+id, body);
  }

  // DELETE
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover vínculo empresa x solução',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
