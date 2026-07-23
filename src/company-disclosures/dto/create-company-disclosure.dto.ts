import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  Type,
} from 'class-transformer';



export class CreateCompanyDisclosureDto {


  @ApiProperty({
    example: 1,
    description: 'ID da empresa vinculada à divulgação',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  companyId!: number;



  @ApiProperty({
    example:
      'Empresa especializada em soluções tecnológicas para negócios.',
    description:
      'Texto de divulgação da empresa com limite de 200 caracteres',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  text!: string;


}