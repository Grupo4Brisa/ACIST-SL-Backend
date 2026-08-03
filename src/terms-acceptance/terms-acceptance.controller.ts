import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TermsAcceptanceService } from './terms-acceptance.service';
import { CreateTermsAcceptanceDto } from './dto/create-terms-acceptance.dto';

@ApiTags('Terms Acceptance')
@Controller('terms-acceptance')
export class TermsAcceptanceController {
  constructor(
    private readonly termsAcceptanceService: TermsAcceptanceService,
  ) {}

  // =========================
  // LISTAR TODOS
  // =========================

  @Get()
  @ApiOperation({
    summary: 'Listar todos os aceites de termos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista retornada com sucesso.',
  })
  findAll() {
    return this.termsAcceptanceService.findAll();
  }

  // =========================
  // REGISTRAR ACEITE
  // =========================

  @Post()
  @ApiOperation({
    summary: 'Registrar aceite dos termos',
  })
  @ApiBody({
    type: CreateTermsAcceptanceDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Aceite registrado com sucesso.',
  })
  @ApiResponse({
    status: 409,
    description: 'A empresa já aceitou esta versão dos termos.',
  })
  create(
    @Body()
    body: CreateTermsAcceptanceDto,
  ) {
    return this.termsAcceptanceService.create(body);
  }

  // =========================
  // GERAR PDF
  // =========================

  @Get(':id/pdf')
  @ApiOperation({
    summary: 'Gerar PDF dos termos aceitos',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'PDF gerado com sucesso.',
  })
  generatePdf(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.termsAcceptanceService.generatePdf(id);
  }

  // =========================
  // ENVIAR PARA ASSINATURA
  // =========================

  @Post(':id/send-signature')
  @ApiOperation({
    summary: 'Enviar documento para assinatura digital',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Documento enviado para assinatura.',
  })
  sendToSignature(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.termsAcceptanceService.sendToSignature(id);
  }
}
