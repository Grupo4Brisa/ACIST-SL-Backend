import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocialNetwork } from './entities/social-network.entity';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';

@Injectable()
export class SocialNetworksService {
  constructor(
    @InjectRepository(SocialNetwork)
    private readonly repo: Repository<SocialNetwork>,
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
  async create(data: CreateSocialNetworkDto) {
    const exists = await this.repo.findOne({
      where: { companyId: data.companyId },
    });

    if (exists) {
      throw new ConflictException(
        'Essa empresa já possui redes sociais cadastradas',
      );
    }

    const social = this.repo.create(data);

    return this.repo.save(social);
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
  async update(companyId: number, data: UpdateSocialNetworkDto) {
    const social = await this.findByCompany(companyId);

    const updated = this.repo.merge(social, data);

    return this.repo.save(updated);
  }
}
