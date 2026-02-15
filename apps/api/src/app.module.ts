import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ForecastModule } from './modules/forecast/forecast.module';
import { InsightsModule } from './modules/insights/insights.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-sales-ai',
    ),
    AuthModule,
    UsersModule,
    ProductsModule,
    SalesModule,
    InventoryModule,
    ForecastModule,
    InsightsModule,
    SettingsModule,
  ],
})
export class AppModule { }

