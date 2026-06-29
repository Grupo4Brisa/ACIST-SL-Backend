import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @ApiProperty({ example: 199.90 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: 'PIX' })
  @IsString()
  @IsNotEmpty()
  paymentType!: string;

  @ApiProperty({
    example: '2026-08-15T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  dueDate!: Date;
}
