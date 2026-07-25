import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanySolutionsController } from './company-solutions.controller';
import { CompanySolutionsService } from './company-solutions.service';

import { CompanySolution } from './entities/company-solution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanySolution])],
  controllers: [CompanySolutionsController],
  providers: [CompanySolutionsService],
  exports: [CompanySolutionsService],
})
export class CompanySolutionsModule {}
