"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.Product = exports.ProductStatus = exports.ProductCategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["ELECTRONICS"] = "electronics";
    ProductCategory["CLOTHING"] = "clothing";
    ProductCategory["BOOKS"] = "books";
    ProductCategory["HOME"] = "home";
    ProductCategory["SPORTS"] = "sports";
    ProductCategory["FOOD"] = "food";
    ProductCategory["BEAUTY"] = "beauty";
    ProductCategory["AUTOMOTIVE"] = "automotive";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["INACTIVE"] = "inactive";
    ProductStatus["DISCONTINUED"] = "discontinued";
    ProductStatus["OUT_OF_STOCK"] = "out_of_stock";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
let Product = class Product extends mongoose_2.Document {
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 3, maxlength: 100 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 10, maxlength: 1000 }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0.01, max: 999999.99 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ProductCategory }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 2, maxlength: 50 }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, minlength: 5, maxlength: 50 }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ProductStatus, default: ProductStatus.ACTIVE }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0.1, max: 100000 }),
    __metadata("design:type", Number)
], Product.prototype, "weightInGrams", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Product.prototype, "specifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Product.prototype, "releaseDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'system' }),
    __metadata("design:type", String)
], Product.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'system' }),
    __metadata("design:type", String)
], Product.prototype, "updatedBy", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
exports.ProductSchema.index({ name: 'text', description: 'text' });
exports.ProductSchema.index({ category: 1 });
exports.ProductSchema.index({ brand: 1 });
exports.ProductSchema.index({ status: 1 });
exports.ProductSchema.index({ price: 1 });
exports.ProductSchema.index({ isFeatured: 1 });
exports.ProductSchema.index({ createdAt: 1 });
exports.ProductSchema.index({ sku: 1 }, { unique: true });
//# sourceMappingURL=product.schema.js.map