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
import { PaymentStatus } from './payment-status.enum';

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
      throw new NotFoundException('Pagamento não encontrado');
    }

    return payment;
  }

  // =========================
  // CREATE
  // =========================
  async create(data: CreatePaymentDto) {
    if (data.amount <= 0) {
      throw new BadRequestException('O valor deve ser maior que zero');
    }

    const payment = this.paymentRepository.create({
      ...data,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepository.save(payment);
  }

  // =========================
  // UPDATE (limitado)
  // =========================
  async update(id: number, data: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException(
        'Pagamento já foi pago e não pode ser alterado',
      );
    }

    if (data.amount !== undefined && data.amount <= 0) {
      throw new BadRequestException('O valor deve ser maior que zero');
    }

    const updated = this.paymentRepository.merge(payment, data);

    return this.paymentRepository.save(updated);
  }

  // =========================
  // APPROVE
  // =========================
  async approve(id: number) {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        'Somente pagamentos PENDING podem ser aprovados',
      );
    }

    payment.status = PaymentStatus.APPROVED;

    return this.paymentRepository.save(payment);
  }

  // =========================
  // PAY
  // =========================
  async pay(id: number) {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.APPROVED) {
      throw new BadRequestException(
        'Somente pagamentos APPROVED podem ser pagos',
      );
    }

    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();

    return this.paymentRepository.save(payment);
  }

  // =========================
  // CANCEL
  // =========================
  async cancel(id: number) {
    const payment = await this.findOne(id);

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException(
        'Pagamento já pago não pode ser cancelado',
      );
    }

    payment.status = PaymentStatus.CANCELLED;

    return this.paymentRepository.save(payment);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const payment = await this.findOne(id);

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException(
        'Pagamento pago não pode ser removido',
      );
    }

    await this.paymentRepository.delete(id);

    return {
      message: 'Pagamento removido com sucesso',
    };
  }
}
