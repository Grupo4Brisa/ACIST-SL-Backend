import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanySolutionDto {
  @ApiProperty({
    example: 1,
    description: 'ID da empresa que receberá a solução',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @ApiProperty({
    example: 2,
    description: 'ID da solução vinculada à empresa',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  solutionId!: number;
}
