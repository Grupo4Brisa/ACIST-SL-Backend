import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventRegistrationDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  eventId!: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  companyId!: number;

  // opcional, mas ignorado se vier do frontend
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
