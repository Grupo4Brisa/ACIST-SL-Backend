import { Controller, Get, Post, Body } from '@nestjs/common';

import { CompanySolutionsService } from './company-solutions.service';
import { CreateCompanySolutionDto } from './dto/create-company-solution.dto';

@Controller('company-solutions')
export class CompanySolutionsController {
  constructor(
    private readonly companySolutionsService: CompanySolutionsService,
  ) {}

  @Get()
  findAll() {
    return this.companySolutionsService.findAll();
  }

  @Post()
  create(@Body() body: CreateCompanySolutionDto) {
    return this.companySolutionsService.create(body);
  }
}
