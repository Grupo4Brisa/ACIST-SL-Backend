import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  findAll() {
    return this.paymentRepository.find();
  }

  create(paymentData: CreatePaymentDto) {
    const payment = this.paymentRepository.create(paymentData);

    return this.paymentRepository.save(payment);
  }
}
