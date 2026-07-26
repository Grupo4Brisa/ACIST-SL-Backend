import {
  Injectable,
  NotFoundException,
  BadRequestException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readable } from 'stream';

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
  // Enriquece cada documento com
  // companyName e establishmentType
  // (usado nas telas de gestão e
  // "documentos por empresa")
  // =========================

  async findAll() {

    const documents = await this.repo.find();

    const companyIds = [
      ...new Set(documents.map(doc => doc.companyId)),
    ];

    const companies =
      await this.companiesService.findNamesByIds(companyIds);

    const companyMap = new Map(
      companies.map(c => [c.id, c]),
    );

    return documents.map(doc => {

      const company = companyMap.get(doc.companyId);

      return {
        ...doc,
        companyName: company?.companyName,
        establishmentType: company?.establishmentType,
      };

    });

  }

  findByCompany(companyId: number) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'companyId', 'documentType', 'fileName', 'mimeType', 'fileSize', 'status', 'uploadedAt'],
    });
  }

  // =========================
  // FIND ONE
  // =========================

  async findOne(id: number) {
    const doc = await this.repo.findOne({
      where: { id },
    });

    if (!doc) {
      throw new NotFoundException(
        'Documento não encontrado',
      );
    }

    return doc;
  }

  // =========================
  // CREATE
  // =========================

  async create(
    data: CreateDocumentDto & {
      fileName: string;
      mimeType: string;
      fileSize: number;
      fileContent: Buffer;
    },
  ) {

    const company =
      await this.companiesService.findOne(
        data.companyId,
      );

    if (
      company.status === CompanyStatus.INACTIVE
    ) {
      throw new BadRequestException(
        'Empresa inativa não pode enviar documentos.',
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
    file?: Express.Multer.File,
  ) {

    const doc =
      await this.findOne(id);

    if (file) {

      doc.fileName =
        file.originalname;

      doc.mimeType =
        file.mimetype;

      doc.fileSize =
        file.size;

      doc.fileContent =
        file.buffer;

    }

    const updated =
      this.repo.merge(
        doc,
        data,
      );

    return this.repo.save(updated);

  }

  // =========================
  // DOWNLOAD
  // =========================

  async download(
    id: number,
  ): Promise<StreamableFile> {

    const document =
      await this.findOne(id);

    const stream =
      Readable.from(
        document.fileContent,
      );

    return new StreamableFile(
      stream,
      {
        type: document.mimeType,
        disposition: `inline; filename="${document.fileName}"`,
      },
    );

  }

  // =========================
  // DELETE
  // =========================

  async remove(id: number) {

    await this.findOne(id);

    await this.repo.delete(id);

    return {
      message:
        'Documento removido com sucesso',
    };

  }

}