import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventRegistration } from './entities/event-registration.entity';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: Repository<EventRegistration>,
  ) {}

  findAll() {
    return this.eventRegistrationRepository.find();
  }

  findOne(id: number) {
    return this.eventRegistrationRepository.findOneBy({ id });
  }

  create(eventRegistrationData: CreateEventRegistrationDto) {
    const eventRegistration =
      this.eventRegistrationRepository.create(eventRegistrationData);

    return this.eventRegistrationRepository.save(eventRegistration);
  }

  update(
    id: number,
    eventRegistrationData: UpdateEventRegistrationDto,
  ) {
    return this.eventRegistrationRepository.update(
      id,
      eventRegistrationData,
    );
  }

  remove(id: number) {
    return this.eventRegistrationRepository.delete(id);
  }
}
