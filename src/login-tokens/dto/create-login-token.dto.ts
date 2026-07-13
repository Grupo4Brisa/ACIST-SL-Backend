import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateLoginTokenDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  companyId!: number;

  @ApiProperty({
    example: '4af7d7d2-a640-4e6c-a53c-8d1b60b56d5d',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: '2026-08-01T12:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  expiresAt!: Date;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  used!: boolean;
}
