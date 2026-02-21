import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';

@Injectable()
export class InsightsService {
  constructor(private readonly salesService: SalesService) { }

  async getInsights() {
    // Get all sales with a high limit for insights calculation
    const response = await this.salesService.findAll(undefined, undefined, undefined, 1, 10000);
    const sales = response.sales;

    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    // Calculate total quantity from all items in all sales
    const totalQuantity = sales.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
    const averageSale = sales.length > 0 ? totalSales / sales.length : 0;

    return {
      totalSales,
      totalQuantity,
      averageSale,
      totalTransactions: sales.length,
    };
  }
}

