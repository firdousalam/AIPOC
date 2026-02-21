# Sales Default Values

## Overview
The sales system automatically applies default values for customer name and payment method when they are not provided during sale creation. This ensures data consistency and simplifies the sales recording process for cash transactions.

## Default Values

### Customer Name: "Cash"
- **Applied When**: 
  - No customer information is provided
  - All customer fields (name, email, mobile, PAN/Voter ID) are empty
- **Purpose**: 
  - Indicates anonymous cash sales
  - Distinguishes walk-in customers from registered customers
  - Simplifies quick sale entry
- **Database Field**: `customer.name`

### Payment Method: "Cash"
- **Applied When**: 
  - Payment method is not specified
  - Payment method field is empty or undefined
- **Purpose**: 
  - Most common payment method for retail sales
  - Default for walk-in customers
  - Reduces data entry time
- **Database Field**: `paymentMethod`

## Implementation

### Backend (API)

#### Schema Defaults
Location: `apps/api/src/modules/sales/sales.schema.ts`

```typescript
@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: CustomerInfo, default: () => ({ name: 'Cash' }) })
  customer: CustomerInfo;

  @Prop({ default: 'Cash' })
  paymentMethod: string;
}
```

#### Service Logic
Location: `apps/api/src/modules/sales/sales.service.ts`

```typescript
async create(createSaleDto: CreateSaleDto): Promise<Sale> {
  // Apply defaults if customer info is not provided or empty
  const saleData = {
    ...createSaleDto,
    customer: createSaleDto.customer && 
              Object.keys(createSaleDto.customer).some(key => createSaleDto.customer[key])
      ? createSaleDto.customer
      : { name: 'Cash' },
    paymentMethod: createSaleDto.paymentMethod || 'Cash',
  };

  const createdSale = new this.saleModel(saleData);
  return createdSale.save();
}
```

### Frontend

#### Form Initialization
Location: `apps/web/src/app/dashboard/sales/page.tsx`

```typescript
const [paymentMethod, setPaymentMethod] = useState('Cash');

const resetForm = () => {
  setSaleItems([{ productId: '', productName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  setCustomerInfo({});
  setSaleDate(new Date().toISOString().split('T')[0]);
  setPaymentMethod('Cash');  // Default to Cash
  setNotes('');
  setEditingSale(null);
};
```

## Use Cases

### 1. Quick Cash Sale
**Scenario**: Customer walks in, buys products, pays cash, and leaves

**Process**:
1. Select products and quantities
2. Leave customer fields empty
3. Payment method defaults to "Cash"
4. Submit sale

**Result**:
```json
{
  "items": [...],
  "totalAmount": 500,
  "customer": {
    "name": "Cash"
  },
  "paymentMethod": "Cash"
}
```

### 2. Registered Customer Sale
**Scenario**: Regular customer with stored information

**Process**:
1. Select products and quantities
2. Fill in customer details (name, email, mobile)
3. Select payment method (Credit Card, UPI, etc.)
4. Submit sale

**Result**:
```json
{
  "items": [...],
  "totalAmount": 1500,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890"
  },
  "paymentMethod": "Credit Card"
}
```

### 3. Partial Customer Info
**Scenario**: Customer provides only name

**Process**:
1. Select products and quantities
2. Enter only customer name
3. Leave other fields empty
4. Payment method defaults to "Cash"
5. Submit sale

**Result**:
```json
{
  "items": [...],
  "totalAmount": 750,
  "customer": {
    "name": "Jane Smith"
  },
  "paymentMethod": "Cash"
}
```

## Benefits

### 1. Data Consistency
- All sales have a customer name (either "Cash" or actual name)
- All sales have a payment method
- No null or undefined values in critical fields

### 2. Simplified Data Entry
- Quick sales don't require filling all fields
- Reduces time for cash transactions
- Fewer clicks for common scenarios

### 3. Better Reporting
- Easy to filter cash sales: `customer.name === "Cash"`
- Payment method always available for analytics
- Consistent data structure for queries

### 4. User Experience
- Form pre-filled with sensible defaults
- Less cognitive load for cashiers
- Faster checkout process

## Querying Sales

### Find All Cash Sales
```javascript
// MongoDB query
db.sales.find({ "customer.name": "Cash" })

// API query
GET /api/sales?search=Cash
```

### Find Sales by Payment Method
```javascript
// MongoDB query
db.sales.find({ "paymentMethod": "Cash" })

// API query
GET /api/sales?search=Cash
```

### Find Registered Customer Sales
```javascript
// MongoDB query
db.sales.find({ 
  "customer.name": { $ne: "Cash" },
  "customer.email": { $exists: true }
})
```

## Statistics

Based on generated sample data:
- ~20% of sales are cash sales (customer.name = "Cash")
- ~80% of sales have customer information
- ~90% of sales have payment method specified
- Cash is the most common payment method (~30-40%)

## Validation Rules

### Customer Name
- If any customer field has a value, customer name is preserved
- If all customer fields are empty, name defaults to "Cash"
- Empty string is treated as no value

### Payment Method
- If payment method is provided, it's used as-is
- If payment method is empty, null, or undefined, defaults to "Cash"
- Valid payment methods: Cash, Credit Card, Debit Card, UPI, Net Banking, Cheque

## Migration Notes

### Existing Sales
If you have existing sales without customer or payment method:

```javascript
// Update existing sales with defaults
db.sales.updateMany(
  { customer: { $exists: false } },
  { $set: { customer: { name: "Cash" } } }
);

db.sales.updateMany(
  { paymentMethod: { $exists: false } },
  { $set: { paymentMethod: "Cash" } }
);
```

### Backward Compatibility
The system handles both:
- Old sales without defaults
- New sales with defaults

Display logic checks for existence before rendering.

## Testing

### Test Cases

1. **Create sale without customer info**
   - Expected: customer.name = "Cash", paymentMethod = "Cash"

2. **Create sale with customer name only**
   - Expected: customer.name = provided name, paymentMethod = "Cash"

3. **Create sale with full customer info**
   - Expected: All customer fields preserved, paymentMethod = "Cash" if not provided

4. **Create sale with payment method**
   - Expected: customer.name = "Cash" if no customer info, paymentMethod = provided value

5. **Update sale removing customer info**
   - Expected: customer.name = "Cash", paymentMethod preserved or defaults to "Cash"

## Future Enhancements

Potential improvements:

1. **Configurable Defaults**
   - Allow admin to set default customer name
   - Allow admin to set default payment method
   - Store in settings collection

2. **Customer Templates**
   - Quick select from recent customers
   - Auto-fill customer info from history

3. **Payment Method Suggestions**
   - Suggest payment method based on amount
   - Remember last used payment method per customer

4. **Analytics Dashboard**
   - Cash vs. non-cash sales ratio
   - Payment method distribution
   - Customer acquisition trends
