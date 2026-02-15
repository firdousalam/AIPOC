import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Company, CompanySchema } from './schemas/company.schema';
import { Distributor, DistributorSchema } from './schemas/distributor.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            { name: Company.name, schema: CompanySchema },
            { name: Distributor.name, schema: DistributorSchema },
        ]),
    ],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule { }
