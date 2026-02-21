# Product Cost Price Update

## Overview
The product model has been updated to rename the "price" field to "costPrice" to better reflect that it represents the cost at which the product is purchased from distributors or companies, not the selling price.

## Field Naming Clarification

### Before
- **price**: Ambiguous - could mean cost or selling price

### After
- **costPrice**: Clear - the cost from distributor/company
- **salePrice**: The price at which product is sold to customers
- **mrp**: Maximum Retail Price (printed on product)

## Updated Fields

### Product Model

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| costPrice | number | Cost from distributor/company | ₹100.00 |
| salePrice | number | Selling price to customers | ₹150.00 |
| mrp | number | Maximum Retail Price | ₹200.00 |
| discount | number | Discount percentage | 25% |

### Pricing Hierarchy
```
MRP (₹200) > Sale Price (₹150) > Cost Price (₹100)
```

### Profit Calculation
```
Profit = Sale Price - Cost Price
Profit = ₹150 - ₹100 = ₹50
Profit Margin = (Profit / Sale Price) × 100
Profit Margin = (₹50 / ₹150) × 100 = 33.33%
```

## Changes Made

### 1. Backend (API)

#### Product Schema
Location: `apps/api/src/modules/products/products.schema.ts`

```typescript
// Before
@Prop()
price?: number;

// After
@Prop()
costPrice?: number;
```

#### Product DTO
Location: `apps/api/src/modules/products/dto/create-product.dto.ts`

```typescript
// Before
@IsOptional()
@IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.PRICE_INVALID })
@Min(VALIDATION_CONSTRAINTS.PRODUCT.PRICE_MIN, {
  message: VALIDATION_MESSAGES.PRODUCT.PRICE_MIN
})
price?: number;

// After
@IsOptional()
@IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.PRICE_INVALID })
@Min(VALIDATION_CONSTRAINTS.PRODUCT.PRICE_MIN, {
  message: VALIDATION_MESSAGES.PRODUCT.PRICE_MIN
})
costPrice?: number;
```

### 2. Frontend

#### Product Interface
Location: `apps/web/src/app/dashboard/products/page.tsx`

```typescript
// Before
interface Product {
  price?: number;
  // ... other fields
}

// After
interface Product {
  costPrice?: number;
  // ... other fields
}
```

#### Form Labels
- Changed "Price" to "Cost Price" in add/edit product forms
- Updated product details modal to show "Cost Price"
- Updated export CSV header from "Price" to "Cost Price"

#### Display Logic
```typescript
// Desktop table - fallback to costPrice if no salePrice
{product.salePrice ? (
  <div>{formatCurrency(product.salePrice)}</div>
) : product.costPrice ? (
  <div>{formatCurrency(product.costPrice)}</div>
) : (
  <span>N/A</span>
)}

// Mobile cards - same logic
{product.salePrice 
  ? formatCurrency(product.salePrice) 
  : product.costPrice 
    ? formatCurrency(product.costPrice) 
    : 'N/A'}
```

### 3. Sales Module

#### Product Interface in Sales
Location: `apps/web/src/app/dashboard/sales/page.tsx`

```typescript
// Before
interface Product {
  price: number;
}

// After
interface Product {
  costPrice: number;
}
```

#### Product Selection
```typescript
// When selecting product in sales form
unitPrice: product.costPrice,
totalPrice: product.costPrice * quantity
```

#### Product Dropdown Display
```typescript
// Shows cost price in dropdown
{product.name} - ₹{product.costPrice.toFixed(2)} (Stock: {product.stock})
```

## Migration Guide

### Database Migration

If you have existing products with "price" field, you need to migrate the data:

```javascript
// MongoDB migration script
db.products.updateMany(
  { price: { $exists: true } },
  { 
    $rename: { "price": "costPrice" }
  }
);

// Verify migration
db.products.find({ costPrice: { $exists: true } }).count();
db.products.find({ price: { $exists: true } }).count(); // Should be 0
```

