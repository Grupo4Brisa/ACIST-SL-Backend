import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
  ) {}

  // =========================
  // LISTAR
  // =========================
  findAll() {
    return this.repo.find();
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  async findOne(id: number) {
    const event = await this.repo.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  // =========================
  // CREATE
  // =========================
  async create(data: CreateEventDto) {
    const now = Date.now();
    const eventDate = new Date(data.eventDate).getTime();

    if (eventDate < now) {
      throw new BadRequestException(
        'Data do evento não pode ser no passado',
      );
    }

    const event = this.repo.create({
      ...data,
      status: 'OPEN',
    });

    return this.repo.save(event);
  }

  // =========================
  // UPDATE (AJUSTADO)
  // =========================
  async update(id: number, data: UpdateEventDto) {
    const event = await this.findOne(id);

    // =========================
    // validação de data SOMENTE se vier no body
    // =========================
    if (data.eventDate) {
      const newDate = new Date(data.eventDate).getTime();

      if (newDate < Date.now()) {
        throw new BadRequestException(
          'Data do evento não pode ser no passado',
        );
      }
    }

    // =========================
    // merge seguro
    // =========================
    const updated = this.repo.merge(event, data);

    return this.repo.save(updated);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const event = await this.findOne(id);

    await this.repo.delete(id);

    return {
      message: 'Evento removido com sucesso',
    };
  }
}
