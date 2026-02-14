import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ForecastService } from './forecast.service';
import { ForecastRequestDto } from './dto/forecast-request.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('forecast')
@ApiBearerAuth('access-token')
@Controller('forecast')
@UseGuards(JwtAuthGuard)
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  @Post()
  @ApiOperation({ summary: 'Get sales forecast for a product (calls ML service)' })
  @ApiBody({ type: ForecastRequestDto })
  @ApiResponse({ status: 200, description: 'Forecast with predictions and confidence intervals' })
  @ApiResponse({ status: 502, description: 'ML service unavailable' })
  async getForecast(@Body() forecastRequestDto: ForecastRequestDto) {
    return this.forecastService.getForecast(forecastRequestDto);
  }
}

