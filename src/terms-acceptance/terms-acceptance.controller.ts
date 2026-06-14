import { Controller, Get, Post, Body } from '@nestjs/common';

import { TermsAcceptanceService } from './terms-acceptance.service';
import { CreateTermsAcceptanceDto } from './dto/create-terms-acceptance.dto';

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
}
