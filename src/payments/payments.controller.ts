import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // =========================
  // LISTAR TODOS
  // SOMENTE COLABORADOR
  // =========================
  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLABORADOR_ADMIN, UserRole.COLABORADOR_APROVADOR)
  @ApiOperation({ summary: 'Listar todos os pagamentos' })
  findAll() {
    return this.paymentsService.findAll();
  }

  // =========================
  // BUSCAR POR ID
  // SOMENTE COLABORADOR
  // =========================
  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLABORADOR_ADMIN, UserRole.COLABORADOR_APROVADOR)
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  // =========================
  // CRIAR PAGAMENTO
  // PÚBLICO
  // Chamado pelo associado na tela de
  // pagamento PIX, antes de ter qualquer
  // login de colaborador.
  // =========================
  @Post()
  @ApiOperation({ summary: 'Criar pagamento (status PENDING)' })
  @ApiBody({ type: CreatePaymentDto })
  create(@Body() body: CreatePaymentDto) {
    return this.paymentsService.create(body);
  }

  // =========================
  // ATUALIZAÇÃO GERAL
  // SOMENTE COLABORADOR
  // =========================
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLABORADOR_ADMIN, UserRole.COLABORADOR_APROVADOR)
  @ApiOperation({ summary: 'Atualizar dados do pagamento' })
  @ApiBody({ type: UpdatePaymentDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, body);
  }

  // =========================
  // APROVAR PAGAMENTO
  // SOMENTE APROVADOR
  // =========================
  @Patch(':id/approve')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLABORADOR_APROVADOR)
  @ApiOperation({ summary: 'Aprovar pagamento' })
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.approve(id);
  }

  // =========================
  // MARCAR COMO PAGO
  // SOMENTE COLABORADOR
  // =========================
  @Patch(':id/pay')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLABORADOR_ADMIN, UserRole.COLABORADOR_APROVADOR)
  @ApiOperation({ summary: 'Marcar pagamento como pago' })
  pay(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.pay(id);
  }

  // =========================
  // CANCELAR PAGAMENTO
  // SOMENTE COLABORADOR
  // =========================
  @Patch(':id/cancel')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLABORADOR_ADMIN, UserRole.COLABORADOR_APROVADOR)
  @ApiOperation({ summary: 'Cancelar pagamento' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.cancel(id);
  }

  // =========================
  // REMOVER
  // SOMENTE COLABORADOR
  // =========================
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLABORADOR_ADMIN, UserRole.COLABORADOR_APROVADOR)
  @ApiOperation({ summary: 'Remover pagamento' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }
}
