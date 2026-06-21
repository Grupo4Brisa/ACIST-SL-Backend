import { Injectable } from '@nestjs/common';
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
    const announcement = this.announcementsRepository.create(createAnnouncementDto);

    return this.announcementsRepository.save(announcement);
  }

  findAll() {
    return this.announcementsRepository.find({
      where: {
        active: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return this.announcementsRepository.findOne({
      where: { id },
    });
  }

  async update(id: number,updateAnnouncementDto: UpdateAnnouncementDto) {
    await this.announcementsRepository.update(id,updateAnnouncementDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.announcementsRepository.update(id, {
      active: false,
    });

    return {
      message: 'Aviso removido com sucesso',
    };
  }
}