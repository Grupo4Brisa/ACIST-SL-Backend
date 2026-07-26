import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Solution } from './entities/solution.entity';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

// =========================
// SEED
// Lista fixa das soluções exibidas
// no cadastro do associado.
// Só é inserida se a tabela estiver vazia,
// então não duplica em reinicializações
// nem em ambientes que já têm dados.
// =========================

const SOLUTIONS_SEED: { name: string; description?: string }[] = [
  { name: 'Analise de Credito SCPC' },
  { name: 'Certificado de Origem' },
  { name: 'Certificado Digital' },
  { name: 'Carta de Exclusividade' },
  { name: 'Capacitacoes (Cursos e Eventos)' },
  { name: 'Locacoes de Espacos (Salas, Auditorio, Sede e Rancho)' },
  { name: 'Eventos (Boletim, Terca, Momento, Viva Sao Leo, Pedal Seguro, Matchmaking...)' },
  { name: 'Convenios / Rede de Vantagens' },
  { name: 'Programa Empreender (Projeto de Nucleos)' },
];

@Injectable()
export class SolutionsService implements OnModuleInit {

  private readonly logger = new Logger(SolutionsService.name);

  constructor(
    @InjectRepository(Solution)
    private readonly repo: Repository<Solution>,
  ) {}

  // =========================
  // SEED AUTOMÁTICO
  // Executado uma vez quando o módulo
  // é inicializado (toda subida da API).
  // =========================
  async onModuleInit() {

    const count = await this.repo.count();

    if (count > 0) {
      return;
    }

    this.logger.log(
      'Tabela solutions vazia. Inserindo soluções padrão...',
    );

    const entities = this.repo.create(SOLUTIONS_SEED);

    await this.repo.save(entities);

    this.logger.log(
      `${SOLUTIONS_SEED.length} soluções inseridas com sucesso.`,
    );

  }

  // =========================
  // LISTAR
  // =========================
  findAll() {
    return this.repo.find();
  }

  // =========================
  // BUSCAR POR ID
  // =========================
  async findOne(id: number) {
    const solution = await this.repo.findOne({ where: { id } });

    if (!solution) {
      throw new NotFoundException('Solution não encontrada');
    }

    return solution;
  }

  // =========================
  // CREATE (NOME ÚNICO)
  // =========================
  async create(data: CreateSolutionDto) {
    const exists = await this.repo.findOne({
      where: { name: data.name },
    });

    if (exists) {
      throw new ConflictException('Já existe uma solution com esse nome');
    }

    const solution = this.repo.create(data);

    return this.repo.save(solution);
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, data: UpdateSolutionDto) {
    const solution = await this.findOne(id);

    if (data.name) {
      const exists = await this.repo.findOne({
        where: { name: data.name },
      });

      if (exists && exists.id !== id) {
        throw new ConflictException('Nome já está em uso');
      }
    }

    const updated = this.repo.merge(solution, data);

    return this.repo.save(updated);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const solution = await this.findOne(id);

    await this.repo.delete(id);

    return {
      message: 'Solution removida com sucesso',
    };
  }
}
