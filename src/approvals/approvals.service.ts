import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Approval } from './entities/approval.entity';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
  ) {}

  findAll() {
    return this.approvalRepository.find();
  }

  findOne(id: number) {
    return this.approvalRepository.findOne({
      where: { id },
    });
  }

  create(approvalData: CreateApprovalDto) {
    const approval = this.approvalRepository.create(approvalData);
    return this.approvalRepository.save(approval);
  }

  async update(id: number, updateApprovalDto: UpdateApprovalDto) {
    await this.approvalRepository.update(id, updateApprovalDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.approvalRepository.delete(id);

    return { message: 'Aprovação removida com sucesso' };
  }
}
