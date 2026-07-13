import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Gabriela Lima',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;


  @ApiProperty({
    example: 'gabriela@email.com',
  })
  @IsEmail()
  email!: string;


  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password!: string;


  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
