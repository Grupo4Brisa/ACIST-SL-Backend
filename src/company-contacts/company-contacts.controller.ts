import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { CompanyContactsService } from './company-contacts.service';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';

@ApiTags('Company Contacts')
@Controller('company-contacts')
export class CompanyContactsController {
  constructor(
    private readonly companyContactsService: CompanyContactsService,
  ) {}

  @ApiOperation({ summary: 'Listar contatos de empresas' })
  @ApiResponse({ status: 200, description: 'Lista de contatos retornada com sucesso' })
  @Get()
  findAll() {
    return this.companyContactsService.findAll();
  }

  @ApiOperation({ summary: 'Criar contato de empresa' })
  @ApiBody({
    description: 'Payload para criação de contato',
    examples: {
      exemplo1: {
        summary: 'Contato padrão',
        value: {
          companyId: 1,
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '51999999999',
          role: 'Manager',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Contato criado com sucesso' })
  @Post()
  create(@Body() body: CreateCompanyContactDto) {
    return this.companyContactsService.create(body);
  }
}
