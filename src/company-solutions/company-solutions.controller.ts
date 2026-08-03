import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { CompanySolutionsService } from './company-solutions.service';

import { CreateCompanySolutionDto } from './dto/create-company-solution.dto';

import { UpdateCompanySolutionDto } from './dto/update-company-solution.dto';

@ApiTags('Company Solutions')
@Controller('company-solutions')
export class CompanySolutionsController {
  constructor(private readonly service: CompanySolutionsService) {}

  /*
  ==================================================
      VINCULAR UMA SOLUÇÃO
  ==================================================
  */

  @Post()
  @ApiOperation({
    summary: 'Criar vínculo empresa x solução',
  })
  @ApiBody({
    type: CreateCompanySolutionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Vínculo criado com sucesso',
  })
  create(@Body() body: CreateCompanySolutionDto) {
    return this.service.create(body);
  }

  /*
  ==================================================
      SALVAR TODAS AS SOLUÇÕES DA EMPRESA
  ==================================================
  */

  @Post('company/:companyId')
  @ApiOperation({
    summary: 'Salvar múltiplas soluções selecionadas pela empresa',
  })
  @ApiParam({
    name: 'companyId',
    example: 1,
  })
  @ApiBody({
    schema: {
      example: {
        solutionIds: [1, 2, 3],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Soluções vinculadas com sucesso',
  })
  createMany(
    @Param('companyId') companyId: string,

    @Body()
    body: {
      solutionIds: number[];
    },
  ) {
    return this.service.createMany(
      Number(companyId),

      body.solutionIds,
    );
  }

  /*
  ==================================================
      LISTAR VÍNCULOS
  ==================================================
  */

  @Get()
  @ApiOperation({ summary: 'Listar vínculos empresa x solução' })
  findAll() {
    return this.service.findAll();
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Listar soluções por empresa' })
  findByCompany(@Param('companyId') companyId: string) {
    return this.service.findByCompany(Number(companyId));
  }

  /*
  ==================================================
      BUSCAR POR ID
  ==================================================
  */

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar vínculo por ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  /*
  ==================================================
      ATUALIZAR VÍNCULO
  ==================================================
  */

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar vínculo empresa x solução',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: UpdateCompanySolutionDto,
  })
  update(
    @Param('id') id: string,

    @Body()
    body: UpdateCompanySolutionDto,
  ) {
    return this.service.update(
      Number(id),

      body,
    );
  }

  /*
  ==================================================
      REMOVER
  ==================================================
  */

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover vínculo empresa x solução',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
