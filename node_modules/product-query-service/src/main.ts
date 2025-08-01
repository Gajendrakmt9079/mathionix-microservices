import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Product Query Service API')
    .setDescription('Product Query microservice  integration')
    .setVersion('1.0')
    .addTag('products')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  // Set global prefix
  app.setGlobalPrefix('');

  // Start HTTP server
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`🚀 Product Query Service running on port ${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap().catch(console.error); 