import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DistributorDocument = Distributor & Document;

@Schema({ timestamps: true })
export class Distributor {
    @Prop({ required: true, unique: true, trim: true })
    name: string;

    @Prop({ trim: true })
    description?: string;

    @Prop({ trim: true })
    contactPerson?: string;

    @Prop({ trim: true })
    email?: string;

    @Prop({ trim: true })
    phone?: string;

    @Prop({ trim: true })
    address?: string;

    @Prop({ default: 'active', enum: ['active', 'inactive'] })
    status: string;
}

export const DistributorSchema = SchemaFactory.createForClass(Distributor);

// Create index for unique name (case-insensitive)
DistributorSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
