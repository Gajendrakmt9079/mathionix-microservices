import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create HTTP application
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
    .setTitle('Product Service API')
    .setDescription('Product microservice with MongoDB integration')
    .setVersion('1.0')
    .addTag('products')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Set global prefix
  app.setGlobalPrefix('');

  // Start HTTP server
  const httpPort = process.env.PORT || 3001;
  await app.listen(httpPort);
  console.log(`🚀 Product Service HTTP server running on port ${httpPort}`);
  console.log(`📚 Swagger documentation: http://localhost:${httpPort}/docs`);

  // Create TCP microservice
  const tcpApp = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    },
  });
  
  await tcpApp.listen();
  console.log(`🔌 Product Service TCP microservice running on port 3002`);
}

bootstrap().catch(console.error); 