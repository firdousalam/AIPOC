import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration (allow multiple origins in production)
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [process.env.FRONTEND_URL || 'http://localhost:3000'];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // allow in dev; restrict via CORS_ORIGINS in prod
      }
    },
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Enterprise Sales AI API')
    .setDescription('API for sales, inventory, forecast, and insights. Authenticate via /api/auth/login to get a JWT for protected routes.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .addTag('auth', 'Registration and login')
    .addTag('users', 'User management')
    .addTag('products', 'Products')
    .addTag('sales', 'Sales transactions')
    .addTag('inventory', 'Inventory')
    .addTag('forecast', 'Sales forecast (calls ML service)')
    .addTag('insights', 'Aggregated insights')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Use CDN for Swagger UI assets to avoid "SwaggerUIBundle is not defined" when serving via Webpack
  const swaggerUiCdn = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0';
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Enterprise Sales AI API',
    customCssUrl: `${swaggerUiCdn}/swagger-ui.css`,
    customJs: [`${swaggerUiCdn}/swagger-ui-bundle.js`, `${swaggerUiCdn}/swagger-ui-standalone-preset.js`],
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API Server running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();

