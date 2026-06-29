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

import { LoginTokensService } from './login-tokens.service';
import { CreateLoginTokenDto } from './dto/create-login-token.dto';
import { UpdateLoginTokenDto } from './dto/update-login-token.dto';

@Controller('login-tokens')
export class LoginTokensController {
  constructor(private readonly loginTokensService: LoginTokensService) {}

  @Post()
  create(
    @Body()
    createLoginTokenDto: CreateLoginTokenDto,
  ) {
    return this.loginTokensService.create(createLoginTokenDto);
  }

  @Get()
  findAll() {
    return this.loginTokensService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.loginTokensService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateLoginTokenDto: UpdateLoginTokenDto,
  ) {
    return this.loginTokensService.update(id, updateLoginTokenDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.loginTokensService.remove(id);
  }
}
