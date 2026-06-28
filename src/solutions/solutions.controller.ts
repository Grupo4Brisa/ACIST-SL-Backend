import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { SolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solutionsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateSolutionDto,
  ) {
    return this.solutionsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solutionsService.remove(Number(id));
  }
}