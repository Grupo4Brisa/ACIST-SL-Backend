import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

import { Company } from './entities/company.entity';
import { ApprovalsModule } from '../approvals/approvals.module'; // 👈 ADD AQUI

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    ApprovalsModule, // 👈 ESSENCIAL
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
