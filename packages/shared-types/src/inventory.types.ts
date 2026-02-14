export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  reorderLevel: number;
  lastUpdated: Date;
}

export interface CreateInventoryDto {
  productId: string;
  productName: string;
  quantity: number;
  reorderLevel: number;
}

