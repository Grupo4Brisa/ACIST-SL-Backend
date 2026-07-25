import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';


// =========================
// EMPRESAS
// =========================

export class CompaniesDashboardDto {

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





// =========================
// EVENTOS
// =========================

export class EventsDashboardDto {

  @ApiProperty({
    example: 8,
    description: 'Total de eventos cadastrados',
  })
  total!: number;

}





// =========================
// DOCUMENTOS
// =========================

export class DocumentsDashboardDto {

  @ApiProperty({
    example: 56,
    description: 'Total de documentos cadastrados',
  })
  total!: number;

}





// =========================
// COMUNICADOS
// =========================

export class AnnouncementsDashboardDto {

  @ApiProperty({
    example: 12,
    description: 'Total de comunicados cadastrados',
  })
  total!: number;

}





// =========================
// EMPRESAS POR PORTE
// =========================

export class CompanySizeDashboardDto {

  @ApiProperty({
    example: 'Pequena',
    description: 'Porte da empresa',
  })
  porte!: string;



  @ApiProperty({
    example: 45,
    description: 'Quantidade de empresas neste porte',
  })
  quantidade!: number;

}





// =========================
// EMPRESAS POR ORIGEM
// =========================

export class CompanyOriginDashboardDto {

  @ApiProperty({
    example: 'website',
    description: 'Origem do cadastro da empresa',
  })
  origem!: string;



  @ApiProperty({
    example: 45,
    description: 'Quantidade de empresas desta origem',
  })
  quantidade!: number;

}





// =========================
// RESPONSE COMPLETO
// =========================

@ApiExtraModels(
  CompaniesDashboardDto,
  EventsDashboardDto,
  DocumentsDashboardDto,
  AnnouncementsDashboardDto,
  CompanySizeDashboardDto,
  CompanyOriginDashboardDto,
)
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





  @ApiProperty({
    type: [CompanySizeDashboardDto],
    description: 'Quantidade de empresas agrupadas por porte',
  })
  companySize!: CompanySizeDashboardDto[];





  @ApiProperty({
    type: [CompanyOriginDashboardDto],
    description: 'Quantidade de empresas agrupadas por origem',
  })
  origin!: CompanyOriginDashboardDto[];

}
