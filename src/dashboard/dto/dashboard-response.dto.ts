import { ApiProperty } from '@nestjs/swagger';

class CompaniesDashboardDto {
  @ApiProperty({
    example: 120,
    description: 'Total de empresas cadastradas',
  })
  total!: number;

  @ApiProperty({
    example: 80,
    description: 'Empresas ativas',
  })
  active!: number;

  @ApiProperty({
    example: 20,
    description: 'Empresas aguardando aprovação',
  })
  pendingApproval!: number;

  @ApiProperty({
    example: 10,
    description: 'Empresas com cadastro incompleto',
  })
  incomplete!: number;

  @ApiProperty({
    example: 10,
    description: 'Empresas inativas',
  })
  inactive!: number;
}

class EventsDashboardDto {
  @ApiProperty({
    example: 8,
    description: 'Total de eventos cadastrados',
  })
  total!: number;
}

class DocumentsDashboardDto {
  @ApiProperty({
    example: 56,
    description: 'Total de documentos cadastrados',
  })
  total!: number;
}

class AnnouncementsDashboardDto {
  @ApiProperty({
    example: 12,
    description: 'Total de comunicados cadastrados',
  })
  total!: number;
}

export class DashboardResponseDto {
  @ApiProperty({
    type: CompaniesDashboardDto,
  })
  companies!: CompaniesDashboardDto;

  @ApiProperty({
    type: EventsDashboardDto,
  })
  events!: EventsDashboardDto;

  @ApiProperty({
    type: DocumentsDashboardDto,
  })
  documents!: DocumentsDashboardDto;

  @ApiProperty({
    type: AnnouncementsDashboardDto,
  })
  announcements!: AnnouncementsDashboardDto;
}
