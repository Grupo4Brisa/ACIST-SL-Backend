import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { CompanyStatus } from '../company-status.enum';

export class FilterCompanyDto {
  @ApiPropertyOptional({
    description: 'Nome da empresa',
    example: 'Tech',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'Cidade da empresa',
    example: 'São Leopoldo',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Porte da empresa',
    example: 'MEI',
  })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiPropertyOptional({
    description: 'Ramo/Tipo de estabelecimento',
    example: 'Tecnologia',
  })
  @IsOptional()
  @IsString()
  establishmentType?: string;

  @ApiPropertyOptional({
    enum: CompanyStatus,
    description: 'Status da empresa',
    example: CompanyStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;
}
