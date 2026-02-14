import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class ForecastRequestDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  forecastDays?: number;
}

