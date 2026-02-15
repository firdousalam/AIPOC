# 📦 Products API - Complete Update

## ✅ Updates Complete

Added proper validation, new optional fields (mrp, salePrice, discount), and full CRUD operations to the Products API.

---

## 🔍 Changes Made

### 1. DTO Updates (`create-product.dto.ts`)

**All fields are now optional:**

```typescript
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;

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

  @IsOptional()
  @IsNumber()
  @Min(0)
  mrp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;
}
```

### 2. Schema Updates (`products.schema.ts`)

**All fields are optional:**

```typescript
@Schema({ timestamps: true })
export class Product {
  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop()
  price?: number;

  @Prop()
  category?: string;

  @Prop({ default: 0 })
  stock?: number;

  @Prop()
  distributor?: string;

  @Prop()
  company?: string;

  @Prop()
  mrp?: number;

  @Prop()
  salePrice?: number;

  @Prop()
  discount?: number;
}
```

### 3. Controller Updates (`products.controller.ts`)

**Added:**
- ✅ Validation pipe with whitelist and transform
- ✅ PUT endpoint for updating products
- ✅ DELETE endpoint for deleting products
- ✅ Comprehensive API documentation
- ✅ Proper HTTP status codes
- ✅ Error responses

```typescript
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true 
}))
```

### 4. Service Updates (`products.service.ts`)

**Added:**
- ✅ `update()` method with NotFoundException
- ✅ `remove()` method with NotFoundException
- ✅ Proper error handling in `findOne()`

---

## 📊 Complete Product Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | ❌ No | - | Product name |
| description | string | ❌ No | - | Product description |
| price | number | ❌ No | Min: 0 | Product price |
| category | string | ❌ No | - | Product category |
| stock | number | ❌ No | Min: 0 | Stock quantity |
| distributor | string | ❌ No | - | Distributor name |
| company | string | ❌ No | - | Company/Manufacturer |
| **mrp** | number | ❌ No | Min: 0 | Maximum Retail Price |
| **salePrice** | number | ❌ No | Min: 0 | Sale/Discounted Price |
| **discount** | number | ❌ No | Min: 0, Max: 100 | Discount percentage |

---

## 🎯 API Endpoints

### 1. Create Product
```
POST /api/products
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "distributor": "Tech Distributors Inc",
  "company": "Apple Inc",
  "mrp": 1099.99,
  "salePrice": 999.99,
  "discount": 9.09
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "distributor": "Tech Distributors Inc",
  "company": "Apple Inc",
  "mrp": 1099.99,
  "salePrice": 999.99,
  "discount": 9.09,
  "createdAt": "2026-02-15T10:00:00.000Z",
  "updatedAt": "2026-02-15T10:00:00.000Z"
}
```

### 2. Get All Products
```
GET /api/products
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "mrp": 1099.99,
    "salePrice": 999.99,
    "discount": 9.09,
    "createdAt": "2026-02-15T10:00:00.000Z",
    "updatedAt": "2026-02-15T10:00:00.000Z"
  }
]
```

### 3. Get Product by ID
```
GET /api/products/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "iPhone 15 Pro",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "mrp": 1099.99,
  "salePrice": 999.99,
  "discount": 9.09,
  "createdAt": "2026-02-15T10:00:00.000Z",
  "updatedAt": "2026-02-15T10:00:00.000Z"
}
```

**Response (404):**
```json
{
  "statusCode": 404,
  "message": "Product with ID 507f1f77bcf86cd799439011 not found",
  "error": "Not Found"
}
```

### 4. Update Product
```
PUT /api/products/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "price": 899.99,
  "salePrice": 899.99,
  "discount": 18.18
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "iPhone 15 Pro",
  "price": 899.99,
  "category": "Electronics",
  "stock": 50,
  "mrp": 1099.99,
  "salePrice": 899.99,
  "discount": 18.18,
  "createdAt": "2026-02-15T10:00:00.000Z",
  "updatedAt": "2026-02-15T10:30:00.000Z"
}
```

### 5. Delete Product
```
DELETE /api/products/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

**Response (404):**
```json
{
  "statusCode": 404,
  "message": "Product with ID 507f1f77bcf86cd799439011 not found",
  "error": "Not Found"
}
```

---

## 🧪 Testing Examples

### Example 1: Full Product with All Fields

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Galaxy S24",
    "description": "Latest Samsung flagship",
    "price": 799.99,
    "category": "Electronics",
    "stock": 100,
    "distributor": "Samsung Distributors",
    "company": "Samsung Electronics",
    "mrp": 899.99,
    "salePrice": 799.99,
    "discount": 11.11
  }'
```

### Example 2: Minimal Product

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Generic Cable",
    "price": 9.99
  }'
```

### Example 3: Product with Pricing Details

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "category": "Computers",
    "mrp": 1299.99,
    "salePrice": 999.99,
    "discount": 23.08
  }'
```

### Example 4: Update Product

