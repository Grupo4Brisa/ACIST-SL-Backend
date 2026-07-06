import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Approval } from './entities/approval.entity';
import { ApprovalAction } from './approval-action.enum';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
  ) {}

  // =========================
  // LISTAR HISTÓRICO COMPLETO
  // =========================
  findAll() {
    return this.approvalRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =========================
  // BUSCAR POR ID (AUDITORIA)
  // =========================
  async findOne(id: number) {
    const approval = await this.approvalRepository.findOne({
      where: { id },
    });

    if (!approval) {
      throw new NotFoundException('Aprovação não encontrada');
    }

    return approval;
  }

  // =========================
  // BUSCAR POR EMPRESA
  // =========================
  findByCompany(companyId: number) {
    return this.approvalRepository.find({
      where: { companyId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =========================
  // CRIAR LOG DE APROVAÇÃO (USO INTERNO)
  // =========================
  createLog(data: {
    companyId: number;
    userId: number;
    action: ApprovalAction;
    observation?: string;
  }) {
    const approval = this.approvalRepository.create({
      ...data,
      createdAt: new Date(),
    });

    return this.approvalRepository.save(approval);
  }
}
