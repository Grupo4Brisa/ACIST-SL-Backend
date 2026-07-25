import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';

import { CompanyStatus } from '../company-status.enum';

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
    example: 'Redes Sociais',
    description: 'Origem da empresa',
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({
    example: 'João da Silva',
    description: 'Detalhe da origem (nome do associado indicador ou descrição de outro)',
  })
  @IsOptional()
  @IsString()
  originDetail?: string;

  // =========================
  // DADOS COMPLEMENTARES
  // =========================

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stateRegistration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  establishmentType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  headquartersType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  employeesCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  foundationDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventPresentation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  associationDate?: string;

  // =========================
  // STATUS
  // =========================

  @ApiPropertyOptional({
    enum: CompanyStatus,
  })
  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;
}
