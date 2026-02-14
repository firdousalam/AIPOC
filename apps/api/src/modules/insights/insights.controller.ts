import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('insights')
@ApiBearerAuth('access-token')
@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  @ApiOperation({ summary: 'Get aggregated sales insights' })
  @ApiResponse({ status: 200, description: 'Total sales, quantity, average sale, transaction count' })
  async getInsights() {
    return this.insightsService.getInsights();
  }
}

