import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
    example: 'Redes Sociais',
    description: 'Origem da empresa',
  })
  @IsOptional()
  @IsString()
  origin?: string;

}
