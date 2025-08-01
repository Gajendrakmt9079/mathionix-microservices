import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductQueryController } from './controllers/product-query.controller';
import { ProductQueryService } from './services/product-query.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/product-query-service?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2'),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductQueryController],
  providers: [ProductQueryService],
})
export class AppModule {} 