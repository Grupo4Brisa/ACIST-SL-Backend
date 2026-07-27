import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Company } from '../companies/entities/company.entity';
import { Event } from '../events/entities/event.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Document } from '../documents/entities/document.entity';
import { Approval } from '../approvals/entities/approval.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Event,
      Announcement,
      Document,
      Approval,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
