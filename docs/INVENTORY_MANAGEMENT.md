# Inventory Management System

## Overview
Complete inventory management system integrated with products and sales modules. Automatically tracks stock levels, validates availability during sales, and provides real-time inventory insights.

## Features

### 1. Stock Tracking
- Real-time quantity monitoring
- Product-level inventory records
- Location-based storage tracking
- Last restocked date tracking

### 2. Stock Validation
- Automatic stock check before sale creation
- Prevents overselling
- Real-time availability verification
- Multi-item validation in single transaction

### 3. Automatic Stock Updates
- **Sale Creation**: Deducts stock automatically
- **Sale Update**: Restores old stock, deducts new stock
- **Sale Deletion**: Restores stock to inventory

### 4. Low Stock Alerts
- Configurable reorder levels
- Visual indicators for low stock
- Out of stock warnings
- Filter by stock status

### 5. Inventory Insights
- Total inventory value calculation
- Low stock item count
- Out of stock item count
- Stock status overview

## Database Schema

### Inventory Item
```typescript
{
  productId: string,        // Unique, links to Product
  productName: string,      // Product name for quick reference
  quantity: number,         // Current stock quantity
  reorderLevel: number,     // Minimum stock threshold (default: 10)
  location?: string,        // Storage location
  lastRestocked?: Date,     // Last restock date
  status: 'active' | 'inactive',
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Get All Inventory
```
GET /api/inventory
```

Response:
```json
[
  {
    "_id": "inv123",
    "productId": "prod456",
    "productName": "Wireless Headphones",
    "quantity": 50,
    "reorderLevel": 10,
    "location": "Warehouse A",
    "status": "active"
  }
]
```

### Get Low Stock Items
```
GET /api/inventory/low-stock
```

Returns items where `quantity <= reorderLevel`

### Get Inventory by Product ID
```
GET /api/inventory/product/:productId
```

### Create Inventory Item
```
POST /api/inventory
```

Request Body:
```json
{
  "productId": "prod456",
  "productName": "Wireless Headphones",
  "quantity": 100,
  "reorderLevel": 10,
  "location": "Warehouse A"
}
```

### Update Inventory
```
PUT /api/inventory/:id
```

### Add Stock
```
PUT /api/inventory/:productId/add-stock
```

Request Body:
```json
{
  "quantity": 50
}
```

### Delete Inventory Item
```
DELETE /api/inventory/:id
```

## Sales Integration

### Stock Validation Flow

#### 1. Before Sale Creation
```typescript
// Check stock for all items
for (const item of saleItems) {
  const stockCheck = await inventoryService.checkStock(
    item.productId,
    item.quantity
  );
  
  if (!stockCheck.available) {
    throw new BadRequestException(
      `Insufficient stock for ${item.productName}. 
       Available: ${stockCheck.currentStock}, 
       Required: ${item.quantity}`
    );
  }
}
```

#### 2. Deduct Stock on Sale
```typescript
// Deduct stock for all items
for (const item of saleItems) {
  await inventoryService.deductStock(item.productId, item.quantity);
}
```

#### 3. Restore Stock on Sale Update
```typescript
// 1. Restore original stock
for (const item of originalSale.items) {
  await inventoryService.addStock(item.productId, item.quantity);
}

// 2. Validate new stock requirements
// 3. Deduct new stock amounts
```

#### 4. Restore Stock on Sale Deletion
```typescript
// Restore all stock
for (const item of sale.items) {
  await inventoryService.addStock(item.productId, item.quantity);
}
```

### Error Handling

**Insufficient Stock Error:**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for Wireless Headphones. Available: 5, Required: 10",
  "error": "Bad Request"
}
```

**Product Not in Inventory:**
```json
{
  "statusCode": 404,
  "message": "Inventory item for product prod456 not found",
  "error": "Not Found"
}
```

## Frontend Features

### Inventory Page (`/dashboard/inventory`)

