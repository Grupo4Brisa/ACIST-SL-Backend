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
  // =========================
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista retornada com sucesso',
  })
  findAll() {
    return this.usersService.findAll();
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.usersService.findOne(id);
  }

  // =========================
  // CRIAR USUÁRIO
  // (PÚBLICO)
  // =========================
  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiBody({ type: CreateUserDto })
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
  // =========================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  // =========================
  // REMOVER USUÁRIO
  // =========================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.usersService.remove(id);
  }
}
