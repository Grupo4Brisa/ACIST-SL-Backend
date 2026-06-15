import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  findAll() {
    return this.eventRepository.find();
  }

  create(eventData: CreateEventDto) {
    const event = this.eventRepository.create(eventData);

    return this.eventRepository.save(event);
  }
}
