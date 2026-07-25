import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: 'Entrar em contato com a empresa' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Ligar para confirmar participação no evento.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  assignedTo!: number;

  @ApiProperty({ example: '2026-08-10T14:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  dueDate!: Date;
}
