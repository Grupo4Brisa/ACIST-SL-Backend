import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { TermsAcceptanceService } from './terms-acceptance.service';
import { CreateTermsAcceptanceDto } from './dto/create-terms-acceptance.dto';
import { UpdateTermsAcceptanceDto } from './dto/update-terms-acceptance.dto';

@Controller('terms-acceptance')
export class TermsAcceptanceController {
  constructor(
    private readonly termsAcceptanceService: TermsAcceptanceService,
  ) {}

  @Get()
  findAll() {
    return this.termsAcceptanceService.findAll();
  }

  @Post()
  create(@Body() body: CreateTermsAcceptanceDto) {
    return this.termsAcceptanceService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termsAcceptanceService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateTermsAcceptanceDto,
  ) {
    return this.termsAcceptanceService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.termsAcceptanceService.remove(Number(id));
  }
}

