# Data Generation Scripts

This directory contains scripts for generating sample data for the Sales AI application.

## Available Scripts

### 1. Generate Sample Data (Old Schema)
```bash
npm run generate-data
# or
pnpm run generate-data
```

Generates initial sample data with the old single-product sales schema:
- 8 categories
- 5 companies
- 3 distributors
- 15 products
- ~2,157 sales (4 months of data)
- 15 inventory records

**Date Range**: Past 4 months from current date

### 2. Generate New Sales (Multi-Product Schema)
```bash
npm run generate-sales
# or
pnpm run generate-sales
```

Generates 1000 sales with the new multi-product schema:
- Multiple products per sale (1-5 products)
- Comprehensive customer information
- Payment methods
- Notes

**Date Range**: July 1, 2025 to February 16, 2026 (today)

## Prerequisites

1. MongoDB must be running
2. Environment variables must be configured in `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/sales-ai
   ```
3. Products must exist in the database (run `generate-data` first if starting fresh)

## Script Details

### generate-sample-data.ts
- Uses old sales schema (single product per sale)
- Creates base data: categories, companies, distributors, products
- Generates sales with realistic patterns (more on weekends)
- Creates inventory records

### generate-new-sales.ts
- Uses new sales schema (multiple products per sale)
- Requires existing products in database
- Generates realistic customer data:
  - 81.6% of sales have customer information
  - 70% have email addresses
  - 80% have mobile numbers
  - 50% have PAN/Voter ID
- 90% of sales have payment method specified
- 30% of sales have notes
- Average 2.98 items per sale

## Generated Data Statistics

### New Sales Script Output
```
Total Sales: 1000
Date Range: 7/1/2025 to 2/16/2026
Total Revenue: ~$964,827.83
Average Sale Amount: ~$964.83
Total Items Sold: ~2,981
Average Items per Sale: 2.98
Sales with Customer Info: 816 (81.6%)
Sales with Payment Method: 900 (90.0%)
```

## Customer Data Format

### Names
Indian names are used for realistic data:
- Rajesh Kumar, Priya Sharma, Amit Patel, etc.

### Phone Numbers
International format with various country codes:
- +91 (India)
- +1 (USA)
- +44 (UK)
- +61 (Australia)
- +65 (Singapore)

### Email Addresses
Generated from customer names with common domains:
- gmail.com
- yahoo.com
- outlook.com
- hotmail.com
- company.com

### PAN/Voter ID
- **PAN Format**: ABCDE1234F (5 letters + 4 digits + 1 letter)
- **Voter ID Format**: ABC1234567 (3 letters + 7 digits)

## Payment Methods
- Cash
- Credit Card
- Debit Card
- UPI
- Net Banking
- Cheque

## Notes Examples
- Regular customer
- Bulk order discount applied
- Express delivery requested
- Gift wrapping included
- Corporate order
- Repeat purchase
- Seasonal sale
- Loyalty program member
- First time customer
- Referral discount applied

## Running the Scripts

### First Time Setup
```bash
# 1. Generate base data (categories, companies, products, etc.)
npm run generate-data

# 2. Generate new sales with multi-product schema
npm run generate-sales
```

### Regenerate Sales Only
```bash
# This will clear existing sales and generate new ones
npm run generate-sales
```

## Troubleshooting

### "No products found" Error
Run `npm run generate-data` first to create products.

### MongoDB Connection Error
1. Ensure MongoDB is running
2. Check MONGODB_URI in `.env` file
3. Verify MongoDB is accessible at the specified URI

### Permission Errors
Run the command prompt or terminal as administrator (Windows) or use sudo (Linux/Mac).

## Technical Details

### Dependencies
- mongoose: MongoDB ODM
- dotenv: Environment variable management
- tsx: TypeScript execution (used instead of ts-node)

### Database Collections
- categories
- companies
- distributors
- products
- sales (updated schema)
- inventories

### Date Generation
Sales are distributed evenly across the date range with random times throughout each day.

## Future Enhancements

Potential improvements:
- Seasonal sales patterns (holidays, festivals)
- Product popularity trends
- Customer loyalty patterns
- Regional variations
- Bulk order discounts
- Return/refund records
- Inventory deduction on sales
