import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TermsAcceptance } from './entities/terms-acceptance.entity';
import { CreateTermsAcceptanceDto } from './dto/create-terms-acceptance.dto';

import { TermsPdfService } from './pdf/terms-pdf.service';
import { ClicksignService } from './signatures/clicksign.service';

@Injectable()
export class TermsAcceptanceService {
  constructor(
    @InjectRepository(TermsAcceptance)
    private readonly termsRepository: Repository<TermsAcceptance>,

    private readonly termsPdfService: TermsPdfService,

    private readonly clicksignService: ClicksignService,
  ) {}

  // =========================
  // LISTAR TODOS
  // =========================
  findAll() {
    return this.termsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  async findOne(id: number) {
    const term = await this.termsRepository.findOne({
      where: { id },
    });

    if (!term) {
      throw new NotFoundException('Termo não encontrado');
    }

    return term;
  }

  // =========================
  // CRIAR ACEITE
  // =========================
  async create(data: CreateTermsAcceptanceDto) {
    const exists = await this.termsRepository.findOne({
      where: {
        companyId: data.companyId,
        termVersion: data.termVersion,
      },
    });

    if (exists) {
      throw new ConflictException(
        'Esta empresa já aceitou esta versão dos termos.',
      );
    }

    const acceptance = this.termsRepository.create({
      companyId: data.companyId,
      accepted: data.accepted,
      acceptedAt: data.accepted ? new Date() : undefined,
      termVersion: data.termVersion,
    });

    return this.termsRepository.save(acceptance);
  }

  // =========================
  // GERAR PDF
  // =========================
  async generatePdf(id: number) {
    const term = await this.findOne(id);

    const filePath = await this.termsPdfService.generatePdf(
      term.id,
    );

    term.documentUrl = filePath;

    await this.termsRepository.save(term);

    return {
      message: 'PDF gerado com sucesso',
      filePath,
    };
  }

  // =========================
  // ENVIAR PARA CLICKSIGN
  // =========================
  async sendToSignature(id: number) {
    const term = await this.findOne(id);

    if (!term.documentUrl) {
      throw new ConflictException(
        'Gere o PDF antes de enviar para assinatura.',
      );
    }

    // =========================
    // 1. CRIAR DOCUMENTO
    // =========================
    const document: any =
      await this.clicksignService.createDocument(
        term.documentUrl,
        `terms-${term.id}.pdf`,
      );

    const documentKey = document.document?.key;

    if (!documentKey) {
      throw new ConflictException(
        'Erro ao criar documento na Clicksign.',
      );
    }

    // =========================
    // 2. CRIAR SIGNATÁRIO
    // =========================
    const signer: any =
      await this.clicksignService.createSigner(
        `Empresa ${term.companyId}`,
        `company${term.companyId}@email.com`,
      );

    const signerKey = signer.signer?.key;

    if (!signerKey) {
      throw new ConflictException(
        'Erro ao criar signatário.',
      );
    }

    // =========================
    // 3. VINCULAR SIGNATÁRIO
    // =========================
    await this.clicksignService.addSignerToDocument(
      documentKey,
      signerKey,
    );

    // =========================
    // 4. INICIAR ASSINATURA
    // =========================
    await this.clicksignService.startSignature(
      documentKey,
    );

    // =========================
    // 5. SALVAR NO BANCO
    // =========================
    term.signatureId = documentKey;
    term.signatureProvider = 'Clicksign';

    await this.termsRepository.save(term);

    return {
      message:
        'Documento enviado para assinatura com sucesso',
      documentKey,
      signerKey,
    };
  }

  // =========================
  // CONFIRMAR ASSINATURA
  // =========================
  async confirmSignature(
    id: number,
    signatureId: string,
    documentUrl: string,
    hash: string,
    provider = 'Clicksign',
  ) {
    const term = await this.findOne(id);

    term.accepted = true;
    term.acceptedAt = new Date();
    term.signatureId = signatureId;
    term.signatureProvider = provider;
    term.documentUrl = documentUrl;
    term.signedDocumentHash = hash;

    return this.termsRepository.save(term);
  }
}
