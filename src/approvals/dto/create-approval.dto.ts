import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApprovalAction } from '../approval-action.enum';

export class CreateApprovalDto {
  @ApiProperty({
    example: 1,
    description: 'ID da empresa',
  })
  @IsInt()
  @IsNotEmpty()
  companyId!: number;

  @ApiProperty({
    example: 'APPROVED',
    enum: ApprovalAction,
  })
  @IsEnum(ApprovalAction)
  @IsNotEmpty()
  action!: ApprovalAction;

  @ApiProperty({
    example: 'Empresa validada com sucesso',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;
}
