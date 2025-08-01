import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/product-service?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2'),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {} 