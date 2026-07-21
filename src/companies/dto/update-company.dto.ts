import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { CompanyStatus } from '../company-status.enum';
import { CompanyOrigin } from '../company-origin.enum';

export class UpdateCompanyDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  corporateName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/)
  cnpjcpf?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'NovaSenha@123',
    description: 'Nova senha da empresa',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiPropertyOptional({
    enum: CompanyOrigin,
    example: CompanyOrigin.WEBSITE,
    description: 'Origem da empresa',
  })
  @IsOptional()
  @IsEnum(CompanyOrigin)
  origin?: CompanyOrigin;

  @ApiPropertyOptional({
    enum: CompanyStatus,
  })
  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;

}
