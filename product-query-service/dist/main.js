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
        .setTitle('Product Query Service API')
        .setDescription('Product Query microservice  integration')
        .setVersion('1.0')
        .addTag('products')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/docs', app, document);
    app.setGlobalPrefix('');
    const port = process.env.PORT || 3003;
    await app.listen(port);
    console.log(`🚀 Product Query Service running on port ${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap().catch(console.error);
//# sourceMappingURL=main.js.map