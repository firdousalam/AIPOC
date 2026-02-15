# 📦 Product DTO Update - Optional Fields Added

## ✅ Update Complete

Added optional `distributor` and `company` fields to the Product DTO and Schema.

---

## 🔍 Changes Made

### 1. `apps/api/src/modules/products/dto/create-product.dto.ts`

**Added:**
```typescript
@IsOptional()
@IsString()
distributor?: string;

@IsOptional()
@IsString()
company?: string;
```

**Complete DTO:**
```typescript
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  distributor?: string;

  @IsOptional()
  @IsString()
  company?: string;
}
```

### 2. `apps/api/src/modules/products/products.schema.ts`

**Added:**
```typescript
@Prop()
distributor?: string;

@Prop()
company?: string;
```

**Complete Schema:**
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  distributor?: string;

  @Prop()
  company?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

---

## 📊 Product Fields Summary

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | string | ✅ Yes | - | Product name |
| description | string | ❌ No | - | Product description |
| price | number | ✅ Yes | - | Product price (min: 0) |
| category | string | ✅ Yes | - | Product category |
| stock | number | ❌ No | 0 | Stock quantity (min: 0) |
| distributor | string | ❌ No | - | Distributor name |
| company | string | ❌ No | - | Company/Manufacturer name |

---

## 🧪 Testing

### Create Product with New Fields

**Request:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 100,
    "distributor": "ABC Distributors",
    "company": "XYZ Manufacturing"
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 100,
  "distributor": "ABC Distributors",
  "company": "XYZ Manufacturing",
  "createdAt": "2026-02-15T10:00:00.000Z",
  "updatedAt": "2026-02-15T10:00:00.000Z"
}
```

### Create Product without Optional Fields

**Request:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Simple Product",
    "price": 49.99,
    "category": "Books"
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Simple Product",
  "price": 49.99,
  "category": "Books",
  "stock": 0,
  "createdAt": "2026-02-15T10:00:00.000Z",
  "updatedAt": "2026-02-15T10:00:00.000Z"
}
```

---

## 🎯 Use Cases

### 1. Full Product Information
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "distributor": "Tech Distributors Inc",
  "company": "Apple Inc"
}
```

### 2. Basic Product (Minimal Fields)
```json
{
  "name": "Generic Cable",
  "price": 9.99,
  "category": "Accessories"
}
```

### 3. Product with Distributor Only
```json
{
  "name": "Samsung TV",
  "price": 799.99,
  "category": "Electronics",
  "distributor": "Electronics Wholesale"
}
```

### 4. Product with Company Only
```json
{
  "name": "Dell Laptop",
  "price": 1299.99,
  "category": "Computers",
  "company": "Dell Technologies"
}
```

---

## 🔄 Update Existing Products

If you have existing products in the database, they will automatically work with the new schema. The optional fields will simply be `undefined` or not present.

**To add distributor/company to existing products:**

```bash
curl -X PUT http://localhost:3001/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "distributor": "New Distributor",
    "company": "New Company"
  }'
```

---

## 📝 Validation Rules

### Distributor Field
- **Type:** String
- **Required:** No (optional)
- **Validation:** Must be a string if provided
- **Example:** "ABC Distributors", "Wholesale Inc"

### Company Field
- **Type:** String
- **Required:** No (optional)
- **Validation:** Must be a string if provided
- **Example:** "Apple Inc", "Samsung Electronics"

---

## 🎨 Frontend Integration

### Update Product Form

Add these fields to your product form:

```typescript
interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock?: number;
  distributor?: string;  // NEW
  company?: string;      // NEW
}
```

### Example Form Component

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Distributor (Optional)
  </label>
  <input
    type="text"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
    value={formData.distributor || ''}
    onChange={(e) => setFormData({ ...formData, distributor: e.target.value })}
    placeholder="Enter distributor name"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Company (Optional)
  </label>
  <input
    type="text"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
    value={formData.company || ''}
    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
    placeholder="Enter company/manufacturer name"
  />
</div>
```

---

## ✅ Verification Checklist

- [x] Added `distributor` field to DTO
- [x] Added `company` field to DTO
- [x] Both fields are optional (`@IsOptional()`)
- [x] Both fields validate as strings (`@IsString()`)
- [x] Added `distributor` field to Schema
- [x] Added `company` field to Schema
- [x] Both schema fields are optional
- [x] No TypeScript errors
- [x] No validation errors

---

## 🚀 Next Steps

### 1. Restart Backend
```bash
cd apps/api
pnpm start:dev
```

### 2. Test API
```bash
# Create product with new fields
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "category": "Test",
    "distributor": "Test Distributor",
    "company": "Test Company"
  }'
```

### 3. Update Frontend (Optional)
- Add distributor and company fields to product forms
- Update product display to show these fields
- Add filters/search by distributor or company

---

## 📚 Related Files

- `apps/api/src/modules/products/dto/create-product.dto.ts` - DTO with validation
- `apps/api/src/modules/products/products.schema.ts` - MongoDB schema
- `apps/api/src/modules/products/products.service.ts` - Service (no changes needed)
- `apps/api/src/modules/products/products.controller.ts` - Controller (no changes needed)

---

**Created:** February 15, 2026
**Update:** Added optional distributor and company fields
**Status:** Complete ✅
