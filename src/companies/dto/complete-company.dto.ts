import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { CompanyOrigin } from '../company-origin.enum';

export class CompleteCompanyDto {

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

  @ApiPropertyOptional({
    enum: CompanyOrigin,
    example: CompanyOrigin.WEBSITE,
    description: 'Origem da empresa',
  })
  @IsOptional()
  @IsEnum(CompanyOrigin)
  origin?: CompanyOrigin;

}
