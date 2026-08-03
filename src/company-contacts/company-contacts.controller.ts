import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { CompanyContactsService } from './company-contacts.service';

import { CreateCompanyContactDto } from './dto/create-company-contact.dto';

@ApiTags('Company Contacts')
@Controller('company-contacts')
export class CompanyContactsController {
  constructor(
    private readonly companyContactsService: CompanyContactsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os contatos das empresas' })
  @ApiResponse({ status: 200, description: 'Lista de contatos retornada com sucesso' })
  findAll() {
    return this.companyContactsService.findAll();
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Listar contatos de uma empresa' })
  @ApiResponse({ status: 200, description: 'Contatos da empresa retornados com sucesso' })
  findByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.companyContactsService.findByCompany(companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar contato de empresa' })
  @ApiBody({ type: CreateCompanyContactDto })
  @ApiResponse({ status: 201, description: 'Contato criado com sucesso' })
  create(@Body() body: CreateCompanyContactDto) {
    return this.companyContactsService.create(body);
  }

  @Post('bulk')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Criar vários contatos da empresa' })
  @ApiBody({ type: [CreateCompanyContactDto], description: 'Lista de contatos para cadastro' })
  @ApiResponse({ status: 201, description: 'Contatos criados com sucesso' })
  createMany(@Body() body: CreateCompanyContactDto[], @Req() req: any) {
    return this.companyContactsService.createMany(body, req.user ?? null);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyContactsService.remove(id);
  }
}
