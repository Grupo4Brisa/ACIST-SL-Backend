import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TermsAcceptanceController } from './terms-acceptance.controller';
import { TermsAcceptanceService } from './terms-acceptance.service';

import { TermsAcceptance } from './entities/terms-acceptance.entity';
import { Company } from '../companies/entities/company.entity';

import { TermsPdfService } from './pdf/terms-pdf.service';
import { ClicksignService } from './signatures/clicksign.service';
import { ApprovalsModule } from '../approvals/approvals.module';

@Module({
  imports: [TypeOrmModule.forFeature([TermsAcceptance, Company]), ApprovalsModule],

  controllers: [TermsAcceptanceController],

  providers: [
    TermsAcceptanceService,
    TermsPdfService,
    ClicksignService,
  ],

  exports: [TermsAcceptanceService],
})
export class TermsAcceptanceModule {}