```bash
curl -X PUT http://localhost:3001/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 75,
    "salePrice": 749.99,
    "discount": 30
  }'
```

### Example 5: Delete Product

```bash
curl -X DELETE http://localhost:3001/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ✅ Validation Rules

### String Fields
- **name, description, category, distributor, company**
- Must be strings if provided
- Optional

### Number Fields (Price-related)
- **price, mrp, salePrice**
- Must be numbers if provided
- Minimum value: 0
- Optional

### Stock
- **stock**
- Must be a number if provided
- Minimum value: 0
- Default: 0
- Optional

### Discount
- **discount**
- Must be a number if provided
- Minimum value: 0
- Maximum value: 100 (percentage)
- Optional

### Validation Pipe Settings
```typescript
{
  whitelist: true,           // Strip properties not in DTO
  forbidNonWhitelisted: true, // Throw error for unknown properties
  transform: true             // Auto-transform to DTO types
}
```

---

## 🎨 Frontend Integration

### TypeScript Interface

```typescript
interface Product {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  distributor?: string;
  company?: string;
  mrp?: number;
  salePrice?: number;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Create Product Function

```typescript
async function createProduct(productData: Product) {
  const response = await apiClient.post('/api/products', productData);
  return response.data;
}
```

### Update Product Function

```typescript
async function updateProduct(id: string, productData: Partial<Product>) {
  const response = await apiClient.put(`/api/products/${id}`, productData);
  return response.data;
}
```

### Delete Product Function

```typescript
async function deleteProduct(id: string) {
  const response = await apiClient.delete(`/api/products/${id}`);
  return response.data;
}
```

---

## 💡 Use Cases

### Use Case 1: E-commerce Product with Discount

```json
{
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones",
  "category": "Audio",
  "company": "Sony",
  "mrp": 299.99,
  "salePrice": 199.99,
  "discount": 33.33,
  "stock": 50
}
```

**Display:**
- ~~$299.99~~ $199.99 (33% OFF)

### Use Case 2: Wholesale Product

```json
{
  "name": "Bulk USB Cables",
  "category": "Accessories",
  "distributor": "Wholesale Electronics",
  "price": 2.50,
  "stock": 1000
}
```

### Use Case 3: Retail Product with Full Details

```json
{
  "name": "Smart Watch",
  "description": "Fitness tracking smartwatch",
  "category": "Wearables",
  "company": "Apple",
  "distributor": "Tech Distributors",
  "mrp": 399.99,
  "salePrice": 349.99,
  "price": 349.99,
  "discount": 12.5,
  "stock": 25
}
```

---

## 🔧 Error Handling

### Validation Errors (400)

**Request:**
```json
{
  "name": "Product",
  "price": -10,
  "discount": 150
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "price must not be less than 0",
    "discount must not be greater than 100"
  ],
  "error": "Bad Request"
}
```

### Unknown Properties (400)

**Request:**
```json
{
  "name": "Product",
  "unknownField": "value"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "property unknownField should not exist"
  ],
  "error": "Bad Request"
}
```

### Not Found (404)

**Response:**
```json
{
  "statusCode": 404,
  "message": "Product with ID 507f1f77bcf86cd799439011 not found",
  "error": "Not Found"
}
```

### Unauthorized (401)

**Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 📚 Files Updated

1. ✅ `apps/api/src/modules/products/dto/create-product.dto.ts`
   - Added mrp, salePrice, discount fields
   - Made all fields optional
   - Added proper validation decorators

2. ✅ `apps/api/src/modules/products/products.schema.ts`
   - Added mrp, salePrice, discount fields
   - Made all fields optional

3. ✅ `apps/api/src/modules/products/products.controller.ts`
   - Added ValidationPipe with whitelist
   - Added PUT endpoint
   - Added DELETE endpoint
   - Added comprehensive API documentation
   - Added proper HTTP status codes

4. ✅ `apps/api/src/modules/products/products.service.ts`
   - Added update() method
   - Added remove() method
   - Added NotFoundException handling

---

## 🚀 Next Steps

### 1. Restart Backend
```bash
cd apps/api
pnpm start:dev
```

### 2. Test API Endpoints
```bash
# Create product
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"mrp":129.99,"discount":23}'

# Get all products
curl http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update product
curl -X PUT http://localhost:3001/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":79.99}'

# Delete product
curl -X DELETE http://localhost:3001/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Update Frontend (Optional)
- Add mrp, salePrice, discount fields to product forms
- Update product display to show pricing details
- Add discount badges/labels
- Show original price with strikethrough

---

## ✅ Verification Checklist

- [x] All fields are optional
- [x] Added mrp, salePrice, discount fields
- [x] Validation pipe configured
- [x] PUT endpoint added
- [x] DELETE endpoint added
- [x] Service methods added (update, remove)
- [x] NotFoundException handling
- [x] API documentation complete
- [x] No TypeScript errors
- [x] No validation errors

---

**Created:** February 15, 2026
**Update:** Complete Products API with validation and new fields
**Status:** Complete ✅
