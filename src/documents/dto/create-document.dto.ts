import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

import { DocumentType } from '../document-type.enum';

export class CreateDocumentDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.SOCIAL_CONTRACT,
  })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  documentType!: DocumentType;
}
