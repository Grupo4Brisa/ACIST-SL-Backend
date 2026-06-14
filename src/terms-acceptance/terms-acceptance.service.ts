import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TermsAcceptance } from './entities/terms-acceptance.entity';
import { CreateTermsAcceptanceDto } from './dto/create-terms-acceptance.dto';

@Injectable()
export class TermsAcceptanceService {
  constructor(
    @InjectRepository(TermsAcceptance)
    private readonly termsAcceptanceRepository: Repository<TermsAcceptance>,
  ) {}

  findAll() {
    return this.termsAcceptanceRepository.find();
  }

  create(data: CreateTermsAcceptanceDto) {
    const acceptance = this.termsAcceptanceRepository.create({
      ...data,
      acceptedAt: data.accepted ? new Date() : undefined,
    });

    return this.termsAcceptanceRepository.save(acceptance);
  }
}
