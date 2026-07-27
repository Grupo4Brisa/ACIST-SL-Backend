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
  async create(data: CreateSocialNetworkDto, user?: any) {
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
      userId: (user?.type === 'USER' && user?.role) ? (user?.id ?? undefined) : undefined,
      action: ApprovalAction.COMPLETED,
      observation: `${(user?.type === 'USER' && user?.role) ? 'Colaborador' : 'Sistema'} adicionou Redes Sociais: ${[data.facebook && 'Facebook', data.instagram && 'Instagram', data.linkedin && 'LinkedIn', data.other && 'Outras'].filter(Boolean).join(', ') || 'sem dados'}`,
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
  async update(companyId: number, data: UpdateSocialNetworkDto, user?: any) {
    const social = await this.findByCompany(companyId);

    // Captura valores ANTES do merge
    const before = {
      facebook:  social.facebook,
      instagram: social.instagram,
      linkedin:  social.linkedin,
      other:     social.other,
    };

    const updated = this.repo.merge(social, data);

    const fieldsChanged: string[] = [];
    if (data.facebook  !== undefined && data.facebook  !== before.facebook)  fieldsChanged.push(`Facebook: "${before.facebook  ?? '-'}" → "${data.facebook  ?? '-'}"`);
    if (data.instagram !== undefined && data.instagram !== before.instagram) fieldsChanged.push(`Instagram: "${before.instagram ?? '-'}" → "${data.instagram ?? '-'}"`);
    if (data.linkedin  !== undefined && data.linkedin  !== before.linkedin)  fieldsChanged.push(`LinkedIn: "${before.linkedin  ?? '-'}" → "${data.linkedin  ?? '-'}"`);
    if (data.other     !== undefined && data.other     !== before.other)     fieldsChanged.push(`Outras: "${before.other ?? '-'}" → "${data.other ?? '-'}"`);

    const savedUpdate = await this.repo.save(updated);
    if (fieldsChanged.length > 0) {
      try {
        await this.approvalsService.createLog({
          companyId,
          userId:      (user?.type === 'USER' && user?.role) ? (user?.id ?? undefined) : undefined,
          action:      ApprovalAction.COMPLETED,
          observation: `${(user?.type === 'USER' && user?.role) ? 'Colaborador' : 'Sistema'} editou Redes Sociais: ${fieldsChanged.join(' | ')}`,
        });
      } catch (e) {
        console.error('Erro ao salvar log de redes sociais:', e);
      }
    }
    return savedUpdate;
  }
}
