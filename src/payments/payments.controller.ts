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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  // =========================
  // LISTAR TODOS
  // =========================
  @Get()
  @ApiOperation({ summary: 'Listar todos os pagamentos' })
  findAll() {
    return this.paymentsService.findAll();
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  // =========================
  // CRIAR PAGAMENTO
  // =========================
  @Post()
  @ApiOperation({ summary: 'Criar pagamento (status PENDING)' })
  @ApiBody({ type: CreatePaymentDto })
  create(@Body() body: CreatePaymentDto) {
    return this.paymentsService.create(body);
  }

  // =========================
  // ATUALIZAÇÃO GERAL (limitada)
  // =========================
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do pagamento (limitado)' })
  @ApiBody({ type: UpdatePaymentDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, body);
  }

  // =========================
  // APROVAR PAGAMENTO
  // =========================
  @Patch(':id/approve')
  @ApiOperation({ summary: 'Aprovar pagamento' })
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.approve(id);
  }

  // =========================
  // MARCAR COMO PAGO
  // =========================
  @Patch(':id/pay')
  @ApiOperation({ summary: 'Marcar pagamento como pago' })
  pay(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.pay(id);
  }

  // =========================
  // CANCELAR PAGAMENTO
  // =========================
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar pagamento' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.cancel(id);
  }

  // =========================
  // REMOVER
  // =========================
  @Delete(':id')
  @ApiOperation({ summary: 'Remover pagamento' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }
}
