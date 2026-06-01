import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Approval } from './entities/approval.entity';
import { CreateApprovalDto } from './dto/create-approval.dto';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
  ) {}

  findAll() {
    return this.approvalRepository.find();
  }

  create(approvalData: CreateApprovalDto) {
    const approval = this.approvalRepository.create(approvalData);

    return this.approvalRepository.save(approval);
  }
}
