import { Controller, Get, Post, Body } from '@nestjs/common';

import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  findAll() {
    return this.approvalsService.findAll();
  }

  @Post()
  create(@Body() body: CreateApprovalDto) {
    return this.approvalsService.create(body);
  }
}
