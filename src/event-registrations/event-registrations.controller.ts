import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { EventRegistrationsService } from './event-registrations.service';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';

@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(
    private readonly eventRegistrationsService: EventRegistrationsService,
  ) {}

  @Get()
  findAll() {
    return this.eventRegistrationsService.findAll();
  }

  @Post()
  create(@Body() body: CreateEventRegistrationDto) {
    return this.eventRegistrationsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventRegistrationsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateEventRegistrationDto,
  ) {
    return this.eventRegistrationsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventRegistrationsService.remove(Number(id));
  }
}
