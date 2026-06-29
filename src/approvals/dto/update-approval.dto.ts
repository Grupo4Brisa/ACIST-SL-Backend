import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApprovalStatus } from '../approval-status.enum';

export class UpdateApprovalDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  companyId?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @IsOptional()
  approvedBy?: number;

  @ApiPropertyOptional({
    example: 'APPROVED',
    enum: ApprovalStatus,
  })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  status?: ApprovalStatus;

  @ApiPropertyOptional({
    example: 'Revisado manualmente',
  })
  @IsString()
  @IsOptional()
  observation?: string;
}
