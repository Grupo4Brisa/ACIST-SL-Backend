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
import { ApprovalsService } from '../approvals/approvals.service';
import { ApprovalAction } from '../approvals/approval-action.enum';

import { InjectRepository as InjectRepo } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { CompanyStatus } from '../companies/company-status.enum';

@Injectable()
export class TermsAcceptanceService {
  constructor(
    @InjectRepository(TermsAcceptance)
    private readonly termsRepository: Repository<TermsAcceptance>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    private readonly termsPdfService: TermsPdfService,

    private readonly clicksignService: ClicksignService,

    private readonly approvalsService: ApprovalsService,
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
  // CRIAR OU ATUALIZAR ACEITE
  // =========================
  async create(data: CreateTermsAcceptanceDto) {
    let acceptance = await this.termsRepository.findOne({
      where: {
        companyId: data.companyId,
        termVersion: data.termVersion,
      },
    });

    if (acceptance) {
      // já existia (ex: reenvio após reprovação) — atualiza
      acceptance.accepted = data.accepted;
      acceptance.acceptedAt = data.accepted ? new Date() : undefined;

      await this.termsRepository.save(acceptance);
    } else {
      acceptance = this.termsRepository.create({
        companyId: data.companyId,
        accepted: data.accepted,
        acceptedAt: data.accepted ? new Date() : undefined,
        termVersion: data.termVersion,
      });

      await this.termsRepository.save(acceptance);
    }

    // log: cadastro finalizado (8 etapas concluídas)
    await this.approvalsService.createLog({
      companyId: data.companyId,
      userId: undefined,
      action: ApprovalAction.FINALIZED,
      observation: `Cadastro finalizado — Termo de Adesão aceito (versão ${data.termVersion}).`,
    });

    // atualiza status da empresa para PENDING_APPROVAL
    // (funciona tanto pra primeiro envio quanto reenvio após reprovação)
    await this.companyRepository.update(data.companyId, {
      status: CompanyStatus.PENDING_APPROVAL,
    });

    return acceptance;
  }

  // =========================
  // GERAR PDF
  // =========================
  async generatePdf(id: number) {
    const term = await this.findOne(id);

    const filePath = await this.termsPdfService.generatePdf(term.id);

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
    const document: any = await this.clicksignService.createDocument(
      term.documentUrl,
      `terms-${term.id}.pdf`,
    );

    const documentKey = document.document?.key;

    if (!documentKey) {
      throw new ConflictException('Erro ao criar documento na Clicksign.');
    }

    // =========================
    // 2. CRIAR SIGNATÁRIO
    // =========================
    const signer: any = await this.clicksignService.createSigner(
      `Empresa ${term.companyId}`,
      `company${term.companyId}@email.com`,
    );

    const signerKey = signer.signer?.key;

    if (!signerKey) {
      throw new ConflictException('Erro ao criar signatário.');
    }

    // =========================
    // 3. VINCULAR SIGNATÁRIO
    // =========================
    await this.clicksignService.addSignerToDocument(documentKey, signerKey);

    // =========================
    // 4. INICIAR ASSINATURA
    // =========================
    await this.clicksignService.startSignature(documentKey);

    // =========================
    // 5. SALVAR NO BANCO
    // =========================
    term.signatureId = documentKey;
    term.signatureProvider = 'Clicksign';

    await this.termsRepository.save(term);

    return {
      message: 'Documento enviado para assinatura com sucesso',
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
