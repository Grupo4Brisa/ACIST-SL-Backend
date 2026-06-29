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
} from '@nestjs/swagger';

import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@ApiTags('Approvals')
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @ApiOperation({ summary: 'Listar todas as aprovações' })
  @ApiResponse({ status: 200, description: 'Lista de aprovações retornada com sucesso' })
  @Get()
  findAll() {
    return this.approvalsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar aprovação por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Aprovação encontrada' })
  @ApiResponse({ status: 404, description: 'Aprovação não encontrada' })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.approvalsService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar nova aprovação' })
  @ApiResponse({ status: 201, description: 'Aprovação criada com sucesso' })
  @Post()
  create(
    @Body()
    body: CreateApprovalDto,
  ) {
    return this.approvalsService.create(body);
  }

  @ApiOperation({ summary: 'Atualizar aprovação por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Aprovação atualizada com sucesso' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    body: UpdateApprovalDto,
  ) {
    return this.approvalsService.update(id, body);
  }

  @ApiOperation({ summary: 'Remover aprovação por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Aprovação removida com sucesso' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.approvalsService.remove(id);
  }
}
