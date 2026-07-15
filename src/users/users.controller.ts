import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
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

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserRole } from './user-role.enum';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}

  // =========================
  // LISTAR USUÁRIOS
  // SOMENTE ADMIN
  // =========================
  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.COLABORADOR_ADMIN,
  )
  @ApiOperation({
    summary: 'Listar todos os usuários',
  })
  findAll() {
    return this.usersService.findAll();
  }

  // =========================
  // BUSCAR POR ID
  // SOMENTE ADMIN
  // =========================
  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.COLABORADOR_ADMIN,
  )
  @ApiOperation({
    summary: 'Buscar usuário por ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.usersService.findOne(id);
  }

  // =========================
  // CRIAR USUÁRIO
  // PÚBLICO
  // =========================
  @Post()
  @ApiOperation({
    summary: 'Criar novo colaborador',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  create(
    @Body()
    body: CreateUserDto,
  ) {
    return this.usersService.create(body);
  }

  // =========================
  // ATUALIZAR USUÁRIO
  // SOMENTE ADMIN
  // =========================
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.COLABORADOR_ADMIN,
  )
  @ApiOperation({
    summary: 'Atualizar usuário',
  })
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    body: UpdateUserDto,
  ) {
    return this.usersService.update(
      id,
      body,
    );
  }

  // =========================
  // REMOVER USUÁRIO
  // SOMENTE ADMIN
  // =========================
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.COLABORADOR_ADMIN,
  )
  @ApiOperation({
    summary: 'Remover usuário',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.usersService.remove(id);
  }
}
