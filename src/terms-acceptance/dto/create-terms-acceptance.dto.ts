import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateTermsAcceptanceDto {
  @ApiProperty({
    example: 1,
    description: 'ID da empresa que está aceitando os termos',
  })
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @ApiProperty({
    example: true,
    description: 'Indica se a empresa aceitou os termos',
  })
  @IsBoolean()
  accepted!: boolean;

  @ApiProperty({
    example: 'v1.0',
    description: 'Versão dos termos aceitos',
  })
  @IsString()
  @IsNotEmpty()
  termVersion!: string;
}
