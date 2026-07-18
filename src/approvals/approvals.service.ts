import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

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
  // BUSCAR POR ID
  // =========================
  async findOne(id: number) {

    const approval = await this.approvalRepository.findOne({
      where: {
        id,
      },
    });


    if (!approval) {
      throw new NotFoundException(
        'Aprovação não encontrada',
      );
    }


    return approval;
  }


  // =========================
  // LISTAR HISTÓRICO POR EMPRESA
  // =========================
  findByCompany(companyId: number) {

    return this.approvalRepository.find({
      where: {
        companyId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

  }


  // =========================
  // CRIAR LOG DE APROVAÇÃO
  // USADO INTERNAMENTE PELO COMPANIES SERVICE
  // =========================
  async createLog(data: {
    companyId: number;
    userId: number;
    action: ApprovalAction;
    observation?: string;
  }) {

    const approval = this.approvalRepository.create({
      companyId: data.companyId,
      userId: data.userId,
      action: data.action,
      ...(data.observation && {
        observation: data.observation,
      }),
      createdAt: new Date(),
    });


    return this.approvalRepository.save(
      approval,
    );
  }

}