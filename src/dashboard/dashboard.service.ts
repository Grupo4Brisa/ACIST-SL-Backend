import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../companies/entities/company.entity';
import { CompanyStatus } from '../companies/company-status.enum';
import { Event } from '../events/entities/event.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Document } from '../documents/entities/document.entity';
import { Approval } from '../approvals/entities/approval.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
  ) {}

  private formatHours(ms: number | null): string {
    if (!ms || ms <= 0) return '-';
    const minutes = Math.round(ms / 1000 / 60);
    if (minutes < 60) return minutes + 'min';
    const hours = Math.round(minutes / 60);
    if (hours < 24) return hours + 'h';
    return Math.round(hours / 24) + 'd';
  }

  async getDashboard() {
    const [
      totalCompanies, activeCompanies, pendingCompanies,
      inactiveCompanies, incompleteCompanies,
      totalEvents, totalAnnouncements, totalDocuments,
    ] = await Promise.all([
      this.companyRepository.count(),
      this.companyRepository.count({ where: { status: CompanyStatus.ACTIVE } }),
      this.companyRepository.count({ where: { status: CompanyStatus.PENDING_APPROVAL } }),
      this.companyRepository.count({ where: { status: CompanyStatus.INACTIVE } }),
      this.companyRepository.count({ where: { status: CompanyStatus.INCOMPLETE } }),
      this.eventRepository.count(),
      this.announcementRepository.count(),
      this.documentRepository.count(),
    ]);

    const companiesBySize = await this.companyRepository
      .createQueryBuilder('company')
      .select('LOWER(company.companySize)', 'porte')
      .addSelect('COUNT(company.id)', 'quantidade')
      .where('company.companySize IS NOT NULL')
      .groupBy('LOWER(company.companySize)')
      .getRawMany();

    const companiesByOrigin = await this.companyRepository
      .createQueryBuilder('company')
      .select('company.origin', 'origem')
      .addSelect('COUNT(company.id)', 'quantidade')
      .where('company.origin IS NOT NULL')
      .groupBy('company.origin')
      .getRawMany();

    const timesRaw = await this.approvalRepository.manager.query(`
      WITH
        created_ts AS (
          SELECT "companyId", MIN("createdAt") AS ts FROM approvals WHERE action = 'CREATED' GROUP BY "companyId"
        ),
        finalized_ts AS (
          SELECT "companyId", MIN("createdAt") AS ts FROM approvals WHERE action = 'FINALIZED' GROUP BY "companyId"
        ),
        decided_ts AS (
          SELECT "companyId", MIN("createdAt") AS ts FROM approvals WHERE action IN ('APPROVED','REJECTED') GROUP BY "companyId"
        )
      SELECT
        AVG(EXTRACT(EPOCH FROM (f.ts - c.ts)) * 1000) AS landing_to_finalized,
        AVG(EXTRACT(EPOCH FROM (d.ts - f.ts)) * 1000) AS finalized_to_decided,
        AVG(EXTRACT(EPOCH FROM (d.ts - c.ts)) * 1000) AS landing_to_decided
      FROM created_ts c
      LEFT JOIN finalized_ts f ON f."companyId" = c."companyId"
      LEFT JOIN decided_ts d ON d."companyId" = c."companyId"
    `);

    const t = timesRaw[0] || {};

    return {
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        pendingApproval: pendingCompanies,
        inactive: inactiveCompanies,
        incomplete: incompleteCompanies,
      },
      events: { total: totalEvents },
      announcements: { total: totalAnnouncements },
      documents: { total: totalDocuments },
      companySize: companiesBySize,
      origin: companiesByOrigin,
      avgTimes: {
        landingToFinalized: this.formatHours(Number(t.landing_to_finalized)),
        finalizedToDecided: this.formatHours(Number(t.finalized_to_decided)),
        landingToDecided:   this.formatHours(Number(t.landing_to_decided)),
      },
    };
  }
}
