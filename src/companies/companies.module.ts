import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

import { Company } from './entities/company.entity';

import { ApprovalsModule } from '../approvals/approvals.module';
import { LoginTokensModule } from '../login-tokens/login-tokens.module';

import { MailModule } from '../mail/mail.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
    ]),

    ApprovalsModule,

    LoginTokensModule,

    MailModule,
  ],

  controllers: [
    CompaniesController,
  ],

  providers: [
    CompaniesService,
  ],

  exports: [
    CompaniesService,
  ],
})
export class CompaniesModule {}
