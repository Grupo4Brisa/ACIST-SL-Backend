import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

import { CompanyStatus } from '../companies/company-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly companiesService: CompaniesService,

    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // LOGIN COLABORADOR
  // =========================
  async login(email: string, password: string) {
    const user = await this.usersService.findAuthUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.active) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,

      type: 'USER',

      email: user.email,

      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),

      user: {
        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

        active: user.active,
      },
    };
  }

  // =========================
  // LOGIN ASSOCIADO / EMPRESA
  // =========================
  async companyLogin(email: string, password: string) {
    const company = await this.companiesService.findAuthCompanyByEmail(email);

    if (!company) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, company.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Empresas INCOMPLETE e PENDING_APPROVAL
    // podem acessar a área delas.
    // Apenas empresas INACTIVE são bloqueadas.
    if (company.status === CompanyStatus.INACTIVE) {
      throw new UnauthorizedException('Empresa inativa.');
    }

    const payload = {
      sub: company.id,

      type: 'COMPANY',

      email: company.email,

      status: company.status,
    };

    return {
      access_token: this.jwtService.sign(payload),

      company: {
        id: company.id,

        companyName: company.companyName,

        email: company.email,

        status: company.status,
      },
    };
  }
}
