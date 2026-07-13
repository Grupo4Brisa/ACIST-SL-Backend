import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';

import { CompaniesService } from './companies.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { CompleteCompanyDto } from './dto/complete-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FilterCompanyDto } from './dto/filter-company.dto';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { UserRole } from '../users/user-role.enum';



@ApiTags('Companies')
@ApiBearerAuth('access-token')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Controller('companies')
export class CompaniesController {


  constructor(

    private readonly companiesService:
      CompaniesService,

    private readonly configService:
      ConfigService,

  ) {}




  // =====================================
  // LISTAR EMPRESAS
  // SOMENTE COLABORADORES
  // =====================================
  @Get()
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary:'Listar empresas com filtros',
  })
  @ApiResponse({
    status:200,
    description:'Lista retornada com sucesso',
  })
  findAll(
    @Query()
    filters: FilterCompanyDto,
  ) {

    return this.companiesService.findAll(
      filters,
    );

  }





  // =====================================
  // BUSCAR EMPRESA POR ID
  // SOMENTE COLABORADORES
  // =====================================
  @Get(':id')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary:'Buscar empresa por ID',
  })
  @ApiParam({
    name:'id',
    example:1,
  })
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id:number,
  ) {

    return this.companiesService.findOne(
      id,
    );

  }





  // =====================================
  // CADASTRO INICIAL LANDING
  //
  // Parametrizado:
  //
  // landingPassword = true
  // -> residência
  //
  // landingPassword = false
  // -> cliente sem senha
  // =====================================
  @Post('landing')
  @ApiOperation({
    summary:'Criar empresa (cadastro inicial)',
  })
  @ApiBody({
    type:CreateCompanyDto,
  })
  createLanding(

    @Body()
    body:CreateCompanyDto,

  ) {


    const landingPassword =
      this.configService.get<boolean>(
        'features.landingPassword',
      );



    if (!landingPassword) {

      body.password =
        undefined as any;

    }



    return this.companiesService.createLanding(
      body,
    );

  }





  // =====================================
  // COMPLETAR CADASTRO
  //
  // Empresa ou colaborador
  // =====================================
  @Patch(':id/complete')
  @ApiOperation({
    summary:'Completar cadastro da empresa',
  })
  @ApiParam({
    name:'id',
    example:1,
  })
  @ApiBody({
    type:CompleteCompanyDto,
  })
  complete(

    @Param(
      'id',
      ParseIntPipe,
    )
    id:number,


    @Body()
    body:CompleteCompanyDto,


    @Req()
    req,

  ) {

    return this.companiesService.complete(
      id,
      body,
    );

  }





  // =====================================
  // APROVAR EMPRESA
  // SOMENTE APROVADOR
  // =====================================
  @Patch(':id/approve')
  @Roles(
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary:'Aprovar empresa',
  })
  @ApiParam({
    name:'id',
    example:1,
  })
  approve(

    @Param(
      'id',
      ParseIntPipe,
    )
    id:number,


    @Req()
    req,

  ) {

    return this.companiesService.approve(
      id,
      req.user.id,
    );

  }





  // =====================================
  // REPROVAR EMPRESA
  // SOMENTE APROVADOR
  // =====================================
  @Patch(':id/reject')
  @Roles(
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary:'Reprovar empresa',
  })
  @ApiParam({
    name:'id',
    example:1,
  })
  reject(

    @Param(
      'id',
      ParseIntPipe,
    )
    id:number,


    @Req()
    req,

  ) {

    return this.companiesService.reject(
      id,
      req.user.id,
    );

  }





  // =====================================
  // ATUALIZAR EMPRESA
  // ADMIN + APROVADOR
  // =====================================
  @Patch(':id')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary:'Atualizar empresa',
  })
  @ApiParam({
    name:'id',
    example:1,
  })
  @ApiBody({
    type:UpdateCompanyDto,
  })
  update(

    @Param(
      'id',
      ParseIntPipe,
    )
    id:number,


    @Body()
    body:UpdateCompanyDto,

  ) {

    return this.companiesService.update(
      id,
      body,
    );

  }





  // =====================================
  // REMOVER EMPRESA
  // SOMENTE ADMIN
  // =====================================
  @Delete(':id')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
  )
  @ApiOperation({
    summary:'Remover empresa',
  })
  @ApiParam({
    name:'id',
    example:1,
  })
  remove(

    @Param(
      'id',
      ParseIntPipe,
    )
    id:number,

  ) {

    return this.companiesService.remove(
      id,
    );

  }


}
