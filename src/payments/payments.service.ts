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

import { CompaniesService } from '../companies/companies.service';
import { CompanyStatus } from '../companies/company-status.enum';

import { LoginTokensService } from '../login-tokens/login-tokens.service'; 
import { MailService } from '../mail/mail.service'; 
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly companiesService: CompaniesService,

    private readonly loginTokensService: LoginTokensService, 
    
    private readonly mailService: MailService,               
    
    private readonly configService: ConfigService,           
  ) {}

  // =========================
  // LISTAR
  // Enriquece cada pagamento com o nome
  // da empresa (mesmo padrão usado em
  // DocumentsService.findAll()).
  // =========================
  async findAll() {

    const payments = await this.paymentRepository.find();

    const companyIds = [
      ...new Set(payments.map(p => p.companyId)),
    ];

    const companies =
      await this.companiesService.findNamesByIds(companyIds);

    const companyMap = new Map(
      companies.map(c => [c.id, c.companyName]),
    );

    return payments.map(payment => ({
      ...payment,
      companyName: companyMap.get(payment.companyId),
    }));

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
  // Pagamento pode ser criado em qualquer etapa
  // do cadastro (INCOMPLETE, PENDING_APPROVAL ou
  // ACTIVE) — a aprovação do pagamento é
  // independente da aprovação da empresa pelo
  // aprovador. Só bloqueia empresa já INACTIVE.
  // =========================
  async create(data: CreatePaymentDto) {
    const company = await this.companiesService.findOne(
      data.companyId,
    );

    if (company.status === CompanyStatus.INACTIVE) {
      throw new BadRequestException(
        'Empresa inativa não pode registrar pagamentos.',
      );
    }

    if (data.amount <= 0) {
      throw new BadRequestException(
        'O valor deve ser maior que zero',
      );
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

    if (
      data.amount !== undefined &&
      data.amount <= 0
    ) {
      throw new BadRequestException(
        'O valor deve ser maior que zero',
      );
    }

    const updated = this.paymentRepository.merge(
      payment,
      data,
    );

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
    throw new BadRequestException('Somente pagamentos APPROVED podem ser pagos');
  }

  payment.status = PaymentStatus.PAID;
  payment.paidAt = new Date();

  const saved = await this.paymentRepository.save(payment);

  const company = await this.companiesService.findOne(payment.companyId);
  const loginToken = await this.loginTokensService.createToken(company.id);

  const frontendUrl = this.configService.get<string>('FRONTEND_URL')
    || 'http://localhost:5173';
  const url = `${frontendUrl}/cadastro/complete/${loginToken.token}`;

  await this.mailService.sendRegistrationLinkEmail(
    company.email,
    company.companyName,
    url,
  );

  return saved;
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
