import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true })
export class InventoryItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  reorderLevel: number;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);

