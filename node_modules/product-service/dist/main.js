"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Product Service API')
        .setDescription('Product microservice  integration')
        .setVersion('1.0')
        .addTag('products')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/docs', app, document);
    app.setGlobalPrefix('');
    const httpPort = process.env.PORT || 3001;
    await app.listen(httpPort);
    console.log(`🚀 Product Service HTTP server running on port ${httpPort}`);
    console.log(`📚 Swagger documentation: http://localhost:${httpPort}/docs`);
    const tcpPort = 3002;
    const tcpApp = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
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
//# sourceMappingURL=main.js.map