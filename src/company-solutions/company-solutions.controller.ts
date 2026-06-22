import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { CompanySolutionsService } from './company-solutions.service';
import { CreateCompanySolutionDto } from './dto/create-company-solution.dto';
import { UpdateCompanySolutionDto } from './dto/update-company-solution.dto';

@Controller('company-solutions')
export class CompanySolutionsController {
  constructor(
    private readonly companySolutionsService: CompanySolutionsService,
  ) {}

  // CREATE
  @Post()
  create(@Body() body: CreateCompanySolutionDto) {
    return this.companySolutionsService.create(body);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.companySolutionsService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companySolutionsService.findOne(+id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCompanySolutionDto,
  ) {
    return this.companySolutionsService.update(+id, body);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companySolutionsService.remove(+id);
  }
}