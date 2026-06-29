import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // =========================
  // LISTAR
  // =========================

  findAll() {
    return this.paymentRepository.find();
  }

  // =========================
  // BUSCAR
  // =========================

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(
        'Pagamento não encontrado',
      );
    }

    return payment;
  }

  // =========================
  // CREATE
  // =========================

  async create(data: CreatePaymentDto) {
    if (data.amount <= 0) {
      throw new BadRequestException(
        'O valor deve ser maior que zero',
      );
    }

    const payment = this.paymentRepository.create({
      ...data,
      status: 'PENDING',
    });

    return this.paymentRepository.save(payment);
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    id: number,
    data: UpdatePaymentDto,
  ) {
    const payment = await this.findOne(id);

    if (data.amount !== undefined && data.amount <= 0) {
      throw new BadRequestException(
        'O valor deve ser maior que zero',
      );
    }

    if (
      data.status &&
      data.status.toUpperCase() === 'PAID'
    ) {
      data.paidAt ??= new Date();
    }

    if (
      data.paidAt &&
      data.status &&
      data.status.toUpperCase() !== 'PAID'
    ) {
      throw new BadRequestException(
        'paidAt só pode ser informado quando o status for PAID',
      );
    }

    const updated = this.paymentRepository.merge(
      payment,
      data,
    );

    return this.paymentRepository.save(updated);
  }

  // =========================
  // DELETE
  // =========================

  async remove(id: number) {
    await this.findOne(id);

    await this.paymentRepository.delete(id);

    return {
      message: 'Pagamento removido com sucesso',
    };
  }
}