#### Stats Dashboard
- **Total Items**: Count of all inventory items
- **Low Stock**: Items at or below reorder level
- **Out of Stock**: Items with zero quantity
- **Total Value**: Sum of (quantity × cost price) for all items

#### Filters
- **All**: Show all inventory items
- **Low Stock**: Show items needing reorder
- **In Stock**: Show items above reorder level

#### Table View (Desktop)
Columns:
- Product (name + ID)
- Quantity
- Reorder Level
- Status (badge with color coding)
- Location
- Actions (Edit, Delete)

#### Card View (Mobile)
Responsive cards showing:
- Product name and ID
- Status badge
- Quantity and reorder level
- Location
- Action buttons

#### Stock Status Indicators
- 🔴 **Out of Stock**: quantity = 0 (red badge)
- 🟡 **Low Stock**: quantity ≤ reorder level (yellow badge)
- 🟢 **In Stock**: quantity > reorder level (green badge)

### Add/Edit Inventory Modal

**Fields:**
- Product (dropdown, disabled when editing)
- Quantity (number input)
- Reorder Level (number input, default: 10)
- Location (text input, optional)

**Validation:**
- Product selection required
- Quantity must be ≥ 0
- Reorder level must be ≥ 0
- Duplicate products prevented (unique productId)

## Use Cases

### 1. Initial Stock Setup

**Scenario**: Adding products to inventory for the first time

**Steps:**
1. Navigate to Inventory page
2. Click "Add Inventory Item"
3. Select product from dropdown
4. Enter initial quantity
5. Set reorder level (default: 10)
6. Optionally add location
7. Click "Add"

**Result:**
```json
{
  "productId": "prod123",
  "productName": "Laptop",
  "quantity": 50,
  "reorderLevel": 10,
  "location": "Warehouse A"
}
```

### 2. Recording a Sale

**Scenario**: Customer buys 2 laptops

**Process:**
1. User creates sale with 2 laptops
2. System checks inventory: 50 available ✅
3. System deducts stock: 50 - 2 = 48
4. Sale recorded successfully
5. Inventory updated automatically

**Before Sale:**
```
Laptop: 50 units
```

**After Sale:**
```
Laptop: 48 units
```

### 3. Insufficient Stock Prevention

**Scenario**: Customer tries to buy 60 laptops (only 48 available)

**Process:**
1. User creates sale with 60 laptops
2. System checks inventory: 48 available ❌
3. System throws error: "Insufficient stock for Laptop. Available: 48, Required: 60"
4. Sale NOT created
5. Inventory unchanged

**Error Message:**
```
Insufficient stock for Laptop. Available: 48, Required: 60
```

### 4. Updating a Sale

**Scenario**: Customer changes order from 2 to 5 laptops

**Process:**
1. Original sale: 2 laptops (current stock: 48)
2. User updates sale to 5 laptops
3. System restores original stock: 48 + 2 = 50
4. System checks new requirement: 5 ≤ 50 ✅
5. System deducts new stock: 50 - 5 = 45
6. Sale updated successfully

**Stock Changes:**
```
Before update: 48 units
After restore: 50 units
After deduct: 45 units
```

### 5. Deleting a Sale

**Scenario**: Sale cancelled, need to restore stock

**Process:**
1. Sale has 5 laptops (current stock: 45)
2. User deletes sale
3. System restores stock: 45 + 5 = 50
4. Sale deleted successfully

**Stock Changes:**
```
Before delete: 45 units
After delete: 50 units
```

### 6. Low Stock Alert

**Scenario**: Stock falls below reorder level

**Indicators:**
- Reorder level: 10
- Current stock: 8
- Status: 🟡 Low Stock (yellow badge)
- Appears in "Low Stock" filter

**Action Required:**
Order more stock from supplier

### 7. Restocking

**Scenario**: Received 100 new laptops from supplier

**Steps:**
1. Navigate to Inventory page
2. Find laptop in list
3. Click "Edit"
4. Update quantity: 8 + 100 = 108
5. Update "Last Restocked" date (automatic)
6. Click "Update"

