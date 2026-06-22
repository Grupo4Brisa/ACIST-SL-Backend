import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  create(userData: CreateUserDto) {
    const user = this.userRepository.create(userData);

    return this.userRepository.save(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id,updateUserDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);

    return {
      message: 'Usuário removido com sucesso',
    };
  }
}
