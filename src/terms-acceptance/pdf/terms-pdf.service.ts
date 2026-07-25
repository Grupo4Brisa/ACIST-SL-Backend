import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TermsAcceptance } from '../entities/terms-acceptance.entity';

@Injectable()
export class TermsPdfService {
  constructor(
    @InjectRepository(TermsAcceptance)
    private readonly termsRepository: Repository<TermsAcceptance>,
  ) {}

  async generatePdf(termsId: number): Promise<string> {
    const terms = await this.termsRepository.findOne({
      where: { id: termsId },
    });

    if (!terms) {
      throw new Error('Termos não encontrados');
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'terms');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `terms-${termsId}-${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // =========================
    // HEADER
    // =========================
    doc
      .fontSize(20)
      .text('TERMO DE ACEITE', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text(`ID do Termo: ${terms.id}`)
      .text(`Empresa ID: ${terms.companyId}`)
      .text(`Versão: ${terms.termVersion}`)
      .text(
        `Status: ${terms.accepted ? 'ACEITO' : 'PENDENTE'}`,
      )
      .moveDown();

    // =========================
    // CORPO DO TERMO
    // =========================
    doc.fontSize(12).text(
      `Este documento registra o aceite dos termos e condições da plataforma.`,
    );

    doc.moveDown();

    doc.text(
      `Ao aceitar este termo, a empresa concorda com todas as regras estabelecidas pela ACIST.`,
    );

    doc.moveDown();

        // =========================
    // DATA
    // =========================
    doc.moveDown();

    doc.text(
      `Data de geração: ${new Date().toLocaleString('pt-BR')}`,
    );

    if (terms.acceptedAt) {
      doc.text(
        `Data de aceite: ${terms.acceptedAt.toLocaleString(
          'pt-BR',
        )}`,
      );
    }

    // =========================
    // FOOTER
    // =========================
    doc.moveDown(2);
    doc.fontSize(10).text(
      'Documento gerado automaticamente pelo sistema ACIST.',
      {
        align: 'center',
      },
    );

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
