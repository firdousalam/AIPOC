# 📋 Constants Implementation Guide

## ✅ Implementation Complete

Created a centralized constants file for all validation messages, error messages, and application constants.

---

## 📁 File Structure

```
apps/api/src/
└── utils/
    └── constants.ts  # Centralized constants file
```

---

## 🔍 What's Included

### 1. Validation Messages (`VALIDATION_MESSAGES`)

Organized by category:
- **COMMON** - Generic validation messages
- **USER** - User-specific validation
- **PRODUCT** - Product-specific validation
- **SALE** - Sales validation
- **INVENTORY** - Inventory validation
- **AUTH** - Authentication validation

**Example Usage:**
```typescript
import { VALIDATION_MESSAGES } from '../../utils/constants';

@IsString({ message: VALIDATION_MESSAGES.PRODUCT.NAME_INVALID })
name?: string;
```

### 2. Error Messages (`ERROR_MESSAGES`)

Organized by category:
- **COMMON** - Generic errors
- **USER** - User-related errors
- **PRODUCT** - Product-related errors
- **SALE** - Sales errors
- **INVENTORY** - Inventory errors
- **AUTH** - Authentication errors
- **FORECAST** - ML forecast errors
- **INSIGHTS** - AI insights errors

**Example Usage:**
```typescript
import { ERROR_MESSAGES } from '../../utils/constants';

throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(id));
```

### 3. Success Messages (`SUCCESS_MESSAGES`)

Organized by category:
- **COMMON** - Generic success messages
- **USER** - User operation success
- **PRODUCT** - Product operation success
- **SALE** - Sales operation success
- **INVENTORY** - Inventory operation success
- **AUTH** - Authentication success

**Example Usage:**
```typescript
import { SUCCESS_MESSAGES } from '../../utils/constants';

return { message: SUCCESS_MESSAGES.PRODUCT.DELETED };
```

### 4. HTTP Status Codes (`HTTP_STATUS`)

Standard HTTP status codes:
```typescript
HTTP_STATUS.OK                    // 200
HTTP_STATUS.CREATED               // 201
HTTP_STATUS.BAD_REQUEST           // 400
HTTP_STATUS.UNAUTHORIZED          // 401
HTTP_STATUS.FORBIDDEN             // 403
HTTP_STATUS.NOT_FOUND             // 404
HTTP_STATUS.INTERNAL_SERVER_ERROR // 500
```

### 5. Validation Constraints (`VALIDATION_CONSTRAINTS`)

Numeric constraints for validation:
- **USER** - Name length, password length, email length
- **PRODUCT** - Name length, price range, stock range, discount range
- **SALE** - Quantity range, amount range
- **INVENTORY** - Quantity range

**Example Usage:**
```typescript
import { VALIDATION_CONSTRAINTS } from '../../utils/constants';

@Min(VALIDATION_CONSTRAINTS.PRODUCT.PRICE_MIN)
price?: number;
```

### 6. User Types (`USER_TYPES`)

```typescript
USER_TYPES.SUPER  // 'super'
USER_TYPES.ADMIN  // 'admin'
USER_TYPES.USER   // 'user'
```

### 7. Product Categories (`PRODUCT_CATEGORIES`)

Predefined product categories:
```typescript
PRODUCT_CATEGORIES.ELECTRONICS
PRODUCT_CATEGORIES.CLOTHING
PRODUCT_CATEGORIES.FOOD
// ... and more
```

### 8. Pagination (`PAGINATION`)

Default pagination settings:
```typescript
PAGINATION.DEFAULT_PAGE   // 1
PAGINATION.DEFAULT_LIMIT  // 10
PAGINATION.MAX_LIMIT      // 100
```

### 9. JWT Settings (`JWT`)

JWT expiration times:
```typescript
JWT.DEFAULT_EXPIRES_IN   // '7d'
JWT.REFRESH_EXPIRES_IN   // '30d'
```

### 10. Regex Patterns (`REGEX_PATTERNS`)

Common regex patterns:
```typescript
REGEX_PATTERNS.EMAIL
REGEX_PATTERNS.PASSWORD_STRONG
REGEX_PATTERNS.PHONE
REGEX_PATTERNS.MONGODB_OBJECT_ID
```

### 11. Date Formats (`DATE_FORMATS`)

Standard date format strings:
```typescript
DATE_FORMATS.ISO                // 'YYYY-MM-DDTHH:mm:ss.SSSZ'
DATE_FORMATS.DATE_ONLY          // 'YYYY-MM-DD'
DATE_FORMATS.DISPLAY            // 'MMM DD, YYYY'
DATE_FORMATS.DISPLAY_WITH_TIME  // 'MMM DD, YYYY HH:mm'
```

---

## 🎯 Implementation Examples

