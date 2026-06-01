import { Controller, Get, Post, Body } from '@nestjs/common';

import { CompanyContactsService } from './company-contacts.service';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';

@Controller('company-contacts')
export class CompanyContactsController {
  constructor(
    private readonly companyContactsService: CompanyContactsService,
  ) {}

  @Get()
  findAll() {
    return this.companyContactsService.findAll();
  }

  @Post()
  create(@Body() body: CreateCompanyContactDto) {
    return this.companyContactsService.create(body);
  }
}
