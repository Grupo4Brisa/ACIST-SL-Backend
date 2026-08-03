import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CompaniesService } from './companies.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { CompleteCompanyDto } from './dto/complete-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FilterCompanyDto } from './dto/filter-company.dto';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { UserRole } from '../users/user-role.enum';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // =====================================
  // LISTAR EMPRESAS
  // =====================================

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar empresas com filtros',
  })
  @ApiResponse({
    status: 200,

    description: 'Lista retornada com sucesso',
  })
  findAll(
    @Query()
    filters: FilterCompanyDto,
  ) {
    return this.companiesService.findAll(filters);
  }

  // =====================================
  // BUSCAR EMPRESA POR ID
  // =====================================

  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Buscar empresa por ID',
  })
  @ApiParam({
    name: 'id',

    example: 1,
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.companiesService.findOne(id);
  }

  // =====================================
  // CADASTRO INICIAL LANDING
  // PÚBLICO
  // =====================================

  @Post('landing')
  @ApiOperation({
    summary: 'Criar empresa (cadastro inicial)',
  })
  @ApiBody({
    type: CreateCompanyDto,
  })
  createLanding(
    @Body()
    body: CreateCompanyDto,
  ) {
    return this.companiesService.createLanding(body);
  }
  // =====================================
  // COMPLETAR CADASTRO
  // USUÁRIO AUTENTICADO
  // =====================================

  @Patch(':id/complete')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Completar cadastro da empresa',
  })
  @ApiParam({
    name: 'id',

    example: 1,
  })
  @ApiBody({
    type: CompleteCompanyDto,
  })
  complete(
    @Param(
      'id',

      ParseIntPipe,
    )
    id: number,

    @Body()
    body: CompleteCompanyDto,

    @Req()
    req,
  ) {
    return this.companiesService.complete(
      id,

      body,

      req.user,
    );
  }

  // =====================================
  // COMPLETAR CADASTRO POR TOKEN
  // PÚBLICO
  // =====================================

  // IMPORTANTE:
  // Esta rota fica antes do PATCH ':id'
  // para evitar conflito de rota

  @Patch('complete/:token')
  @ApiOperation({
    summary: 'Completar cadastro por token',
  })
  @ApiParam({
    name: 'token',

    example: '4af7d7d2-a640-4e6c-a53c-8d1b60b56d5d',
  })
  @ApiBody({
    type: CompleteCompanyDto,
  })
  completeByToken(
    @Param('token')
    token: string,

    @Body()
    body: CompleteCompanyDto,
  ) {
    return this.companiesService.completeByToken(
      token,

      body,
    );
  }

  // =====================================
  // APROVAR EMPRESA
  // SOMENTE APROVADOR
  // =====================================

  @Patch(':id/approve')
  @ApiBearerAuth('access-token')
  @UseGuards(
    JwtAuthGuard,

    RolesGuard,
  )
  @Roles(UserRole.COLABORADOR_APROVADOR, UserRole.COLABORADOR_ADMIN)
  @ApiOperation({
    summary: 'Aprovar empresa',
  })
  @ApiParam({
    name: 'id',

    example: 1,
  })
  approve(
    @Param(
      'id',

      ParseIntPipe,
    )
    id: number,

    @Req()
    req,
  ) {
    return this.companiesService.approve(
      id,

      req.user.id,
    );
  }

  // =====================================
  // REPROVAR EMPRESA
  // SOMENTE APROVADOR
  // =====================================

  @Patch(':id/reject')
  @ApiBearerAuth('access-token')
  @UseGuards(
    JwtAuthGuard,

    RolesGuard,
  )
  @Roles(UserRole.COLABORADOR_APROVADOR, UserRole.COLABORADOR_ADMIN)
  @ApiOperation({
    summary: 'Reprovar empresa',
  })
  @ApiParam({
    name: 'id',

    example: 1,
  })
  reject(
    @Param(
      'id',

      ParseIntPipe,
    )
    id: number,

    @Req()
    req,
  ) {
    return this.companiesService.reject(
      id,

      req.user.id,
    );
  }

  // =====================================
  // ATUALIZAR EMPRESA
  // USUÁRIO AUTENTICADO
  // =====================================

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar empresa',
  })
  @ApiParam({
    name: 'id',

    example: 1,
  })
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBody({
    type: UpdateCompanyDto,
  })
  update(
    @Param(
      'id',

      ParseIntPipe,
    )
    id: number,

    @Body()
    body: UpdateCompanyDto,

    @Req()
    req,
  ) {
    return this.companiesService.update(
      id,

      body,

      req.user,
    );
  }

  // =====================================
  // REMOVER EMPRESA
  // ADMIN OU APROVADOR
  // =====================================

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(
    JwtAuthGuard,

    RolesGuard,
  )
  @Roles(
    UserRole.COLABORADOR_ADMIN,

    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary: 'Remover empresa',
  })
  @ApiParam({
    name: 'id',

    example: 1,
  })
  remove(
    @Param(
      'id',

      ParseIntPipe,
    )
    id: number,
  ) {
    return this.companiesService.remove(id);
  }
}
