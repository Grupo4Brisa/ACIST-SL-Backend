import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApprovalDto {
  @ApiProperty({
    example: 1,
    description: 'ID da empresa que está sendo aprovada',
  })
  @IsInt()
  @IsNotEmpty()
  companyId!: number;

  @ApiProperty({
    example: 10,
    description: 'ID do usuário que está aprovando',
  })
  @IsInt()
  @IsNotEmpty()
  approvedBy!: number;

  @ApiProperty({
    example: 'Empresa válida e documentação correta',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;
}
