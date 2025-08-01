import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home',
  SPORTS = 'sports',
  FOOD = 'food',
  BEAUTY = 'beauty',
  AUTOMOTIVE = 'automotive'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
  OUT_OF_STOCK = 'out_of_stock'
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, minlength: 3, maxlength: 100 })
  name: string;

  @Prop({ required: true, minlength: 10, maxlength: 1000 })
  description: string;

  @Prop({ required: true, min: 0.01, max: 999999.99 })
  price: number;

  @Prop({ required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  brand: string;

  @Prop({ required: true, unique: true, minlength: 5, maxlength: 50 })
  sku: string;

  @Prop({ required: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Prop({ required: true, min: 0.1, max: 100000 })
  weightInGrams: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object, default: {} })
  specifications: Record<string, string>;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop()
  releaseDate: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: 'system' })
  createdBy: string;

  @Prop({ default: 'system' })
  updatedBy: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ createdAt: 1 });
ProductSchema.index({ sku: 1 }, { unique: true }); 