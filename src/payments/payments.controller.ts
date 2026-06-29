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
  @ApiOperation({
    summary: 'Listar todos os pagamentos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos retornada com sucesso.',
  })
  findAll() {
    return this.paymentsService.findAll();
  }

  // =========================
  // BUSCAR POR ID
  // =========================

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar pagamento por ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Pagamento encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pagamento não encontrado.',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.paymentsService.findOne(id);
  }

  // =========================
  // CRIAR
  // =========================

  @Post()
  @ApiOperation({
    summary: 'Cadastrar pagamento',
  })
  @ApiBody({
    type: CreatePaymentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Pagamento cadastrado com sucesso.',
  })
  create(
    @Body()
    body: CreatePaymentDto,
  ) {
    return this.paymentsService.create(body);
  }

  // =========================
  // ATUALIZAR
  // =========================

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar pagamento',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: UpdatePaymentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Pagamento atualizado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pagamento não encontrado.',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, body);
  }

  // =========================
  // REMOVER
  // =========================

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover pagamento',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Pagamento removido com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pagamento não encontrado.',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.paymentsService.remove(id);
  }
}
