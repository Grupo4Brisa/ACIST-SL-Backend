import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { CompanyContactsService } from './company-contacts.service';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';
import { UpdateCompanyContactDto } from './dto/update-company-contact.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyContactsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCompanyContactDto,
  ) {
    return this.companyContactsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyContactsService.remove(Number(id));
  }
}
