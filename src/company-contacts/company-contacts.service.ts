import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CompanyContact } from './entities/company-contact.entity';

import { CreateCompanyContactDto } from './dto/create-company-contact.dto';
import { ApprovalsService } from '../approvals/approvals.service';
import { ApprovalAction } from '../approvals/approval-action.enum';

@Injectable()
export class CompanyContactsService {
  constructor(
    @InjectRepository(CompanyContact)
    private readonly companyContactRepository: Repository<CompanyContact>,

    private readonly approvalsService: ApprovalsService,
  ) {}

  // =====================================
  // LISTAR TODOS OS CONTATOS
  // =====================================

  findAll() {
    return this.companyContactRepository.find();
  }

  // =====================================
  // LISTAR CONTATOS POR EMPRESA
  // =====================================

  findByCompany(companyId: number) {
    return this.companyContactRepository.find({
      where: {
        companyId,
      },

      order: {
        id: 'ASC',
      },
    });
  }

  // =====================================
  // CRIAR UM CONTATO
  // =====================================

  async create(contactData: CreateCompanyContactDto) {
    const contact = this.companyContactRepository.create(contactData);

    return this.companyContactRepository.save(contact);
  }

  // =====================================
  // CRIAR VÁRIOS CONTATOS
  // USADO NO CADASTRO DA EMPRESA
  // =====================================

  async createMany(
    contacts: CreateCompanyContactDto[],
    userId?: number | null,
  ) {
    const entities = this.companyContactRepository.create(contacts);

    const saved = await this.companyContactRepository.save(entities);
    if (contacts.length > 0) {
      const names = contacts.map((c) => c.name).join(', ');
      await this.approvalsService.createLog({
        companyId: contacts[0].companyId,
        userId: userId ?? null,
        action: ApprovalAction.COMPLETED,
        observation: `Contatos atualizados: ${names}`,
      });
    }
    return saved;
  }

  async remove(id: number) {
    await this.companyContactRepository.delete(id);
    return { message: 'Contato removido com sucesso' };
  }
}
