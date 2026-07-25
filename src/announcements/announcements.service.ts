import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
  ) {}

  create(createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsRepository.save(
      this.announcementsRepository.create(createAnnouncementDto),
    );
  }

  findAll() {
    return this.announcementsRepository.find({
      where: { active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const announcement = await this.announcementsRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement não encontrado');
    }

    return announcement;
  }

  async update(id: number, dto: UpdateAnnouncementDto) {
    const announcement = await this.findOne(id);

    Object.assign(announcement, dto);

    return this.announcementsRepository.save(announcement);
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.announcementsRepository.update(id, {
      active: false,
    });

    return {
      message: 'Aviso removido com sucesso',
    };
  }
}
