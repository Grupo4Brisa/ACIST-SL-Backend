import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { LoginTokensService } from './login-tokens.service';

import { CreateLoginTokenDto } from './dto/create-login-token.dto';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';



@ApiTags('Login Tokens')
@Controller('login-tokens')
export class LoginTokensController {


  constructor(
    private readonly loginTokensService:
      LoginTokensService,
  ) {}




  // =====================================
  // CRIAR TOKEN
  //
  // Uso interno:
  // após confirmação do pagamento
  //
  // Somente colaborador
  // =====================================
  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @ApiBearerAuth('access-token')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary:
      'Gerar token para completar cadastro',
  })
  @ApiBody({
    type: CreateLoginTokenDto,
  })
  create(
    @Body()
    body:CreateLoginTokenDto,
  ){

    return this.loginTokensService.createToken(
      body.companyId,
    );

  }






  // =====================================
  // VALIDAR TOKEN
  //
  // Público
  //
  // Usado pelo link enviado no email
  // =====================================
  @Get('validate/:token')
  @ApiOperation({
    summary:
      'Validar token de conclusão de cadastro',
  })
  @ApiParam({
    name:'token',
    example:
      '4af7d7d2-a640-4e6c-a53c-8d1b60b56d5d',
  })
  validate(
    @Param('token')
    token:string,
  ){

    return this.loginTokensService.validateToken(
      token,
    );

  }






  // =====================================
  // CONSUMIR TOKEN
  //
  // Após completar cadastro
  // =====================================
  @Post('consume/:token')
  @ApiOperation({
    summary:
      'Consumir token após conclusão do cadastro',
  })
  @ApiParam({
    name:'token',
    example:
      '4af7d7d2-a640-4e6c-a53c-8d1b60b56d5d',
  })
  consume(
    @Param('token')
    token:string,
  ){

    return this.loginTokensService.consumeToken(
      token,
    );

  }



}
