import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompanyContactDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  companyId!: number;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '51999999999' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'Manager' })
  @IsString()
  role!: string;
}
