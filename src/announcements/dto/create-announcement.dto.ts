import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({
    example: 'Assembleia Geral',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example: 'A assembleia será realizada...',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}