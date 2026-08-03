import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventRegistration } from './entities/event-registration.entity';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly repo: Repository<EventRegistration>,
  ) {}

  // =========================
  // FIND ALL
  // =========================
  findAll() {
    return this.repo.find();
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: number) {
    const reg = await this.repo.findOne({ where: { id } });

    if (!reg) {
      throw new NotFoundException('Registro não encontrado');
    }

    return reg;
  }

  // =========================
  // CREATE (COM REGRA DE DUPLICIDADE)
  // =========================
  async create(data: CreateEventRegistrationDto) {
    const exists = await this.repo.findOne({
      where: {
        eventId: data.eventId,
        companyId: data.companyId,
      },
    });

    if (exists) {
      throw new ConflictException('Empresa já está registrada neste evento');
    }

    const registration = this.repo.create({
      ...data,
      status: 'REGISTERED',
    });

    return this.repo.save(registration);
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, data: UpdateEventRegistrationDto) {
    const reg = await this.findOne(id);

    const updated = this.repo.merge(reg, data);

    return this.repo.save(updated);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const reg = await this.findOne(id);

    await this.repo.delete(id);

    return {
      message: 'Registro removido com sucesso',
    };
  }
}
