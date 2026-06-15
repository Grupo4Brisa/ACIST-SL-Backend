import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocialNetwork } from './entities/social-network.entity';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';

@Injectable()
export class SocialNetworksService {
  constructor(
    @InjectRepository(SocialNetwork)
    private readonly socialNetworkRepository: Repository<SocialNetwork>,
  ) {}

  findAll() {
    return this.socialNetworkRepository.find();
  }

  create(socialNetworkData: CreateSocialNetworkDto) {
    const socialNetwork =
      this.socialNetworkRepository.create(socialNetworkData);

    return this.socialNetworkRepository.save(socialNetwork);
  }
}
