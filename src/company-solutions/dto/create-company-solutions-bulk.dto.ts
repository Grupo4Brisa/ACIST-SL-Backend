import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  ArrayNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';


export class CreateCompanySolutionsBulkDto {

  @ApiProperty({
    example:[1,3,7],
    description:'IDs das soluções selecionadas'
  })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({
    each:true
  })
  solutions!: number[];

}
