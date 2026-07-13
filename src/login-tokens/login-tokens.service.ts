import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoginToken } from './entities/login-token.entity';
import { CreateLoginTokenDto } from './dto/create-login-token.dto';
import { UpdateLoginTokenDto } from './dto/update-login-token.dto';

@Injectable()
export class LoginTokensService {
  constructor(
    @InjectRepository(LoginToken)
    private readonly loginTokensRepository: Repository<LoginToken>,
  ) {}

  create(createLoginTokenDto: CreateLoginTokenDto) {
    const loginToken =
      this.loginTokensRepository.create(createLoginTokenDto);

    return this.loginTokensRepository.save(loginToken);
  }

  findAll() {
    return this.loginTokensRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return this.loginTokensRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateLoginTokenDto: UpdateLoginTokenDto,
  ) {
    await this.loginTokensRepository.update(id, updateLoginTokenDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.loginTokensRepository.delete(id);

    return {
      message: 'Token removido com sucesso',
    };
  }
}
