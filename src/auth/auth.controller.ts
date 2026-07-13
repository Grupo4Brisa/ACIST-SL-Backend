import {
  Body,
  Controller,
  ForbiddenException,
  Post,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { CompanyLoginDto } from './dto/company-login.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,

    private readonly configService: ConfigService,
  ) {}



  // =========================
  // LOGIN COLABORADOR
  // =========================
  @Post('login')
  @ApiOperation({
    summary: 'Login de colaborador',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  login(
    @Body()
    body: LoginDto,
  ) {

    return this.authService.login(
      body.email,
      body.password,
    );

  }





  // =========================
  // LOGIN ASSOCIADO / EMPRESA
  // CONTROLADO POR FEATURE FLAG
  // =========================
  @Post('company-login')
  @ApiOperation({
    summary: 'Login da empresa associada',
  })
  @ApiBody({
    type: CompanyLoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Área do associado desativada',
  })
  companyLogin(
    @Body()
    body: CompanyLoginDto,
  ) {


    const associateLoginEnabled =
      this.configService.get<boolean>(
        'features.associateLogin',
      );



    if (!associateLoginEnabled) {

      throw new ForbiddenException(
        'Área do associado desativada.',
      );

    }



    return this.authService.companyLogin(
      body.email,
      body.password,
    );

  }

}
