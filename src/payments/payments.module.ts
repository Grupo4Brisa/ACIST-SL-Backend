import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CompaniesModule } from '../companies/companies.module';

import { Payment } from './entities/payment.entity';

@Module({
  imports: [
  TypeOrmModule.forFeature([Payment]),
  CompaniesModule,
],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
