import { Controller, Get, Post, Body } from '@nestjs/common';

import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Post()
  create(@Body() body: CreateDocumentDto) {
    return this.documentsService.create(body);
  }
}
