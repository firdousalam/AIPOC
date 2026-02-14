import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  saleDate: Date;

  @Prop()
  customerId?: string;

  @Prop()
  notes?: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

