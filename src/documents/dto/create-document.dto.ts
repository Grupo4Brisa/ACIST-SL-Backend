import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @ApiProperty({ example: 'CONTRATO_SOCIAL' })
  @IsNotEmpty()
  @IsString()
  documentType!: string;
}
