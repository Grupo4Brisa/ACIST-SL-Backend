import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  // =========================
  // LISTAR USUÁRIOS
  // =========================
  findAll() {
    return this.userRepository.find({
      select: [
        'id',
        'name',
        'email',
        'role',
        'active',
        'createdAt',
      ],
    });
  }



  // =========================
  // BUSCAR USUÁRIO POR ID
  // =========================
  async findOne(id: number) {

    const user =
      await this.userRepository.findOne({
        where: {
          id,
        },
        select: [
          'id',
          'name',
          'email',
          'role',
          'active',
          'createdAt',
        ],
      });


    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
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
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'active',
      ],
    });

  }



  // =========================
  // BUSCAR USUÁRIO PELO JWT
  // SEM SENHA
  // =========================
  async findByIdForAuth(id: number) {

    const user =
      await this.userRepository.findOne({
        where: {
          id,
        },
        select: [
          'id',
          'name',
          'email',
          'role',
          'active',
        ],
      });


    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }


    return user;
  }



  // =========================
  // CRIAR USUÁRIO
  // =========================
  async create(data: CreateUserDto) {

    const exists =
      await this.userRepository.findOne({
        where: {
          email: data.email,
        },
      });


    if (exists) {
      throw new ConflictException(
        'Email já cadastrado',
      );
    }


    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10,
      );


    const user =
      this.userRepository.create({
        ...data,
        password: hashedPassword,
        active: data.active ?? true,
      });


    const saved =
      await this.userRepository.save(user);


    const {
      password,
      ...userWithoutPassword
    } = saved;


    return userWithoutPassword;
  }



  // =========================
  // ATUALIZAR USUÁRIO
  // =========================
  async update(
    id: number,
    data: UpdateUserDto,
  ) {

    const user =
      await this.userRepository.findOne({
        where: {
          id,
        },
      });


    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }



    if (data.email) {

      const emailExists =
        await this.userRepository.findOne({
          where: {
            email: data.email,
          },
        });


      if (
        emailExists &&
        emailExists.id !== id
      ) {
        throw new ConflictException(
          'Email já está em uso',
        );
      }

    }



    if (data.password) {

      data.password =
        await bcrypt.hash(
          data.password,
          10,
        );

    }



    await this.userRepository.update(
      id,
      data,
    );


    return this.findOne(id);
  }



  // =========================
  // REMOVER USUÁRIO
  // =========================
  async remove(id: number) {

    const user =
      await this.userRepository.findOne({
        where: {
          id,
        },
      });


    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }


    await this.userRepository.delete(id);


    return {
      message:
        'Usuário removido com sucesso',
    };
  }
}
