import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  corporateName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$|^\d{14}$/)
  cnpjcpf!: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companySize!: string;
}
