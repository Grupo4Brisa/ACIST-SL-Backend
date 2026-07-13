import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';


export class CreateCompanyDto {


  @ApiProperty({
    example: 'Empresa XYZ',
  })
  @IsString()
  @IsNotEmpty()
  companyName!: string;



  @ApiProperty({
    example: 'Empresa XYZ LTDA',
  })
  @IsString()
  @IsNotEmpty()
  corporateName!: string;



  @ApiProperty({
    example: '12345678000199',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$|^\d{14}$/)
  cnpjcpf!: string;



  @ApiProperty({
    example: 'empresa@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;



  // =========================
  // SOMENTE SE LANDING PASSWORD ESTIVER ATIVO
  // =========================
  @ApiPropertyOptional({
    example: 'Senha@123',
    description:
      'Senha de acesso. Obrigatória apenas quando a área do associado estiver habilitada.',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;



  @ApiProperty({
    example: '(51)99999-9999',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;



  @ApiProperty({
    example: 'Pequena',
  })
  @IsString()
  @IsNotEmpty()
  companySize!: string;

}
