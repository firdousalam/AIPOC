# Sales with Multiple Products Feature

## Overview
The sales module has been updated to support recording sales with multiple products in a single transaction, along with comprehensive customer information.

## Default Values

### Customer Name
- **Default**: "Cash"
- **When Applied**: When no customer information is provided or all customer fields are empty
- **Purpose**: Indicates cash sales without customer details

### Payment Method
- **Default**: "Cash"
- **When Applied**: When payment method is not specified
- **Purpose**: Most common payment method for walk-in customers

## Features

### 1. Multiple Products per Sale
- Add multiple products to a single sale transaction
- Each product can have different quantities
- Automatic calculation of item totals and grand total
- Dynamic add/remove product rows in the form

### 2. Customer Information
All customer fields are optional:
- **Name**: Customer's full name
- **Email**: Customer's email address
- **Mobile**: Customer's mobile number
- **PAN/Voter ID**: Customer's identification document number

### 3. Payment Methods
Supported payment methods:
- Cash
- Credit Card
- Debit Card
- UPI
- Net Banking
- Cheque

### 4. Additional Features
- Sale date selection
- Notes field for additional information
- Edit existing sales
- Delete sales
- Export to Excel with detailed item breakdown
- Search by product name, customer name, email, mobile, or payment method
- Date range filtering
- Server-side pagination

## Database Schema

### Sale Model
```typescript
{
  items: [
    {
      productId: string,
      productName: string,
      quantity: number,
      unitPrice: number,
      totalPrice: number
    }
  ],
  totalAmount: number,
  saleDate: Date,
  customer: {
    name?: string,
    email?: string,
    mobile?: string,
    panOrVoterId?: string
  },
  paymentMethod?: string,
  notes?: string,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Create Sale
```
POST /api/sales
```

Request Body:
```json
{
  "items": [
    {
      "productId": "product_id_1",
      "productName": "Product 1",
      "quantity": 2,
      "unitPrice": 100,
      "totalPrice": 200
    },
    {
      "productId": "product_id_2",
      "productName": "Product 2",
      "quantity": 1,
      "unitPrice": 50,
      "totalPrice": 50
    }
  ],
  "totalAmount": 250,
  "saleDate": "2024-01-15T00:00:00.000Z",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "panOrVoterId": "ABCDE1234F"
  },
  "paymentMethod": "Credit Card",
  "notes": "Bulk order discount applied"
}
```

### Update Sale
```
PUT /api/sales/:id
```

Request Body: Same as Create Sale

### Get All Sales (Paginated)
```
GET /api/sales?page=1&limit=20&search=laptop&startDate=2024-01-01&endDate=2024-01-31
```

Response:
```json
{
  "sales": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

### Get Single Sale
```
GET /api/sales/:id
```

### Delete Sale
```
DELETE /api/sales/:id
```

## Frontend Usage

### Recording a New Sale

1. Click "Record Sale" button
2. Select products from dropdown (shows price and stock)
3. Enter quantity for each product
4. Click "+ Add Product" to add more products
5. Fill in customer information (optional)
6. Select payment method
7. Add notes if needed
8. Click "Record Sale"

### Editing a Sale

1. Click "Edit" button on any sale row
2. Modify products, quantities, or customer information
3. Click "Update Sale"

### Searching Sales

- **Text Search**: Type in search box to filter by product name, customer name, email, mobile, or payment method (auto-updates with 500ms debounce)
- **Date Range**: Select start and end dates, then click "Search"
- **Clear Filters**: Click "Clear" to reset date filters

### Exporting Sales

Click "Export to Excel" to download a CSV file with detailed breakdown:
- Date
- Product name
- Quantity
- Unit price
- Item total
- Sale total
- Customer information
- Payment method

## Migration Notes

### Old Schema (Single Product)
```typescript
{
  productId: string,
  productName: string,
  quantity: number,
  price: number,
  totalAmount: number,
  saleDate: Date,
  customerId?: string,
  notes?: string
}
```

### New Schema (Multiple Products)
```typescript
{
  items: [{ productId, productName, quantity, unitPrice, totalPrice }],
  totalAmount: number,
  saleDate: Date,
  customer: { name, email, mobile, panOrVoterId },
  paymentMethod?: string,
  notes?: string
}
```

### Breaking Changes
- `productId`, `productName`, `quantity`, `price` moved to `items` array
- `customerId` replaced with `customer` object containing detailed information
- Added `paymentMethod` field
- `price` renamed to `unitPrice` in items
- Added `totalPrice` per item

### Backward Compatibility
The dashboard page handles both old and new sale structures for calculating revenue statistics.

## Validation Rules

### Sale Items
- At least one product must be selected
- Quantity must be >= 1
- Unit price must be >= 0
- Total price must be >= 0

### Customer Information
- Email must be valid email format (if provided)
- All fields are optional

### Sale Date
- Required field
- Must be a valid date

## UI Features

### Desktop View
- Table layout with all information visible
- Expandable product list for multi-product sales
- Inline edit and delete actions

### Mobile View
- Card-based layout
- Optimized for touch interactions
- Responsive buttons and forms

### Modal Form
- Scrollable for long product lists
- Real-time total calculation
- Validation feedback
- Responsive design

## Performance Considerations

1. **Product Loading**: Fetches up to 1000 products for dropdown (consider pagination if product count grows significantly)
2. **Server-side Pagination**: Only loads current page of sales (20/50/100 items)
3. **Debounced Search**: 500ms delay to reduce API calls
4. **Optimistic UI**: Form validation before API submission

## Future Enhancements

Potential improvements:
- Product search/autocomplete in dropdown
- Discount/tax calculations
- Invoice generation
- Customer management module
- Sales analytics and reports
- Inventory auto-deduction on sale
- Return/refund handling
