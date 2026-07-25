import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CompanyLoginDto {
  @ApiProperty({
    example: 'empresa@email.com',
    description: 'E-mail da empresa',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Senha@123',
    description: 'Senha cadastrada pela empresa',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
