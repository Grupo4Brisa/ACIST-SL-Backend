import { Controller, Get } from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  // =========================
  // DASHBOARD PRINCIPAL
  // =========================
  @Get()
  @ApiOperation({
    summary: 'Obter métricas do dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas retornadas com sucesso',
    type: DashboardResponseDto,
  })
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
