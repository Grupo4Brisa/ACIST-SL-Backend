import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  USER = 'USER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'Gabriela Lima' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'gabriela@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'ADMIN', enum: UserRole })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
