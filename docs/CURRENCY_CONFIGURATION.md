# Currency Configuration

## Overview
The application uses a centralized currency configuration system that allows easy switching between different currencies (USD, INR, EUR, etc.) by updating a single constant file.

## Current Configuration
- **Currency Symbol**: ₹ (Indian Rupee)
- **Currency Code**: INR
- **Locale**: en-IN (Indian English)

## Implementation

### Constants File
Location: `apps/web/src/utils/constants.ts`

```typescript
// Currency Configuration
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

// Format currency with symbol
export const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

// Format currency without decimals
export const formatCurrencyWhole = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`;
};
```

### Usage Examples

#### Import
```typescript
import { CURRENCY_SYMBOL, formatCurrency } from '@/utils/constants';
```

#### Display Formatted Currency
```typescript
// With formatting (recommended)
<div>{formatCurrency(1234.56)}</div>
// Output: ₹1,234.56

// Direct symbol usage
<div>{CURRENCY_SYMBOL}{price.toFixed(2)}</div>
// Output: ₹99.99
```

## Updated Pages

### 1. Sales Page (`apps/web/src/app/dashboard/sales/page.tsx`)
- Sale total amounts in table and cards
- Product prices in dropdown
- Item totals in form
- Grand total in modal

### 2. Products Page (`apps/web/src/app/dashboard/products/page.tsx`)
- Product prices in table (MRP, Sale Price, Price)
- Mobile card view prices
- Product details modal
- Export CSV data

### 3. Dashboard Page (`apps/web/src/app/dashboard/page.tsx`)
- Total revenue stat card

## Changing Currency

To change the currency symbol and formatting:

### Example: Switch to USD

```typescript
// apps/web/src/utils/constants.ts
export const CURRENCY_SYMBOL = '$';
export const CURRENCY_CODE = 'USD';

export const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};
```

### Example: Switch to EUR

```typescript
// apps/web/src/utils/constants.ts
export const CURRENCY_SYMBOL = '€';
export const CURRENCY_CODE = 'EUR';

export const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('de-DE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};
```

### Example: Switch to GBP

```typescript
// apps/web/src/utils/constants.ts
export const CURRENCY_SYMBOL = '£';
export const CURRENCY_CODE = 'GBP';

export const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-GB', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};
```

## Locale Formatting

Different locales format numbers differently:

| Locale | Format | Example |
|--------|--------|---------|
| en-IN (India) | ₹1,23,456.78 | Indian numbering system |
| en-US (USA) | $1,234.56 | Western numbering |
| de-DE (Germany) | 1.234,56 € | Period for thousands, comma for decimals |
| en-GB (UK) | £1,234.56 | Western numbering |

## Benefits

1. **Single Source of Truth**: Change currency in one place
2. **Consistency**: All currency displays use the same format
3. **Easy Maintenance**: No need to search and replace across files
4. **Internationalization Ready**: Easy to add multi-currency support
5. **Type Safety**: TypeScript ensures correct usage

## Future Enhancements

Potential improvements:

### 1. Multi-Currency Support
```typescript
export const CURRENCIES = {
  INR: { symbol: '₹', locale: 'en-IN' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const config = CURRENCIES[currency];
  return `${config.symbol}${amount.toLocaleString(config.locale, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};
```

### 2. Environment-Based Configuration
```typescript
// .env
NEXT_PUBLIC_CURRENCY_SYMBOL=₹
NEXT_PUBLIC_CURRENCY_CODE=INR
NEXT_PUBLIC_CURRENCY_LOCALE=en-IN

// constants.ts
export const CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
export const CURRENCY_CODE = process.env.NEXT_PUBLIC_CURRENCY_CODE || 'INR';
```

### 3. User Preference
Allow users to select their preferred currency in settings and store in localStorage or user profile.

### 4. Currency Conversion
Integrate with exchange rate API to convert between currencies in real-time.

## Testing

When changing currency configuration, verify:

1. ✅ Dashboard revenue display
2. ✅ Products listing (table and cards)
3. ✅ Product details modal
4. ✅ Sales listing (table and cards)
5. ✅ Sales form (product dropdown, item totals, grand total)
6. ✅ Export CSV files
7. ✅ Mobile responsive views

## Notes

- All monetary values in the database remain as numbers
- Currency symbol is only applied in the UI layer
- Formatting is consistent across desktop and mobile views
- Export functionality includes the currency symbol
