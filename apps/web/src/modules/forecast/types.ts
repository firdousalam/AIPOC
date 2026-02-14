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

