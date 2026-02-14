import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class ForecastRequestDto {
  @ApiProperty({ description: 'Product ID to forecast' })
  @IsString()
  productId: string;

  @ApiPropertyOptional({ description: 'Number of days to forecast', minimum: 1, maximum: 365, default: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  forecastDays?: number;
}

