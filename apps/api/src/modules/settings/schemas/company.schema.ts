import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
    @Prop({ required: true, unique: true, trim: true })
    name: string;

    @Prop({ trim: true })
    description?: string;

    @Prop({ trim: true })
    website?: string;

    @Prop({ trim: true })
    email?: string;

    @Prop({ trim: true })
    phone?: string;

    @Prop({ default: 'active', enum: ['active', 'inactive'] })
    status: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// Create index for unique name (case-insensitive)
CompanySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
