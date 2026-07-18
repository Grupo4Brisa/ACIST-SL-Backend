import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { randomUUID } from 'crypto';

import { LoginToken } from './entities/login-token.entity';

@Injectable()
export class LoginTokensService {
  constructor(
    @InjectRepository(LoginToken)
    private readonly loginTokensRepository: Repository<LoginToken>,
  ) {}

  // =====================================
  // CRIAR TOKEN
  //
  // Validade: 7 dias
  // =====================================
  async createToken(companyId: number) {
    const token = randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const loginToken = this.loginTokensRepository.create({
      companyId,
      token,
      expiresAt,
      used: false,
    });

    return this.loginTokensRepository.save(loginToken);
  }

  // =====================================
  // VALIDAR TOKEN
  // =====================================
  async validateToken(token: string) {
    const loginToken =
      await this.loginTokensRepository.findOne({
        where: {
          token,
        },
      });

    if (!loginToken) {
      throw new NotFoundException(
        'Token inválido.',
      );
    }

    if (loginToken.used) {
      throw new BadRequestException(
        'Token já utilizado.',
      );
    }

    if (loginToken.expiresAt < new Date()) {
      throw new BadRequestException(
        'Token expirado.',
      );
    }

    return {
      valid: true,
      companyId: loginToken.companyId,
    };
  }

  // =====================================
  // BUSCAR TOKEN
  // =====================================
  async findByToken(token: string) {
    return this.loginTokensRepository.findOne({
      where: {
        token,
      },
    });
  }

  // =====================================
  // MARCAR COMO UTILIZADO
  // =====================================
  async markAsUsed(token: string) {
    const loginToken =
      await this.findByToken(token);

    if (!loginToken) {
      throw new NotFoundException(
        'Token não encontrado.',
      );
    }

    loginToken.used = true;

    return this.loginTokensRepository.save(
      loginToken,
    );
  }

  // =====================================
  // CONSUMIR TOKEN
  // =====================================
  async consumeToken(token: string) {
    return this.markAsUsed(token);
  }

  // =====================================
  // LISTAR TOKENS
  // =====================================
  findAll() {
    return this.loginTokensRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =====================================
  // BUSCAR POR ID
  // =====================================
  findOne(id: number) {
    return this.loginTokensRepository.findOne({
      where: {
        id,
      },
    });
  }

  // =====================================
  // REMOVER TOKEN
  // =====================================
  async remove(id: number) {
    await this.loginTokensRepository.delete(id);

    return {
      message: 'Token removido com sucesso.',
    };
  }
}