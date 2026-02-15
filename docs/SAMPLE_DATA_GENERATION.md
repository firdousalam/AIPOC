# Sample Data Generation Guide

## Overview

A comprehensive data generation script has been created to populate your database with realistic sample data spanning the past 4 months. This data is essential for testing forecasting and AI insights features.

## Quick Start

```bash
# From project root
pnpm generate-data
```

## Generated Data Summary

| Collection | Count | Description |
|------------|-------|-------------|
| Categories | 8 | Product categories (Electronics, Clothing, etc.) |
| Companies | 5 | Manufacturers and brands |
| Distributors | 3 | Distribution partners |
| Products | 15 | Various products with pricing and stock |
| Sales | ~2,000 | 4 months of transaction history |
| Inventory | 15 | Current stock levels and locations |

## Data Characteristics

### Time Range
- **Start Date**: 4 months ago from current date
- **End Date**: Current date
- **Total Days**: ~120 days

### Sales Volume
- **Weekdays**: 10-20 sales per day
- **Weekends**: 20-30 sales per day (higher volume)
- **Total Sales**: Approximately 1,800-2,400 transactions

### Products
15 products across 8 categories:
- Wireless Headphones ($149.99)
- Smart Watch ($299.99)
- Laptop Stand ($49.99)
- Cotton T-Shirt ($19.99)
- Denim Jeans ($59.99)
- Running Shoes ($89.99)
- Yoga Mat ($29.99)
- Organic Coffee ($14.99)
- Green Tea ($9.99)
- Table Lamp ($39.99)
- Throw Pillow ($24.99)
- Face Cream ($34.99)
- Shampoo ($12.99)
- Board Game ($29.99)
- Puzzle Set ($19.99)

## Features Enabled

### 1. Sales Forecasting
With 4 months of historical data, you can:
- Predict future sales trends
- Identify seasonal patterns
- Forecast revenue
- Plan inventory needs

### 2. AI Insights
The data enables:
- Customer behavior analysis
- Product performance metrics
- Revenue trend analysis
- Popular products identification
- Sales pattern recognition

### 3. Dashboard Analytics
Visualize:
- Daily/weekly/monthly sales charts
- Revenue reports
- Inventory status
- Product performance comparisons
- Category-wise analysis

### 4. Inventory Management
Track:
- Current stock levels
- Low stock alerts (min threshold)
- Overstock warnings (max threshold)
- Restock patterns
- Location-based inventory

## Data Patterns

### Sales Patterns
- **Weekend Boost**: 50-100% more sales on weekends
- **Random Distribution**: Sales spread throughout each day
- **Varied Quantities**: 1-5 units per transaction
- **Multiple Payment Methods**: Credit card, debit card, PayPal, cash, bank transfer

### Product Pricing
- **MRP**: Maximum Retail Price
- **Sale Price**: Discounted price (20-33% off)
- **Realistic Margins**: Competitive pricing strategy

### Inventory Levels
- **Initial Stock**: 50-500 units per product
- **Min Level**: 10-30 units (reorder point)
- **Max Level**: 200-500 units (storage capacity)
- **Multiple Locations**: Warehouses and stores

## Script Details

### Location
```
scripts/generate-sample-data.ts
```

### Dependencies
- mongoose: MongoDB ODM
- dotenv: Environment variables
- TypeScript: Type safety

### Configuration
Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/sales-ai
```

## Important Notes

### ⚠️ Data Deletion Warning
The script **DELETES ALL EXISTING DATA** from:
- categories
- companies
- distributors
- products
- sales
- inventories

**Always backup important data before running!**

### Running Multiple Times
You can run the script multiple times to:
- Regenerate fresh data
- Test different scenarios
- Reset to clean state

Each run will:
1. Clear all existing data
2. Generate new data with current date as reference
3. Create 4 months of historical data

## Customization

### Modify Sales Volume
Edit `salesPerDay` variable:
```typescript
const salesPerDay = 15; // Change this value
```

### Change Time Range
Edit months calculation:
```typescript
fourMonthsAgo.setMonth(now.getMonth() - 4); // Change -4 to desired months
```

### Add More Products
Add to `products` array:
```typescript
const products = [
  // ... existing products
  { 
    name: 'New Product', 
    description: 'Description',
    category: 'Category',
    company: 'Company',
    price: 99.99,
    mrp: 129.99,
    discount: 23
  },
];
```

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running

### Permission Error
```
Error: EACCES: permission denied
```
**Solution**: Run with appropriate permissions or check file ownership

### Missing Dependencies
```
Error: Cannot find module 'mongoose'
```
**Solution**: Run `pnpm install` first

## Next Steps

After generating data:

1. **Verify Data**
   - Check MongoDB collections
   - Verify date ranges
   - Confirm sales counts

2. **Test Features**
   - View products in dashboard
   - Check sales reports
   - Test inventory management
   - Run forecasting

3. **Explore Insights**
   - Analyze sales trends
   - Identify top products
   - Review inventory levels
   - Generate reports

## Support

For issues or questions:
1. Check `scripts/README.md` for detailed documentation
2. Review the script code in `scripts/generate-sample-data.ts`
3. Verify MongoDB connection and credentials
4. Check console output for error messages
