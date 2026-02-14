export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  saleDate: Date;
  customerId?: string;
  notes?: string;
}

export interface CreateSaleDto {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  saleDate: Date;
  customerId?: string;
  notes?: string;
}

