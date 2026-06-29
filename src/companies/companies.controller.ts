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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { CompaniesService } from './companies.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { CompleteCompanyDto } from './dto/complete-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // =========================
  // LISTAR TODAS
  // =========================
  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas retornada com sucesso' })
  findAll() {
    return this.companiesService.findAll();
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }

  // =========================
  // ETAPA 1 - LANDING (CREATE)
  // =========================
  @Post('landing')
  @ApiOperation({ summary: 'Criar empresa (cadastro inicial)' })
  @ApiBody({
    type: CreateCompanyDto,
    description: 'Dados mínimos para criar uma empresa',
  })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso (INCOMPLETE)' })
  createLanding(@Body() body: CreateCompanyDto) {
    return this.companiesService.createLanding(body);
  }

  // =========================
  // ETAPA 2 - COMPLETAR CADASTRO
  // =========================
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Completar cadastro da empresa' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: CompleteCompanyDto,
    description: 'Dados adicionais para completar o cadastro da empresa',
  })
  @ApiResponse({ status: 200, description: 'Cadastro completado com sucesso' })
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CompleteCompanyDto,
  ) {
    return this.companiesService.complete(id, body);
  }

  // =========================
  // UPDATE GERAL (ADMIN)
  // =========================
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar empresa (geral)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: UpdateCompanyDto,
    description: 'Atualização geral da empresa',
  })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, body);
  }

  // =========================
  // DELETE
  // =========================
  @Delete(':id')
  @ApiOperation({ summary: 'Remover empresa' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Empresa removida com sucesso' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }
}
