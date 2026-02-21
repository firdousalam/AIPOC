# Complete User Guide - Inventory & Sales Management System

## 📋 Project Overview

This is a comprehensive **Inventory & Sales Management System** designed for retail businesses, distributors, and wholesalers. It helps you track products, manage inventory, record sales, and gain business insights.

### Core Components

1. **Backend API** (NestJS + MongoDB) - Handles all business logic and data storage
2. **Frontend Web App** (Next.js + React) - User interface for managing operations
3. **ML Service** (Python + FastAPI) - AI-powered forecasting and insights

---

## 🎯 What Each Module Does

### 1. Products Module
**Purpose**: Master catalog of all items you sell

**What it tracks**:
- Product name, SKU, barcode
- Cost Price (what you pay to supplier)
- Sale Price (what you charge customers)
- MRP (Maximum Retail Price)
- Category, Company, Distributor
- Expiry date, manufacturing date
- Description

**Why it matters**: Products are the foundation. Everything else (sales, inventory) references products.

### 2. Sales Module
**Purpose**: Record every transaction with customers

**What it tracks**:
- Multiple products per sale with quantities
- Customer information (name, email, mobile, PAN/Voter ID)
- Payment method (Cash, Card, UPI, etc.)
- Total amount, sale date
- Notes/remarks

**Why it matters**: Sales data shows revenue, popular products, customer behavior, and business performance.

### 3. Inventory Module
**Purpose**: Track stock levels and prevent stockouts

**What it tracks**:
- Current quantity in stock
- Warehouse location
- Reorder level (when to restock)
- Last restocked date
- Stock status (In Stock, Low Stock, Out of Stock)

