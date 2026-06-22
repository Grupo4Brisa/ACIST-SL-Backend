import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  findAll() {
    return this.eventRepository.find();
  }

  findOne(id: number) {
    return this.eventRepository.findOne({
      where: { id },
    });
  }

  create(createEventDto: CreateEventDto) {
    const event =
      this.eventRepository.create(createEventDto);

    return this.eventRepository.save(event);
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto) {
    await this.eventRepository.update(id, updateEventDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.eventRepository.delete(id);

    return {
      message: 'Evento removido com sucesso',
    };
  }
}
