import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';


export class CreateCompanyContactDto {

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  companyId!: number;



  @ApiProperty({
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;



  @ApiProperty({
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;



  @ApiProperty({
    example: '51999999999',
  })
  @IsOptional()
  @IsString()
  phone?: string;



  @ApiProperty({
    example: 'Financeiro',
  })
  @IsString()
  @IsNotEmpty()
  role!: string;

}
