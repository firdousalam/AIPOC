# Sample Data Generation Script

This script generates realistic sample data for the past 4 months to enable forecasting and insights features.

## What Data is Generated

### 1. Categories (8 items)
- Electronics
- Clothing
- Food & Beverages
- Home & Garden
- Sports & Outdoors
- Books & Media
- Health & Beauty
- Toys & Games

### 2. Companies (5 items)
- TechCorp (Electronics)
- FashionHub (Clothing)
- FreshFoods Inc (Food)
- HomeStyle (Home & Garden)
- SportsPro (Sports)

### 3. Distributors (3 items)
- Global Logistics
- FastShip Co
- Regional Supply

### 4. Products (15 items)
Various products across different categories with:
- Auto-generated Product IDs (PROD-0001, PROD-0002, etc.)
- Realistic pricing (MRP, Sale Price, Discount)
- Stock levels (50-500 units)
- Creation dates spread over 4 months

### 5. Sales (~1,800-2,400 records)
- 10-20 sales per weekday
- 20-30 sales per weekend day
- Over 120 days (4 months)
- Random customers, payment methods
- Quantities: 1-5 units per sale
- All sales marked as "completed"

### 6. Inventory (15 records)
- One record per product
- Current stock levels
- Min/Max stock levels
- Last restocked dates
- Warehouse/Store locations

## How to Run

### Prerequisites
Make sure your MongoDB is running and the connection string is set in `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/sales-ai
```

### Run the Script

From the project root directory:

```bash
# Install dependencies first (if not already installed)
pnpm install

# Run the data generation script
pnpm generate-data
```

Or using npm:

```bash
npm run generate-data
```

### What Happens

1. **Connects to MongoDB** using the URI from `.env`
2. **Clears existing data** from all collections (Categories, Companies, Distributors, Products, Sales, Inventory)
3. **Generates new data** with dates spanning the past 4 months
4. **Displays summary** of generated records
5. **Disconnects** from MongoDB

## Data Characteristics

### Sales Patterns
- **Weekday sales**: 10-20 transactions per day
- **Weekend sales**: 20-30 transactions per day (higher volume)
- **Date range**: Past 4 months from current date
- **Total sales**: ~1,800-2,400 transactions

### Product Distribution
- Electronics: 3 products
- Clothing: 2 products
- Food & Beverages: 2 products
- Sports & Outdoors: 2 products
- Home & Garden: 2 products
- Health & Beauty: 2 products
- Toys & Games: 2 products

### Pricing Strategy
- All products have MRP (Maximum Retail Price)
- Sale prices are lower than MRP
- Discounts range from 20% to 33%

## Use Cases

This generated data enables:

1. **Sales Forecasting**
   - 4 months of historical sales data
   - Seasonal patterns (weekday vs weekend)
   - Product-wise sales trends

2. **Inventory Management**
   - Current stock levels
   - Min/Max thresholds
   - Restock patterns

3. **AI Insights**
   - Customer behavior analysis
   - Product performance metrics
   - Revenue trends
   - Popular products identification

4. **Dashboard Analytics**
   - Sales charts and graphs
   - Revenue reports
   - Inventory status
   - Product performance

## Warning

⚠️ **This script will DELETE all existing data** in the following collections:
- categories
- companies
- distributors
- products
- sales
- inventories

Make sure to backup any important data before running this script!

## Customization

You can modify the script to:
- Change the number of months (currently 4)
- Adjust sales volume per day
- Add more products, categories, or companies
- Modify pricing strategies
- Change stock levels

Edit `scripts/generate-sample-data.ts` to customize the data generation.
