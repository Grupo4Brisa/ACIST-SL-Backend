import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Entrar em contato com a empresa',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Ligar para confirmar participação no evento.',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: 5,
  })
  @Type(() => Number)
  @IsInt()
  assignedTo!: number;

  @ApiProperty({
    example: '2026-08-10T14:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  dueDate!: Date;
}
