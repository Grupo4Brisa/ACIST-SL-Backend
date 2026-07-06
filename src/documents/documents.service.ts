import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';

import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from './document-status.enum';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,
  ) {}

  // =========================
  // FIND ALL
  // =========================
  findAll() {
    return this.repo.find();
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: number) {
    const doc = await this.repo.findOne({
      where: { id },
    });

    if (!doc) {
      throw new NotFoundException('Documento não encontrado');
    }

    return doc;
  }

  // =========================
  // CREATE
  // =========================
  create(
    data: CreateDocumentDto & {
      fileName: string;
      filePath: string;
    },
  ) {
    const document = this.repo.create({
      ...data,
      status: DocumentStatus.PENDING,
    });

    return this.repo.save(document);
  }

  // =========================
  // UPDATE COM TROCA DE ARQUIVO
  // =========================
  async updateWithFile(
    id: number,
    data: UpdateDocumentDto,
    file?: any,
  ) {
    const doc = await this.findOne(id);

    let fileName = doc.fileName;
    let filePath = doc.filePath;

    // Se veio novo arquivo
    if (file) {
      // Remove o arquivo antigo
      if (doc.filePath && fs.existsSync(doc.filePath)) {
        fs.unlinkSync(doc.filePath);
      }

      fileName = file.originalname;
      filePath = file.path;
    }

    const updated = this.repo.merge(doc, {
      ...data,
      fileName,
      filePath,
    });

    return this.repo.save(updated);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const doc = await this.findOne(id);

    // Remove o arquivo físico
    if (doc.filePath && fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await this.repo.delete(id);

    return {
      message: 'Documento removido com sucesso',
    };
  }
}