**Result:**
```
Quantity: 108 units
Status: 🟢 In Stock
Last Restocked: 2026-02-16
```

## Stock Status Logic

### Status Determination
```typescript
if (quantity === 0) {
  return 'Out of Stock' (red)
} else if (quantity <= reorderLevel) {
  return 'Low Stock' (yellow)
} else {
  return 'In Stock' (green)
}
```

### Examples
| Quantity | Reorder Level | Status |
|----------|---------------|--------|
| 0 | 10 | 🔴 Out of Stock |
| 5 | 10 | 🟡 Low Stock |
| 10 | 10 | 🟡 Low Stock |
| 11 | 10 | 🟢 In Stock |
| 50 | 10 | 🟢 In Stock |

## Inventory Value Calculation

```typescript
totalValue = Σ (quantity × costPrice)
```

**Example:**
```
Product A: 50 units × ₹100 = ₹5,000
Product B: 30 units × ₹200 = ₹6,000
Product C: 20 units × ₹150 = ₹3,000
-------------------------------------------
Total Inventory Value: ₹14,000
```

## Best Practices

### 1. Regular Stock Audits
- Verify physical stock matches system records
- Update discrepancies immediately
- Conduct monthly audits

### 2. Reorder Level Configuration
- Set based on sales velocity
- Consider lead time from supplier
- Adjust seasonally if needed

### 3. Location Management
- Use consistent naming convention
- Track multiple storage locations
- Organize by product category

### 4. Stock Monitoring
- Check low stock items daily
- Place orders before stock runs out
- Maintain safety stock levels

### 5. Integration Maintenance
- Ensure inventory syncs with products
- Verify stock deductions on sales
- Monitor for sync errors

## Troubleshooting

### Issue: Sale fails with "Insufficient stock" but inventory shows stock
**Solution**: 
- Refresh inventory page
- Check if another sale is in progress
- Verify product ID matches

### Issue: Stock not deducting after sale
**Solution**:
- Check if inventory item exists for product
- Verify inventory service is running
- Check API logs for errors

### Issue: Negative stock quantity
**Solution**:
- This should never happen (validation prevents it)
- If it occurs, manually correct the quantity
- Investigate the cause (possible race condition)

### Issue: Duplicate inventory items for same product
**Solution**:
- Delete duplicate entries
- Keep the one with correct quantity
- ProductId should be unique (enforced by schema)

## Future Enhancements

Potential improvements:

1. **Batch Operations**
   - Bulk stock updates
   - Import/export inventory data
   - Mass reorder level adjustments

2. **Stock Movement History**
   - Track all stock changes
   - Audit trail for compliance
   - Identify shrinkage/loss

3. **Automated Reordering**
   - Auto-generate purchase orders
   - Email alerts to suppliers
   - Integration with supplier systems

4. **Barcode/QR Code Support**
   - Scan products for quick updates
   - Mobile app for warehouse staff
   - Real-time stock counting

5. **Multi-Location Management**
   - Transfer stock between locations
   - Location-specific reorder levels
   - Warehouse-wise reporting

6. **Forecasting**
   - Predict stock requirements
   - Seasonal demand analysis
   - Optimal reorder quantities

7. **Expiry Date Tracking**
   - For perishable products
   - FIFO/LIFO management
   - Expiry alerts

## Testing Checklist

- ✅ Create inventory item
- ✅ Update inventory item
- ✅ Delete inventory item
- ✅ View all inventory
- ✅ Filter by stock status
- ✅ Create sale with sufficient stock
- ✅ Prevent sale with insufficient stock
- ✅ Update sale and verify stock changes
- ✅ Delete sale and verify stock restoration
- ✅ Low stock indicator works
- ✅ Out of stock indicator works
- ✅ Total value calculation correct
- ✅ Mobile responsive design
- ✅ Error messages display correctly