### API Compatibility

The API now expects `costPrice` instead of `price`:

```json
// Before
{
  "name": "Product Name",
  "price": 100,
  "salePrice": 150,
  "mrp": 200
}

// After
{
  "name": "Product Name",
  "costPrice": 100,
  "salePrice": 150,
  "mrp": 200
}
```

## Use Cases

### 1. Adding New Product

**Scenario**: Adding a product purchased from distributor

**Form Fields**:
- Cost Price: ₹100 (what you paid to distributor)
- MRP: ₹200 (printed on product)
- Sale Price: ₹150 (what you sell to customer)
- Discount: 25% (calculated from MRP)

### 2. Recording Sale

**Scenario**: Customer buys product

**Process**:
1. Select product from dropdown (shows cost price)
2. System uses cost price as unit price
3. Calculate total: quantity × cost price
4. Customer pays sale price (if different from cost price)

**Note**: In sales, the unit price is initially set to cost price, but can be overridden to sale price or any other price based on business logic.

### 3. Profit Analysis

**Scenario**: Calculate profit margins

**Query**:
```javascript
// Find products with good profit margins
db.products.aggregate([
  {
    $project: {
      name: 1,
      costPrice: 1,
      salePrice: 1,
      profit: { $subtract: ["$salePrice", "$costPrice"] },
      profitMargin: {
        $multiply: [
          { $divide: [
            { $subtract: ["$salePrice", "$costPrice"] },
            "$salePrice"
          ]},
          100
        ]
      }
    }
  },
  { $match: { profitMargin: { $gte: 30 } } },
  { $sort: { profitMargin: -1 } }
]);
```

## Benefits

### 1. Clarity
- Clear distinction between cost and selling price
- Easier to understand for new team members
- Reduces confusion in business logic

### 2. Better Reporting
- Easy to calculate profit margins
- Clear cost analysis
- Better inventory valuation

### 3. Business Intelligence
- Track cost trends from suppliers
- Identify products with low margins
- Optimize pricing strategies

## Display Priority

When displaying product price to customers:

1. **Sale Price** (if available) - Primary display
2. **Cost Price** (if no sale price) - Fallback
3. **MRP** (if neither) - Last resort
4. **N/A** (if none) - No price available

## Validation Rules

### Cost Price
- Must be a positive number
- Should be less than or equal to sale price
- Should be less than or equal to MRP
- Minimum: 0
- Step: 0.01 (supports decimal values)

### Business Logic
```
costPrice ≤ salePrice ≤ mrp
```

## Future Enhancements

Potential improvements:

1. **Automatic Profit Calculation**
   - Display profit amount and margin in product list
   - Color-code products by profit margin

2. **Cost Price History**
   - Track cost price changes over time
   - Analyze supplier price trends

3. **Bulk Pricing**
   - Different cost prices for different quantities
   - Volume discounts from suppliers

4. **Multi-Currency Support**
   - Cost price in supplier's currency
   - Automatic conversion to local currency

5. **Supplier Management**
   - Link cost price to specific supplier
   - Compare prices across suppliers

## Testing Checklist

After migration, verify:

- ✅ Product creation with cost price
- ✅ Product editing updates cost price
- ✅ Product list displays cost price correctly
- ✅ Product details modal shows cost price
- ✅ Export CSV includes cost price column
- ✅ Sales form uses cost price for calculations
- ✅ Mobile responsive views show cost price
- ✅ Search and filters work with cost price
- ✅ Existing products migrated successfully
- ✅ API validation works for cost price

## Troubleshooting

### Issue: Products showing N/A for price
**Solution**: Ensure products have either costPrice or salePrice set

### Issue: Sales form not calculating correctly
**Solution**: Verify product has costPrice field populated

### Issue: Old API calls failing
**Solution**: Update API calls to use costPrice instead of price

### Issue: Export CSV missing cost price
**Solution**: Clear browser cache and refresh page