### Example 1: Product DTO with Constants

**Before:**
```typescript
export class CreateProductDto {
  @IsString()
  name?: string;

  @IsNumber()
  @Min(0)
  price?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;
}
```

**After:**
```typescript
import { VALIDATION_MESSAGES, VALIDATION_CONSTRAINTS } from '../../../utils/constants';

export class CreateProductDto {
  @IsString({ message: VALIDATION_MESSAGES.PRODUCT.NAME_INVALID })
  name?: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.PRICE_INVALID })
  @Min(VALIDATION_CONSTRAINTS.PRODUCT.PRICE_MIN, { 
    message: VALIDATION_MESSAGES.PRODUCT.PRICE_MIN 
  })
  price?: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.PRODUCT.DISCOUNT_INVALID })
  @Min(VALIDATION_CONSTRAINTS.PRODUCT.DISCOUNT_MIN, { 
    message: VALIDATION_MESSAGES.PRODUCT.DISCOUNT_MIN 
  })
  @Max(VALIDATION_CONSTRAINTS.PRODUCT.DISCOUNT_MAX, { 
    message: VALIDATION_MESSAGES.PRODUCT.DISCOUNT_MAX 
  })
  discount?: number;
}
```

### Example 2: Service with Error Messages

**Before:**
```typescript
async findOne(id: string): Promise<Product> {
  const product = await this.productModel.findById(id).exec();
  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }
  return product;
}
```

**After:**
```typescript
import { ERROR_MESSAGES } from '../../utils/constants';

async findOne(id: string): Promise<Product> {
  const product = await this.productModel.findById(id).exec();
  if (!product) {
    throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(id));
  }
  return product;
}
```

### Example 3: Controller with Success Messages

**Before:**
```typescript
async remove(@Param('id') id: string) {
  await this.productsService.remove(id);
  return { message: 'Product deleted successfully' };
}
```

**After:**
```typescript
import { SUCCESS_MESSAGES } from '../../utils/constants';

async remove(@Param('id') id: string) {
  await this.productsService.remove(id);
  return { message: SUCCESS_MESSAGES.PRODUCT.DELETED };
}
```

---

## 📊 Files Updated

### 1. Created
- ✅ `apps/api/src/utils/constants.ts` - Centralized constants file

### 2. Updated
- ✅ `apps/api/src/modules/products/dto/create-product.dto.ts` - Using validation messages
- ✅ `apps/api/src/modules/products/products.service.ts` - Using error messages
- ✅ `apps/api/src/modules/products/products.controller.ts` - Using success messages

---

## 🔄 How to Update Messages

### Updating Validation Messages

**File:** `apps/api/src/utils/constants.ts`

```typescript
export const VALIDATION_MESSAGES = {
  PRODUCT: {
    NAME_INVALID: 'Product name must be a string',  // Change this
    PRICE_MIN: 'Product price must not be less than 0',  // Change this
    // ... other messages
  },
};
```

**Effect:** All DTOs using these messages will automatically use the new text.

### Updating Error Messages

```typescript
export const ERROR_MESSAGES = {
  PRODUCT: {
    NOT_FOUND: (id: string) => `Product with ID ${id} not found`,  // Change this
    // ... other messages
  },
};
```

**Effect:** All services throwing these errors will use the new message.

### Updating Success Messages

```typescript
export const SUCCESS_MESSAGES = {
  PRODUCT: {
    DELETED: 'Product deleted successfully',  // Change this
    // ... other messages
  },
};
```

**Effect:** All controllers returning these messages will use the new text.

---

## 🎨 Adding New Categories

### Step 1: Add to Constants File

```typescript
// In apps/api/src/utils/constants.ts

export const VALIDATION_MESSAGES = {
  // ... existing categories
  
  // NEW CATEGORY
  ORDER: {
    ID_REQUIRED: 'Order ID is required',
    STATUS_INVALID: 'Order status must be one of: pending, processing, completed, cancelled',
    AMOUNT_MIN: 'Order amount must not be less than 0',
  },
};

export const ERROR_MESSAGES = {
  // ... existing categories
  
  // NEW CATEGORY
  ORDER: {
    NOT_FOUND: (id: string) => `Order with ID ${id} not found`,
    ALREADY_COMPLETED: 'Order is already completed',
    CANNOT_CANCEL: 'Order cannot be cancelled at this stage',
  },
};

export const SUCCESS_MESSAGES = {
  // ... existing categories
  
  // NEW CATEGORY
  ORDER: {
    CREATED: 'Order created successfully',
    UPDATED: 'Order updated successfully',
    CANCELLED: 'Order cancelled successfully',
  },
};
```

### Step 2: Use in Your Module