**Why it matters**: 
- Prevents overselling (selling items you don't have)
- Alerts when stock is low
- Tracks inventory value
- Auto-deducts stock when sales are made

### 4. Settings Module
**Purpose**: Configure master data

**Includes**:
- **Categories**: Product types (Electronics, Groceries, Clothing, etc.)
- **Companies**: Manufacturers/brands (Samsung, Nike, etc.)
- **Distributors**: Suppliers you buy from

---

## 📖 Step-by-Step Usage Guide

### Phase 1: Initial Setup (One-time)

#### Step 1: Configure Master Data
```
1. Go to Settings page
2. Add Categories (e.g., Electronics, Groceries, Clothing)
3. Add Companies (e.g., Samsung, LG, Sony)
4. Add Distributors (e.g., ABC Wholesale, XYZ Suppliers)
```

**Why first?** Products need to reference these.

#### Step 2: Add Products
```
1. Go to Products page
2. Click "Add Product"
3. Fill in details:
   - Name: "Samsung Galaxy S24"
   - SKU: "SAM-S24-128"
   - Barcode: "8801234567890"
   - Cost Price: ₹45,000 (what you paid)
   - Sale Price: ₹52,000 (what you charge)
   - MRP: ₹55,000
   - Category: Electronics
   - Company: Samsung
   - Distributor: ABC Wholesale
4. Save
```

**Repeat** for all products you sell.

#### Step 3: Initialize Inventory
```
1. Go to Inventory page
2. For each product, click "Add Inventory"
3. Fill in:
   - Product: Select from dropdown
   - Quantity: 100 (initial stock)
   - Location: "Warehouse A"
   - Reorder Level: 20 (alert when below this)
4. Save
```

**Result**: System now knows what's in stock.

---

### Phase 2: Daily Operations

#### Making a Sale (Most Common Task)

```
1. Go to Sales page
2. Click "Add Sale"
3. Add products:
   - Click "Add Product"
   - Select product from dropdown
   - Enter quantity (e.g., 2 units)
   - System shows: Unit Price, Total
   - Add more products if needed
4. Add customer info (optional):
   - Name: "Rajesh Kumar"
   - Email: "rajesh@example.com"
   - Mobile: "9876543210"
   - PAN/Voter ID: "ABCDE1234F"
5. Select payment method: Cash/Card/UPI/Net Banking
6. Add notes (optional): "Delivery by 5 PM"
7. Click "Create Sale"
```

**What happens automatically**:
- ✅ System checks if products are in stock
- ✅ Calculates total amount
- ✅ Deducts quantity from inventory
- ✅ Records sale with timestamp
- ✅ Updates dashboard statistics

**If stock is insufficient**: Error message shows "Insufficient stock for [Product]. Available: X, Requested: Y"

#### Restocking Inventory

```
1. Go to Inventory page
2. Find product with low stock (yellow badge)
3. Click Edit
4. Increase quantity: 50 → 150
5. Update "Last Restocked" date
6. Save
```

**When to restock**: 
- Low Stock alerts (yellow badge)
- Out of Stock alerts (red badge)
- Before high-demand periods

#### Viewing Reports

**Dashboard Overview**:
- Total revenue
- Total sales count
- Total products
- Low stock alerts
- Recent sales
- Top selling products

**Sales Reports**:
- Filter by date range
- Search by customer/product
- Export to Excel
- View payment method breakdown

**Inventory Reports**:
- Total inventory value
- Low stock items
- Out of stock items
- Stock by location

---

## 📊 Future Reports & Analytics

### Reports You Can Build

#### 1. Sales Analytics
```
- Daily/Weekly/Monthly revenue trends
- Sales by category
- Sales by payment method
- Customer purchase history
- Average order value
- Peak sales hours/days
```

#### 2. Inventory Analytics
```
- Stock turnover rate
- Slow-moving products
- Fast-moving products
- Inventory aging report
- Reorder recommendations
- Stock value by category
```

#### 3. Product Analytics
```
- Profit margin analysis (Sale Price - Cost Price)
- Product performance ranking
- Category-wise revenue
- Expiry tracking report
- Price comparison report
```

#### 4. Customer Analytics
```
- Top customers by revenue
- Customer purchase frequency
- Customer segmentation
- Payment preference analysis
- Customer lifetime value
```

#### 5. Financial Reports
```
- Profit & Loss statement
- Cash flow analysis
- Tax reports (GST ready)
- Expense tracking
- Vendor payment tracking
```

---

## 🚀 Industry-Ready Features to Add

### Immediate Enhancements

#### 1. Barcode Scanning
```
Use Case: Faster checkout
Implementation:
- Add barcode scanner integration
- Scan product barcode during sale
- Auto-populate product details
- Speed up billing process
```

#### 2. GST/Tax Management
```
Use Case: Tax compliance
Implementation:
- Add GST rates to products (5%, 12%, 18%, 28%)
- Calculate CGST, SGST, IGST
- Generate GST invoices
- GST return reports
```

#### 3. Purchase Orders
```
Use Case: Track orders to suppliers
Implementation:
- Create purchase orders
- Track order status (Pending, Received, Cancelled)
- Auto-update inventory on receipt
- Vendor payment tracking
```

#### 4. Multi-location Support
```
Use Case: Multiple stores/warehouses
Implementation:
- Separate inventory per location
- Transfer stock between locations
- Location-wise sales reports
- Centralized dashboard
```

#### 5. Discount & Promotions
```
Use Case: Marketing campaigns
Implementation:
- Percentage/fixed discounts
- Buy 1 Get 1 offers
- Bulk purchase discounts
- Coupon codes
- Loyalty points
```

### Advanced Features

#### 6. Automated Reordering
```
Use Case: Never run out of stock
Implementation:
- Set reorder points
- Auto-generate purchase orders
- Email alerts to suppliers
- Predictive reordering using ML
```

#### 7. Invoice Generation
```
Use Case: Professional billing
Implementation:
- PDF invoice generation
- Email invoices to customers
- Print receipts
- Invoice templates
- Tax calculations
```

#### 8. Supplier Management
```
Use Case: Better vendor relationships
Implementation:
- Supplier contact details
- Payment terms tracking
- Purchase history
- Supplier performance metrics
- Payment due alerts
```

#### 9. Employee Management
```
Use Case: Multi-user access
Implementation:
- User roles (Admin, Manager, Cashier)
- Permission-based access
- Sales by employee
- Commission tracking
- Attendance integration
```

#### 10. Mobile App
```
Use Case: On-the-go management
Implementation:
- React Native mobile app
- Barcode scanning
- Quick sales entry
- Inventory checks
- Push notifications
```

### AI/ML Features

#### 11. Demand Forecasting
```
Use Case: Predict future sales
Implementation:
- ML models (already in ml-service)
- Seasonal trend analysis
- Stock optimization
- Reduce overstock/understock
```

#### 12. Price Optimization
```
Use Case: Maximize profit
Implementation:
- Dynamic pricing suggestions
- Competitor price tracking
- Demand-based pricing
- Margin optimization
```

#### 13. Customer Insights
```
Use Case: Personalized marketing
Implementation:
- Purchase pattern analysis
- Product recommendations
- Churn prediction
- Targeted promotions
```

---

## 🏭 Industry-Specific Adaptations

### Retail Store
```
Focus: Fast checkout, inventory tracking
Add: Barcode scanning, POS integration, loyalty program
```

### Wholesale Business
```
Focus: Bulk orders, credit management
Add: Credit limits, payment terms, bulk pricing
```

### Pharmacy
```
Focus: Expiry tracking, prescription management
Add: Expiry alerts, batch tracking, prescription upload
```

### Restaurant
```
Focus: Menu management, table orders
Add: Table management, kitchen display, recipe costing
```

### E-commerce
```
Focus: Online orders, shipping
Add: Order management, shipping integration, returns
```

---

## 🔧 Technical Expansion Guide

### Adding a New Feature (Example: Discounts)

#### Step 1: Update Database Schema
```typescript
// apps/api/src/modules/sales/sales.schema.ts
discount: { type: Number, default: 0 },
discountType: { type: String, enum: ['percentage', 'fixed'] },
```

#### Step 2: Update API
```typescript
// apps/api/src/modules/sales/sales.service.ts
calculateTotal(items, discount, discountType) {
  let subtotal = items.reduce(...);
  if (discountType === 'percentage') {
    return subtotal - (subtotal * discount / 100);
  }
  return subtotal - discount;
}
```

#### Step 3: Update Frontend
```typescript
// apps/web/src/app/dashboard/sales/page.tsx
<input 
  type="number" 
  placeholder="Discount"
  onChange={(e) => setDiscount(e.target.value)}
/>
```

#### Step 4: Test
```
1. Add sale with discount
2. Verify calculation
3. Check invoice display
```

---

## 📈 Growth Roadmap

### Phase 1 (Current)
- ✅ Product management
- ✅ Sales tracking
- ✅ Inventory management
- ✅ Basic reports

### Phase 2 (Next 3 months)
- GST/Tax integration
- Invoice generation
- Barcode scanning
- Purchase orders

### Phase 3 (6 months)
- Multi-location support
- Employee management
- Advanced reports
- Mobile app

### Phase 4 (1 year)
- AI forecasting
- Price optimization
- CRM integration
- API for third-party integrations

---

## 💡 Best Practices

### Data Entry
1. Always add master data (categories, companies) first
2. Use consistent naming conventions
3. Keep SKUs unique and meaningful
4. Update inventory immediately after physical stock changes

### Daily Operations
1. Record sales in real-time
2. Check low stock alerts daily
3. Reconcile cash at end of day
4. Backup data regularly

### Reporting
1. Review dashboard weekly
2. Analyze slow-moving products monthly
3. Track profit margins
4. Monitor customer trends

### Maintenance
1. Archive old sales data yearly
2. Update product prices regularly
3. Clean up discontinued products
4. Review and optimize reorder levels

---

## 🆘 Common Scenarios

### Scenario 1: Product Out of Stock
```
Problem: Customer wants to buy but stock is 0
Solution:
1. Check inventory page
2. If stock available elsewhere, transfer
3. If not, create purchase order
4. Inform customer of expected date
```

### Scenario 2: Wrong Sale Entry
```
Problem: Entered wrong product/quantity
Solution:
1. Go to Sales page
2. Find the sale
3. Click Edit
4. Correct details or Delete if needed
5. Inventory auto-adjusts
```

### Scenario 3: Bulk Price Update
```
Problem: Need to update prices for 100 products
Solution:
1. Export products to Excel
2. Update prices in Excel
3. Use bulk import feature (to be added)
4. Or use API script for bulk update
```

---

## 📞 Support & Resources

### Documentation
- `/docs` folder contains all technical docs
- Each feature has dedicated documentation
- API documentation available

### Scripts
- `scripts/generate-sample-data.ts` - Generate test data
- `scripts/generate-inventory.ts` - Initialize inventory
- `scripts/generate-new-sales.ts` - Generate sales data

### Getting Help
1. Check documentation first
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check API logs for backend errors

---

## 🎓 Learning Path

### For Business Users
1. Start with Settings (master data)
2. Add 5-10 products
3. Practice making sales
4. Explore reports
5. Learn advanced features gradually

### For Developers
1. Understand project structure
2. Review existing modules
3. Study API patterns
4. Practice adding small features
5. Build industry-specific customizations

---

This system is designed to grow with your business. Start simple, master the basics, then add features as needed. The modular architecture makes it easy to extend and customize for any industry.
