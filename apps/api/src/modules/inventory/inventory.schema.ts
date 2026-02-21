import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true })
export class InventoryItem {
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ required: true, default: 10 })
  reorderLevel: number;

  @Prop()
  location?: string;

  @Prop({ default: Date.now })
  lastRestocked?: Date;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);

