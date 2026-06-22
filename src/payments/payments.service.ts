import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.paymentRepository.find();
  }

  findOne(id: number) {
    return this.paymentRepository.findOne({
      where: { id },
    });
  }

  create(paymentData: CreatePaymentDto) {
    const payment =
      this.paymentRepository.create(paymentData);

    return this.paymentRepository.save(payment);
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    await this.paymentRepository.update(
      id,
      updatePaymentDto,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.paymentRepository.delete(id);

    return {
      message: 'Pagamento removido com sucesso',
    };
  }
}
