import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { LoginTokensService } from './login-tokens.service';
import { CreateLoginTokenDto } from './dto/create-login-token.dto';
import { UpdateLoginTokenDto } from './dto/update-login-token.dto';

@ApiTags('Login Tokens')
@Controller('login-tokens')
export class LoginTokensController {
  constructor(
    private readonly loginTokensService: LoginTokensService,
  ) {}

  // =========================
  // CREATE
  // =========================
  @Post()
  @ApiOperation({ summary: 'Criar token de login' })
  @ApiBody({
    type: CreateLoginTokenDto,
    description: 'Dados para criação do token',
  })
  @ApiResponse({
    status: 201,
    description: 'Token criado com sucesso',
  })
  create(
    @Body()
    createLoginTokenDto: CreateLoginTokenDto,
  ) {
    return this.loginTokensService.create(createLoginTokenDto);
  }

  // =========================
  // FIND ALL
  // =========================
  @Get()
  @ApiOperation({ summary: 'Listar tokens de login' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tokens retornada com sucesso',
  })
  findAll() {
    return this.loginTokensService.findAll();
  }

  // =========================
  // FIND ONE
  // =========================
  @Get(':id')
  @ApiOperation({ summary: 'Buscar token por ID' })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Token encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Token não encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.loginTokensService.findOne(id);
  }

  // =========================
  // UPDATE
  // =========================
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar token de login' })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: UpdateLoginTokenDto,
    description: 'Dados para atualização do token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token atualizado com sucesso',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateLoginTokenDto: UpdateLoginTokenDto,
  ) {
    return this.loginTokensService.update(
      id,
      updateLoginTokenDto,
    );
  }

  // =========================
  // DELETE
  // =========================
  @Delete(':id')
  @ApiOperation({ summary: 'Remover token de login' })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Token removido com sucesso',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.loginTokensService.remove(id);
  }
}
