import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocialNetwork } from './entities/social-network.entity';
import { ApprovalsService } from '../approvals/approvals.service';
import { ApprovalAction } from '../approvals/approval-action.enum';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';

@Injectable()
export class SocialNetworksService {
  constructor(
    @InjectRepository(SocialNetwork)
    private readonly repo: Repository<SocialNetwork>,
    private readonly approvalsService: ApprovalsService,
  ) {}

  // =========================
  // LISTAR
  // =========================
  findAll() {
    return this.repo.find();
  }

  // =========================
  // CRIAR (1 por empresa)
  // =========================
  async create(data: CreateSocialNetworkDto, userId?: number | null) {
    const exists = await this.repo.findOne({
      where: { companyId: data.companyId },
    });

    if (exists) {
      throw new ConflictException(
        'Essa empresa já possui redes sociais cadastradas',
      );
    }

    const social = this.repo.create(data);

    const saved = await this.repo.save(social);
    await this.approvalsService.createLog({
      companyId: data.companyId,
      userId: userId ?? null,
      action: ApprovalAction.COMPLETED,
      observation: `Redes Sociais adicionadas: ${[data.facebook && 'Facebook', data.instagram && 'Instagram', data.linkedin && 'LinkedIn', data.other && 'Outras'].filter(Boolean).join(', ') || 'sem dados'}`,
    });
    return saved;
  }

  // =========================
  // BUSCAR POR EMPRESA (ÚTIL)
  // =========================
  async findByCompany(companyId: number) {
    const social = await this.repo.findOne({
      where: { companyId },
    });

    if (!social) {
      throw new NotFoundException(
        'Redes sociais não encontradas para essa empresa',
      );
    }

    return social;
  }

  // =========================
  // UPDATE
  // =========================
  async update(companyId: number, data: UpdateSocialNetworkDto, userId?: number | null) {
    const social = await this.findByCompany(companyId);

    const updated = this.repo.merge(social, data);

    const fieldsChanged: string[] = [];
    if (data.facebook !== undefined && data.facebook !== social.facebook) fieldsChanged.push(`Facebook: "${social.facebook ?? '-'}" → "${data.facebook ?? '-'}"`);
    if (data.instagram !== undefined && data.instagram !== social.instagram) fieldsChanged.push(`Instagram: "${social.instagram ?? '-'}" → "${data.instagram ?? '-'}"`);
    if (data.linkedin !== undefined && data.linkedin !== social.linkedin) fieldsChanged.push(`LinkedIn: "${social.linkedin ?? '-'}" → "${data.linkedin ?? '-'}"`);
    if (data.other !== undefined && data.other !== social.other) fieldsChanged.push(`Outras: "${social.other ?? '-'}" → "${data.other ?? '-'}"`);
    const savedUpdate = await this.repo.save(updated);
    if (fieldsChanged.length > 0) {
      await this.approvalsService.createLog({
        companyId,
        userId: userId ?? null,
        action: ApprovalAction.COMPLETED,
        observation: `Redes Sociais editadas: ${fieldsChanged.join(' | ')}`,
      });
    }
    return savedUpdate;
  }
}
