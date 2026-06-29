import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TermsAcceptanceController } from './terms-acceptance.controller';
import { TermsAcceptanceService } from './terms-acceptance.service';

import { TermsAcceptance } from './entities/terms-acceptance.entity';

import { TermsPdfService } from './pdf/terms-pdf.service';
import { ClicksignService } from './signatures/clicksign.service';

@Module({
  imports: [TypeOrmModule.forFeature([TermsAcceptance])],

  controllers: [TermsAcceptanceController],

  providers: [
    TermsAcceptanceService,
    TermsPdfService,
    ClicksignService,
  ],

  exports: [TermsAcceptanceService],
})
export class TermsAcceptanceModule {}
