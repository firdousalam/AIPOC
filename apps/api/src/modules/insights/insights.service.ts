import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';

@Injectable()
export class InsightsService {
  constructor(private readonly salesService: SalesService) {}

  async getInsights() {
    const sales = await this.salesService.findAll();
    
    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averageSale = sales.length > 0 ? totalSales / sales.length : 0;

    return {
      totalSales,
      totalQuantity,
      averageSale,
      totalTransactions: sales.length,
    };
  }
}

