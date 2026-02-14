import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { ForecastRequestDto } from './dto/forecast-request.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('forecast')
@UseGuards(JwtAuthGuard)
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  @Post()
  async getForecast(@Body() forecastRequestDto: ForecastRequestDto) {
    return this.forecastService.getForecast(forecastRequestDto);
  }
}

