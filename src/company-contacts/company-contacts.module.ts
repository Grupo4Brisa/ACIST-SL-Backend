import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyContactsController } from './company-contacts.controller';
import { CompanyContactsService } from './company-contacts.service';

import { CompanyContact } from './entities/company-contact.entity';
import { ApprovalsModule } from '../approvals/approvals.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyContact]), ApprovalsModule],
  controllers: [CompanyContactsController],
  providers: [CompanyContactsService],
  exports: [CompanyContactsService],
})
export class CompanyContactsModule {}
