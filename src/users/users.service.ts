import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {}

  // =========================
  // SEED DO ADMIN INICIAL
  // Executado uma vez quando o módulo
  // é inicializado (toda subida da API).
  //
  // Só cria se NÃO existir nenhum
  // usuário com role ADMIN — protege
  // contra duplicar em ambientes que
  // já têm admin (como o seu local).
  //
  // As credenciais vêm de variáveis de
  // ambiente (nunca hardcoded), então
  // cada ambiente (local, Railway,
  // produção) define as suas.
  // =========================
  async onModuleInit() {
    const adminCount = await this.userRepository.count({
      where: {
        role: UserRole.COLABORADOR_ADMIN,
      },
    });

    if (adminCount > 0) {
      return;
    }

    const email = this.configService.get<string>('SEED_ADMIN_EMAIL');
    const password = this.configService.get<string>('SEED_ADMIN_PASSWORD');
    const name =
      this.configService.get<string>('SEED_ADMIN_NAME') ?? 'Administrador';

    if (!email || !password) {
      this.logger.warn(
        'Nenhum administrador encontrado e SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD ' +
          'não foram configurados. Pulando criação do admin inicial. ' +
          'Defina essas variáveis de ambiente para criar o primeiro acesso automaticamente.',
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.COLABORADOR_ADMIN,
      active: true,
    });

    await this.userRepository.save(admin);

    this.logger.log(`Administrador inicial criado com sucesso: ${email}`);
  }

  // =========================
  // LISTAR USUÁRIOS
  // =========================
  findAll() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'active', 'createdAt'],
    });
  }

  // =========================
  // BUSCAR USUÁRIO POR ID
  // =========================
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'name', 'email', 'role', 'active', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  // =========================
  // BUSCAR POR EMAIL
  // SEM SENHA
  // =========================
  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  // =========================
  // BUSCAR USUÁRIO PARA LOGIN
  // COM SENHA
  // =========================
  findAuthUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'name', 'email', 'password', 'role', 'active'],
    });
  }

  // =========================
  // BUSCAR USUÁRIO PELO JWT
  // SEM SENHA
  // =========================
  async findByIdForAuth(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'name', 'email', 'role', 'active'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  // =========================
  // CRIAR USUÁRIO
  // =========================
  async create(data: CreateUserDto) {
    const exists = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (exists) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      active: data.active ?? true,
    });

    const saved = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = saved;

    return userWithoutPassword;
  }

  // =========================
  // ATUALIZAR USUÁRIO
  // =========================
  async update(id: number, data: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (data.email) {
      const emailExists = await this.userRepository.findOne({
        where: {
          email: data.email,
        },
      });

      if (emailExists && emailExists.id !== id) {
        throw new ConflictException('Email já está em uso');
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update(id, data);

    return this.findOne(id);
  }

  // =========================
  // REMOVER USUÁRIO
  // =========================
  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userRepository.delete(id);

    return {
      message: 'Usuário removido com sucesso',
    };
  }
}
