export interface Forecast {
  productId: string;
  productName: string;
  predictions: number[];
  dates: Date[];
  confidenceIntervals: {
    lower: number;
    upper: number;
  }[];
}

export interface ForecastRequest {
  productId: string;
  forecastDays?: number;
}

export interface ForecastResponse {
  productId: string;
  forecastDays: number;
  predictions: number[];
  confidenceIntervals: Array<{ lower: number; upper: number }>;
}

