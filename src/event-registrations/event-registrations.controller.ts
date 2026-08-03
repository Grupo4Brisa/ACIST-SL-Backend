import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

import { EventRegistrationsService } from './event-registrations.service';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';

@ApiTags('Event Registrations')
@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly service: EventRegistrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar inscrições em eventos' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar inscrição por ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Inscrever empresa em evento' })
  create(@Body() body: CreateEventRegistrationDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar inscrição' })
  update(@Param('id') id: string, @Body() body: UpdateEventRegistrationDto) {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover inscrição' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
