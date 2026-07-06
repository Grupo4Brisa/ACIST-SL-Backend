import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ApprovalsService } from './approvals.service';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@ApiTags('Approvals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('approvals')
export class ApprovalsController {
  constructor(
    private readonly approvalsService: ApprovalsService,
  ) {}

  // =========================
  // LISTAR HISTÓRICO COMPLETO
  // =========================
  @Get()
  @ApiOperation({ summary: 'Listar histórico de aprovações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de aprovações retornada com sucesso',
  })
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  findAll() {
    return this.approvalsService.findAll();
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  @Get(':id')
  @ApiOperation({ summary: 'Buscar aprovação por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Aprovação encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Aprovação não encontrada',
  })
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.approvalsService.findOne(id);
  }

  // =========================
  // LISTAR POR EMPRESA
  // =========================
  @Get('company/:companyId')
  @ApiOperation({ summary: 'Listar aprovações por empresa' })
  @ApiParam({ name: 'companyId', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Histórico da empresa retornado com sucesso',
  })
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  findByCompany(
    @Param('companyId', ParseIntPipe)
    companyId: number,
  ) {
    return this.approvalsService.findByCompany(companyId);
  }
}
