import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  findAll() {
    return this.documentRepository.find();
  }

  create(documentData: CreateDocumentDto) {
    const document = this.documentRepository.create(documentData);

    return this.documentRepository.save(document);
  }
}