```typescript
// In order.dto.ts
import { VALIDATION_MESSAGES } from '../../../utils/constants';

export class CreateOrderDto {
  @IsString({ message: VALIDATION_MESSAGES.ORDER.ID_REQUIRED })
  orderId: string;
}

// In order.service.ts
import { ERROR_MESSAGES } from '../../utils/constants';

async findOne(id: string) {
  const order = await this.orderModel.findById(id);
  if (!order) {
    throw new NotFoundException(ERROR_MESSAGES.ORDER.NOT_FOUND(id));
  }
  return order;
}

// In order.controller.ts
import { SUCCESS_MESSAGES } from '../../utils/constants';

async remove(@Param('id') id: string) {
  await this.orderService.remove(id);
  return { message: SUCCESS_MESSAGES.ORDER.CANCELLED };
}
```

---

## 🌍 Internationalization (i18n) Ready

The constants file is structured to easily support multiple languages:

```typescript
// Future: constants.en.ts
export const VALIDATION_MESSAGES_EN = {
  PRODUCT: {
    NAME_INVALID: 'Product name must be a string',
  },
};

// Future: constants.es.ts
export const VALIDATION_MESSAGES_ES = {
  PRODUCT: {
    NAME_INVALID: 'El nombre del producto debe ser una cadena',
  },
};

// Future: constants.fr.ts
export const VALIDATION_MESSAGES_FR = {
  PRODUCT: {
    NAME_INVALID: 'Le nom du produit doit être une chaîne',
  },
};
```

---

## ✅ Benefits

### 1. Centralized Management
- All messages in one place
- Easy to update
- Consistent across the application

### 2. Type Safety
- TypeScript autocomplete
- Compile-time checking
- Refactoring support

### 3. Maintainability
- Single source of truth
- Easy to find and update messages
- Reduces code duplication

### 4. Consistency
- Same message format everywhere
- Uniform error handling
- Professional API responses

### 5. Scalability
- Easy to add new categories
- Support for internationalization
- Flexible message templates

### 6. Testing
- Easy to mock messages
- Consistent test assertions
- Predictable error messages

---

## 🧪 Testing with Constants

```typescript
// In product.service.spec.ts
import { ERROR_MESSAGES } from '../../utils/constants';

describe('ProductsService', () => {
  it('should throw NotFoundException when product not found', async () => {
    const id = '507f1f77bcf86cd799439011';
    
    await expect(service.findOne(id)).rejects.toThrow(
      ERROR_MESSAGES.PRODUCT.NOT_FOUND(id)
    );
  });
});
```

---

## 📚 Best Practices

### 1. Always Use Constants
```typescript
// ❌ DON'T
throw new NotFoundException('Product not found');

// ✅ DO
throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(id));
```

### 2. Use Template Functions for Dynamic Messages
```typescript
// ✅ GOOD
NOT_FOUND: (id: string) => `Product with ID ${id} not found`

// ❌ BAD
NOT_FOUND: 'Product not found'  // No context
```

### 3. Group by Feature/Module
```typescript
// ✅ GOOD - Organized by module
VALIDATION_MESSAGES = {
  PRODUCT: { ... },
  USER: { ... },
  ORDER: { ... },
}

// ❌ BAD - Flat structure
VALIDATION_MESSAGES = {
  PRODUCT_NAME_INVALID: '...',
  USER_EMAIL_INVALID: '...',
  ORDER_ID_REQUIRED: '...',
}
```

### 4. Keep Messages User-Friendly
```typescript
// ✅ GOOD
'Product name must be a string'

// ❌ BAD
'Invalid type for field: name'
```

---

## 🚀 Next Steps

### 1. Update Other Modules

Apply the same pattern to:
- Users module
- Sales module
- Inventory module
- Auth module
- Forecast module
- Insights module

### 2. Add More Constants

Consider adding:
- Email templates
- Notification messages
- Log messages
- API response codes

### 3. Implement i18n

Add support for multiple languages:
- Create language-specific constant files
- Use a language service to select messages
- Support user language preferences

---

## 📞 Usage Summary

### Import Constants
```typescript
import { 
  VALIDATION_MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_CONSTRAINTS,
  HTTP_STATUS
} from '../../utils/constants';
```

### Use in DTOs
```typescript
@IsString({ message: VALIDATION_MESSAGES.PRODUCT.NAME_INVALID })
@Min(VALIDATION_CONSTRAINTS.PRODUCT.PRICE_MIN, { 
  message: VALIDATION_MESSAGES.PRODUCT.PRICE_MIN 
})
```

### Use in Services
```typescript
throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(id));
```

### Use in Controllers
```typescript
return { message: SUCCESS_MESSAGES.PRODUCT.DELETED };
```

---

**Created:** February 15, 2026
**Purpose:** Centralized constants management
**Status:** Implemented ✅
**Benefit:** Easy maintenance and consistency
