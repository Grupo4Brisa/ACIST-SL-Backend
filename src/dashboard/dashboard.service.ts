import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../companies/entities/company.entity';
import { CompanyStatus } from '../companies/company-status.enum';
import { Event } from '../events/entities/event.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Document } from '../documents/entities/document.entity';
import { Approval } from '../approvals/entities/approval.entity';
import { Payment } from '../payments/entities/payment.entity';

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
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
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

    // =============================================
    // TEMPOS MÉDIOS DO FUNIL
    //
    // 1. Landing → Pagamento     : CREATED → primeiro payments.createdAt
    // 2. Pagamento → Cadastro    : primeiro payments.createdAt → FINALIZED
    // 3. Cadastro → Aprovação    : FINALIZED → APPROVED
    // 4. Landing → Aprovação     : CREATED → APPROVED (total)
    // =============================================
    const timesRaw = await this.approvalRepository.manager.query(`
      WITH
        created_ts AS (
          SELECT "companyId", MIN("createdAt") AS ts
          FROM approvals WHERE action = 'CREATED'
          GROUP BY "companyId"
        ),
        payment_ts AS (
          SELECT "companyId", MIN("createdAt") AS ts
          FROM payments
          GROUP BY "companyId"
        ),
        finalized_ts AS (
          SELECT "companyId", MIN("createdAt") AS ts
          FROM approvals WHERE action = 'FINALIZED'
          GROUP BY "companyId"
        ),
        approved_ts AS (
          SELECT "companyId", MIN("createdAt") AS ts
          FROM approvals WHERE action = 'APPROVED'
          GROUP BY "companyId"
        )
      SELECT
        AVG(EXTRACT(EPOCH FROM (p.ts  - c.ts)) * 1000) AS landing_to_payment,
        AVG(EXTRACT(EPOCH FROM (f.ts  - p.ts)) * 1000) AS payment_to_finalized,
        AVG(EXTRACT(EPOCH FROM (a.ts  - f.ts)) * 1000) AS finalized_to_approved,
        AVG(EXTRACT(EPOCH FROM (a.ts  - c.ts)) * 1000) AS landing_to_approved
      FROM created_ts c
      LEFT JOIN payment_ts   p ON p."companyId" = c."companyId"
      LEFT JOIN finalized_ts f ON f."companyId" = c."companyId"
      LEFT JOIN approved_ts  a ON a."companyId" = c."companyId"
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
        landingToPayment:    Number(t.landing_to_payment)    || null,
        paymentToFinalized:  Number(t.payment_to_finalized)  || null,
        finalizedToApproved: Number(t.finalized_to_approved) || null,
        landingToApproved:   Number(t.landing_to_approved)   || null,
      },
    };
  }
}
