import { Controller, Get, Post, Body } from '@nestjs/common';

import { SolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';

@Controller('solutions')
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Get()
  findAll() {
    return this.solutionsService.findAll();
  }

  @Post()
  create(@Body() body: CreateSolutionDto) {
    return this.solutionsService.create(body);
  }
}
