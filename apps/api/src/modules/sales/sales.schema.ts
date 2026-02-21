import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SaleDocument = Sale & Document;

export class SaleItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalPrice: number;
}

export class CustomerInfo {
  @Prop()
  name?: string;

  @Prop()
  email?: string;

  @Prop()
  mobile?: string;

  @Prop()
  panOrVoterId?: string;
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: [SaleItem], required: true })
  items: SaleItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  saleDate: Date;

  @Prop({ type: CustomerInfo, default: () => ({ name: 'Cash' }) })
  customer: CustomerInfo;

  @Prop({ default: 'Cash' })
  paymentMethod: string;

  @Prop()
  notes?: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

