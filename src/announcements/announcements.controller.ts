import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo announcement' })
  @ApiResponse({ status: 201, description: 'Announcement criado' })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar announcements ativos (publico)' })
  findAll() {
    return this.announcementsService.findAll();
  }

  @Get('admin/all')
  @ApiOperation({ summary: 'Listar todos os announcements (admin)' })
  findAllAdmin() {
    return this.announcementsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar announcement por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar announcement' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Post(':id/send-email')
  @ApiOperation({ summary: 'Enviar comunicado por email para todas as empresas' })
  sendEmail(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.sendToEmails(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desativar announcement (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.remove(id);
  }
}
