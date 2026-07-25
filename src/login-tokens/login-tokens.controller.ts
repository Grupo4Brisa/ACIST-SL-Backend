import {
  Controller,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { LoginTokensService } from './login-tokens.service';

import { CreateLoginTokenDto } from './dto/create-login-token.dto';

@ApiTags('Login Tokens')
@Controller('login-tokens')
export class LoginTokensController {
  constructor(
    private readonly loginTokensService: LoginTokensService,
  ) {}

  // =====================================
  // GERAR TOKEN
  //
  // ROTA PÚBLICA
  // =====================================
  @Post()
  @ApiOperation({
    summary: 'Gerar token para completar cadastro',
  })
  @ApiBody({
    type: CreateLoginTokenDto,
  })
  create(
    @Body()
    body: CreateLoginTokenDto,
  ) {
    return this.loginTokensService.createToken(
      body.companyId,
    );
  }

  // =====================================
  // VALIDAR TOKEN
  // =====================================
  @Get('validate/:token')
  @ApiOperation({
    summary: 'Validar token de conclusão de cadastro',
  })
  @ApiParam({
    name: 'token',
    example: '4af7d7d2-a640-4e6c-a53c-8d1b60b56d5d',
  })
  validate(
    @Param('token')
    token: string,
  ) {
    return this.loginTokensService.validateToken(
      token,
    );
  }

  // =====================================
  // CONSUMIR TOKEN
  // =====================================
  @Post('consume/:token')
  @ApiOperation({
    summary: 'Consumir token após conclusão do cadastro',
  })
  @ApiParam({
    name: 'token',
    example: '4af7d7d2-a640-4e6c-a53c-8d1b60b56d5d',
  })
  consume(
    @Param('token')
    token: string,
  ) {
    return this.loginTokensService.consumeToken(
      token,
    );
  }
}