import { Injectable, NotFoundException } from '@nestjs/common';

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

  findAll() {
    return this.approvalRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const approval = await this.approvalRepository.findOne({ where: { id } });
    if (!approval) throw new NotFoundException('Aprovação não encontrada');
    return approval;
  }

  async findByCompany(companyId: number) {
    const approvals = await this.approvalRepository.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
    });

    // Resolve nomes de usuários via query
    const userIds = [
      ...new Set(approvals.map((a) => a.userId).filter(Boolean)),
    ];
    let usersMap: Record<number, string> = {};

    if (userIds.length > 0) {
      const rows = await this.approvalRepository.manager.query(
        `SELECT id, name FROM users WHERE id = ANY($1)`,
        [userIds],
      );
      rows.forEach((r: any) => {
        usersMap[r.id] = r.name;
      });
    }

    return approvals.map((a) => ({
      id: a.id,
      companyId: a.companyId,
      userId: a.userId,
      userName: a.userId ? (usersMap[a.userId] ?? `ID ${a.userId}`) : 'Sistema',
      action: a.action,
      observation: a.observation,
      createdAt: a.createdAt,
    }));
  }

  async createLog(data: {
    companyId: number;
    userId?: number | null;
    action: ApprovalAction;
    observation?: string;
  }) {
    const approval = this.approvalRepository.create({
      companyId: data.companyId,
      userId: data.userId ?? undefined,
      action: data.action,
      observation: data.observation,
      createdAt: new Date(),
    });
    return this.approvalRepository.save(approval);
  }
}
