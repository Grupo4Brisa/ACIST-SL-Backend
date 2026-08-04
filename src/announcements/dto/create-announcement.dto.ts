import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsDateString } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Assembleia Geral' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({ example: 'A assembleia será realizada...' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: '2026-08-10T14:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string | null;
}
