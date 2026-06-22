import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  findAll() {
    return this.documentRepository.find();
  }

  findOne(id: number) {
    return this.documentRepository.findOne({
      where: { id },
    });
  }

  create(documentData: CreateDocumentDto) {
    const document =
      this.documentRepository.create(documentData);

    return this.documentRepository.save(document);
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ) {
    await this.documentRepository.update(
      id,
      updateDocumentDto,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.documentRepository.delete(id);

    return {
      message: 'Documento removido com sucesso',
    };
  }
}
