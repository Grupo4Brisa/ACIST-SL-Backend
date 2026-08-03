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

import { CompanyDisclosuresService } from './company-disclosures.service';

import { CreateCompanyDisclosureDto } from './dto/create-company-disclosure.dto';

import { UpdateCompanyDisclosureDto } from './dto/update-company-disclosure.dto';

@ApiTags('Company Disclosures')
@Controller('company-disclosures')
export class CompanyDisclosuresController {
  constructor(private readonly service: CompanyDisclosuresService) {}

  // ==================================================
  // CRIAR DIVULGAÇÃO
  // ==================================================

  @Post()
  @ApiOperation({
    summary: 'Criar divulgação da empresa',
  })
  @ApiBody({
    type: CreateCompanyDisclosureDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Divulgação criada com sucesso',
  })
  create(
    @Body()
    body: CreateCompanyDisclosureDto,
  ) {
    return this.service.create(body);
  }

  // ==================================================
  // LISTAR TODAS
  // ==================================================

  @Get()
  @ApiOperation({
    summary: 'Listar todas as divulgações',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista retornada com sucesso',
  })
  findAll() {
    return this.service.findAll();
  }

  // ==================================================
  // BUSCAR POR EMPRESA
  // ==================================================

  @Get('company/:companyId')
  @ApiOperation({
    summary: 'Buscar divulgação por empresa',
  })
  @ApiParam({
    name: 'companyId',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Divulgação encontrada',
  })
  findByCompany(
    @Param('companyId')
    companyId: string,
  ) {
    return this.service.findByCompany(Number(companyId));
  }

  // ==================================================
  // BUSCAR POR ID
  // ==================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar divulgação por ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado',
  })
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.service.findOne(Number(id));
  }

  // ==================================================
  // ATUALIZAR
  // ==================================================

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar divulgação da empresa',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: UpdateCompanyDisclosureDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Divulgação atualizada com sucesso',
  })
  update(
    @Param('id')
    id: string,

    @Body()
    body: UpdateCompanyDisclosureDto,
  ) {
    return this.service.update(Number(id), body);
  }

  // ==================================================
  // REMOVER
  // ==================================================

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover divulgação',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Divulgação removida com sucesso',
  })
  remove(
    @Param('id')
    id: string,
  ) {
    return this.service.remove(Number(id));
  }
}
