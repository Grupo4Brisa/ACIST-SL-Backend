import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, IsNull, Or, Repository } from 'typeorm';

import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
  ) {}

  create(dto: CreateAnnouncementDto) {
    return this.announcementsRepository.save(
      this.announcementsRepository.create({
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      }),
    );
  }

  findAll() {
    const now = new Date();
    return this.announcementsRepository.find({
      where: {
        active: true,
        scheduledAt: Or(IsNull(), LessThanOrEqual(now)),
      },
      order: { createdAt: 'DESC' },
    });
  }

  findAllAdmin() {
    return this.announcementsRepository.find({
      order: { scheduledAt: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const announcement = await this.announcementsRepository.findOne({ where: { id } });
    if (!announcement) throw new NotFoundException('Announcement não encontrado');
    return announcement;
  }

  async update(id: number, dto: UpdateAnnouncementDto & { scheduledAt?: string | null }) {
    const announcement = await this.findOne(id);
    Object.assign(announcement, {
      ...dto,
      scheduledAt: dto.scheduledAt !== undefined
        ? (dto.scheduledAt ? new Date(dto.scheduledAt) : null)
        : announcement.scheduledAt,
    });
    return this.announcementsRepository.save(announcement);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.announcementsRepository.update(id, { active: false });
    return { message: 'Aviso removido com sucesso' };
  }
}
