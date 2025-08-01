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
    .setTitle('Product Service API')
    .setDescription('Product microservice  integration')
    .setVersion('1.0')
    .addTag('products')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  // Set global prefix
  app.setGlobalPrefix('');

  // Start HTTP server
  const httpPort = process.env.PORT || 3001;
  await app.listen(httpPort);
  console.log(`🚀 Product Service HTTP server running on port ${httpPort}`);
  console.log(`📚 Swagger documentation: http://localhost:${httpPort}/docs`);

  // Start TCP microservice
  const tcpPort = 3002;
  const tcpApp = await NestFactory.createMicroservice(AppModule, {
    transport: require('@nestjs/microservices').Transport.TCP,
    options: {
      host: 'localhost',
      port: tcpPort,
    },
  });
  
  await tcpApp.listen();
  console.log(`🔌 Product Service TCP microservice running on port ${tcpPort}`);
}

bootstrap().catch(console.error); 