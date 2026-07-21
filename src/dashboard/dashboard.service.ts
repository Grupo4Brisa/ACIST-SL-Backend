import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Company } from '../companies/entities/company.entity';
import { CompanyStatus } from '../companies/company-status.enum';

import { Event } from '../events/entities/event.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Document } from '../documents/entities/document.entity';

@Injectable()
export class DashboardService {

  constructor(

    @InjectRepository(Company)
    private readonly companyRepository:
      Repository<Company>,

    @InjectRepository(Event)
    private readonly eventRepository:
      Repository<Event>,

    @InjectRepository(Announcement)
    private readonly announcementRepository:
      Repository<Announcement>,

    @InjectRepository(Document)
    private readonly documentRepository:
      Repository<Document>,

  ) {}

  async getDashboard() {

    const [

      totalCompanies,

      activeCompanies,

      pendingCompanies,

      inactiveCompanies,

      incompleteCompanies,

      totalEvents,

      totalAnnouncements,

      totalDocuments,

    ] = await Promise.all([

      this.companyRepository.count(),

      this.companyRepository.count({
        where: {
          status: CompanyStatus.ACTIVE,
        },
      }),

      this.companyRepository.count({
        where: {
          status: CompanyStatus.PENDING_APPROVAL,
        },
      }),

      this.companyRepository.count({
        where: {
          status: CompanyStatus.INACTIVE,
        },
      }),

      this.companyRepository.count({
        where: {
          status: CompanyStatus.INCOMPLETE,
        },
      }),

      this.eventRepository.count(),

      this.announcementRepository.count(),

      this.documentRepository.count(),

    ]);



    // =========================
    // EMPRESAS POR PORTE
    // =========================

    const companiesBySize =
      await this.companyRepository
        .createQueryBuilder('company')
        .select('LOWER(company.companySize)', 'porte')
        .addSelect('COUNT(company.id)', 'quantidade')
        .where('company.companySize IS NOT NULL')
        .groupBy('LOWER(company.companySize)')
        .getRawMany();



    // =========================
    // EMPRESAS POR ORIGEM
    // =========================

    const companiesByOrigin =
      await this.companyRepository
        .createQueryBuilder('company')
        .select('company.origin', 'origem')
        .addSelect('COUNT(company.id)', 'quantidade')
        .where('company.origin IS NOT NULL')
        .groupBy('company.origin')
        .getRawMany();



    return {

      companies: {

        total: totalCompanies,

        active: activeCompanies,

        pendingApproval: pendingCompanies,

        inactive: inactiveCompanies,

        incomplete: incompleteCompanies,

      },

      events: {
        total: totalEvents,
      },

      announcements: {
        total: totalAnnouncements,
      },

      documents: {
        total: totalDocuments,
      },

      companySize: companiesBySize,

      origin: companiesByOrigin,

    };

  }

}
