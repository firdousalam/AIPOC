export class ForecastResponseDto {
  productId: string;
  forecastDays: number;
  predictions: number[];
  confidenceIntervals: Array<{ lower: number; upper: number }>;
}

