import { ApiProperty } from '@nestjs/swagger';

import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

import { Type } from 'class-transformer';


export class CreateLoginTokenDto {


  @ApiProperty({
    example: 1,
    description: 'ID da empresa que receberá o link de acesso',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  companyId!: number;


}
