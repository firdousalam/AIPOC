import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ForecastRequestDto } from './dto/forecast-request.dto';

@Injectable()
export class ForecastService {
  constructor(private readonly httpService: HttpService) {}

  async getForecast(forecastRequestDto: ForecastRequestDto) {
    const mlServiceUrl =
      process.env.ML_SERVICE_URL || 'http://localhost:8000';
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${mlServiceUrl}/api/v1/predictions/forecast`,
          forecastRequestDto,
        ),
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`ML Service error: ${message}`);
    }
  }
}

