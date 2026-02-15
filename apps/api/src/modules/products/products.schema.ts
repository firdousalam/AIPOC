import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop()
  price?: number;

  @Prop()
  category?: string;

  @Prop({ default: 0 })
  stock?: number;

  @Prop()
  distributor?: string;

  @Prop()
  company?: string;

  @Prop()
  mrp?: number;

  @Prop()
  salePrice?: number;

  @Prop()
  discount?: number;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

