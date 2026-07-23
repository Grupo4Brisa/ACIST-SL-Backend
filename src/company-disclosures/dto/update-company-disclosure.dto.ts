import {
  ApiPropertyOptional,
} from '@nestjs/swagger';


import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';



export class UpdateCompanyDisclosureDto {



  @ApiPropertyOptional({
    example:
      'Nova descrição da empresa para divulgação em eventos.',
    description:
      'Texto atualizado de divulgação da empresa com limite de 200 caracteres',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;



}
