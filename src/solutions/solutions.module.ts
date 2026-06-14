import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SolutionsController } from './solutions.controller';
import { SolutionsService } from './solutions.service';

import { Solution } from './entities/solution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solution])],
  controllers: [SolutionsController],
  providers: [SolutionsService],
  exports: [SolutionsService],
})
export class SolutionsModule {}
