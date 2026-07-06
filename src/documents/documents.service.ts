import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';

import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from './document-status.enum';

import { CompaniesService } from '../companies/companies.service';
import { CompanyStatus } from '../companies/company-status.enum';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,

    private readonly companiesService: CompaniesService,
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
  async create(
    data: CreateDocumentDto & {
      fileName: string;
      filePath: string;
    },
  ) {
    const company = await this.companiesService.findOne(
      data.companyId,
    );

    if (company.status !== CompanyStatus.ACTIVE) {
      throw new BadRequestException(
        'Somente empresas ativas podem enviar documentos.',
      );
    }

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

    if (file) {
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

    if (doc.filePath && fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await this.repo.delete(id);

    return {
      message: 'Documento removido com sucesso',
    };
  }
}
