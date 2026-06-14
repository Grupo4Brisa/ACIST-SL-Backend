import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TermsAcceptanceController } from './terms-acceptance.controller';
import { TermsAcceptanceService } from './terms-acceptance.service';

import { TermsAcceptance } from './entities/terms-acceptance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TermsAcceptance])],
  controllers: [TermsAcceptanceController],
  providers: [TermsAcceptanceService],
  exports: [TermsAcceptanceService],
})
export class TermsAcceptanceModule {}
