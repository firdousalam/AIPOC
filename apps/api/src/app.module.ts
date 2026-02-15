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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb+srv://TechnophileFirdous:Zuni2058Feb@cluster0.hwth0kg.mongodb.net/?appName=Cluster0',
    ),
    AuthModule,
    UsersModule,
    ProductsModule,
    SalesModule,
    InventoryModule,
    ForecastModule,
    InsightsModule,
  ],
})
export class AppModule { }

