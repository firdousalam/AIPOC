/**
 * Application Constants
 * Centralized location for all validation messages, error messages, and constants
 * Update this file to change messages across the entire application
 */

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const VALIDATION_MESSAGES = {
    // Common validation messages
    COMMON: {
        REQUIRED: (field: string) => `${field} is required`,
        INVALID: (field: string) => `${field} is invalid`,
        MUST_BE_STRING: (field: string) => `${field} must be a string`,
        MUST_BE_NUMBER: (field: string) => `${field} must be a number`,
        MUST_BE_EMAIL: (field: string) => `${field} must be a valid email address`,
        MUST_BE_POSITIVE: (field: string) => `${field} must be a positive number`,
        MIN_VALUE: (field: string, min: number) => `${field} must not be less than ${min}`,
        MAX_VALUE: (field: string, max: number) => `${field} must not be greater than ${max}`,
        MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters long`,
        MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
    },

    // User validation messages
    USER: {
        NAME_REQUIRED: 'Name is required',
        NAME_INVALID: 'Name must be a valid string',
        EMAIL_REQUIRED: 'Email is required',
        EMAIL_INVALID: 'Email must be a valid email address',
        PASSWORD_REQUIRED: 'Password is required',
        PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
        PASSWORD_WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        USER_TYPE_INVALID: 'User type must be one of: super, admin, user',
    },

    // Product validation messages
    PRODUCT: {
        NAME_REQUIRED: 'Product name is required',
        NAME_INVALID: 'Product name must be a string',
        DESCRIPTION_INVALID: 'Product description must be a string',
        PRICE_REQUIRED: 'Product price is required',
        PRICE_INVALID: 'Product price must be a number',
        PRICE_MIN: 'Product price must not be less than 0',
        CATEGORY_REQUIRED: 'Product category is required',
        CATEGORY_INVALID: 'Product category must be a string',
        STOCK_INVALID: 'Stock must be a number',
        STOCK_MIN: 'Stock must not be less than 0',
        DISTRIBUTOR_INVALID: 'Distributor must be a string',
        COMPANY_INVALID: 'Company must be a string',
        MRP_INVALID: 'MRP must be a number',
        MRP_MIN: 'MRP must not be less than 0',
        SALE_PRICE_INVALID: 'Sale price must be a number',
        SALE_PRICE_MIN: 'Sale price must not be less than 0',
        DISCOUNT_INVALID: 'Discount must be a number',
        DISCOUNT_MIN: 'Discount must not be less than 0',
        DISCOUNT_MAX: 'Discount must not be greater than 100',
    },

    // Sales validation messages
    SALE: {
        PRODUCT_ID_REQUIRED: 'Product ID is required',
        PRODUCT_ID_INVALID: 'Product ID must be a valid MongoDB ObjectId',
        QUANTITY_REQUIRED: 'Quantity is required',
        QUANTITY_INVALID: 'Quantity must be a number',
        QUANTITY_MIN: 'Quantity must be at least 1',
        TOTAL_AMOUNT_REQUIRED: 'Total amount is required',
        TOTAL_AMOUNT_INVALID: 'Total amount must be a number',
        TOTAL_AMOUNT_MIN: 'Total amount must not be less than 0',
        DATE_INVALID: 'Date must be a valid date',
    },

    // Inventory validation messages
    INVENTORY: {
        PRODUCT_ID_REQUIRED: 'Product ID is required',
        PRODUCT_ID_INVALID: 'Product ID must be a valid MongoDB ObjectId',
        QUANTITY_REQUIRED: 'Quantity is required',
        QUANTITY_INVALID: 'Quantity must be a number',
        QUANTITY_MIN: 'Quantity must not be less than 0',
        LOCATION_INVALID: 'Location must be a string',
        WAREHOUSE_INVALID: 'Warehouse must be a string',
    },

    // Auth validation messages
    AUTH: {
        EMAIL_REQUIRED: 'Email is required',
        EMAIL_INVALID: 'Email must be a valid email address',
        PASSWORD_REQUIRED: 'Password is required',
        PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
        CREDENTIALS_INVALID: 'Invalid email or password',
        TOKEN_REQUIRED: 'Authentication token is required',
        TOKEN_INVALID: 'Invalid or expired token',
    },
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
    // Common errors
    COMMON: {
        INTERNAL_SERVER_ERROR: 'An internal server error occurred',
        BAD_REQUEST: 'Bad request',
        UNAUTHORIZED: 'Unauthorized access',
        FORBIDDEN: 'Access forbidden',
        NOT_FOUND: 'Resource not found',
        CONFLICT: 'Resource already exists',
        VALIDATION_FAILED: 'Validation failed',
    },

    // User errors
    USER: {
        NOT_FOUND: (id: string) => `User with ID ${id} not found`,
        EMAIL_EXISTS: 'User with this email already exists',
        INVALID_CREDENTIALS: 'Invalid email or password',
        CANNOT_DELETE_SUPER_ADMIN: 'Cannot delete super admin users',
        UNAUTHORIZED: 'You are not authorized to perform this action',
        SUPER_ADMIN_REQUIRED: 'Only super admins can access this resource',
    },

    // Product errors
    PRODUCT: {
        NOT_FOUND: (id: string) => `Product with ID ${id} not found`,
        ALREADY_EXISTS: 'Product with this name already exists',
        INSUFFICIENT_STOCK: (available: number) => `Insufficient stock. Only ${available} units available`,
        INVALID_ID: 'Invalid product ID format',
    },

    // Sales errors
    SALE: {
        NOT_FOUND: (id: string) => `Sale with ID ${id} not found`,
        PRODUCT_NOT_FOUND: 'Product not found for this sale',
        INVALID_QUANTITY: 'Sale quantity must be greater than 0',
        INVALID_AMOUNT: 'Sale amount must be greater than 0',
    },

    // Inventory errors
    INVENTORY: {
        NOT_FOUND: (id: string) => `Inventory with ID ${id} not found`,
        PRODUCT_NOT_FOUND: 'Product not found in inventory',
        INSUFFICIENT_STOCK: (available: number) => `Insufficient stock. Only ${available} units available`,
        NEGATIVE_STOCK: 'Stock quantity cannot be negative',
    },

    // Auth errors
    AUTH: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        USER_NOT_FOUND: 'User not found',
        EMAIL_EXISTS: 'User with this email already exists',
        TOKEN_EXPIRED: 'Authentication token has expired',
        TOKEN_INVALID: 'Invalid authentication token',
        UNAUTHORIZED: 'You are not authorized to access this resource',
        SESSION_EXPIRED: 'Your session has expired. Please login again',
    },

    // Forecast errors
    FORECAST: {
        INSUFFICIENT_DATA: 'Insufficient data to generate forecast',
        INVALID_PERIOD: 'Invalid forecast period',
        MODEL_ERROR: 'Error generating forecast with ML model',
    },

    // Insights errors
    INSIGHTS: {
        GENERATION_FAILED: 'Failed to generate AI insights',
        INSUFFICIENT_DATA: 'Insufficient data to generate insights',
        AI_SERVICE_UNAVAILABLE: 'AI service is currently unavailable',
    },
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
    // Common success messages
    COMMON: {
        CREATED: 'Resource created successfully',
        UPDATED: 'Resource updated successfully',
        DELETED: 'Resource deleted successfully',
        OPERATION_SUCCESS: 'Operation completed successfully',
    },

    // User success messages
    USER: {
        CREATED: 'User created successfully',
        UPDATED: 'User updated successfully',
        DELETED: 'User deleted successfully',
        PASSWORD_UPDATED: 'Password updated successfully',
        PROFILE_UPDATED: 'Profile updated successfully',
    },

    // Product success messages
    PRODUCT: {
        CREATED: 'Product created successfully',
        UPDATED: 'Product updated successfully',
        DELETED: 'Product deleted successfully',
        STOCK_UPDATED: 'Product stock updated successfully',
    },

    // Sales success messages
    SALE: {
        CREATED: 'Sale recorded successfully',
        UPDATED: 'Sale updated successfully',
        DELETED: 'Sale deleted successfully',
    },

    // Inventory success messages
    INVENTORY: {
        CREATED: 'Inventory created successfully',
        UPDATED: 'Inventory updated successfully',
        DELETED: 'Inventory deleted successfully',
        STOCK_ADJUSTED: 'Stock adjusted successfully',
    },

    // Auth success messages
    AUTH: {
        LOGIN_SUCCESS: 'Login successful',
        LOGOUT_SUCCESS: 'Logout successful',
        REGISTER_SUCCESS: 'Registration successful',
        PASSWORD_RESET: 'Password reset successful',
    },
};

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

// ============================================================================
// VALIDATION CONSTRAINTS
// ============================================================================

export const VALIDATION_CONSTRAINTS = {
    // User constraints
    USER: {
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 100,
        PASSWORD_MIN_LENGTH: 6,
        PASSWORD_MAX_LENGTH: 128,
        EMAIL_MAX_LENGTH: 255,
    },

    // Product constraints
    PRODUCT: {
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 200,
        DESCRIPTION_MAX_LENGTH: 1000,
        PRICE_MIN: 0,
        PRICE_MAX: 999999999,
        STOCK_MIN: 0,
        STOCK_MAX: 999999999,
        DISCOUNT_MIN: 0,
        DISCOUNT_MAX: 100,
    },

    // Sales constraints
    SALE: {
        QUANTITY_MIN: 1,
        QUANTITY_MAX: 999999,
        AMOUNT_MIN: 0,
        AMOUNT_MAX: 999999999,
    },

    // Inventory constraints
    INVENTORY: {
        QUANTITY_MIN: 0,
        QUANTITY_MAX: 999999999,
    },
};

// ============================================================================
// USER TYPES
// ============================================================================

export const USER_TYPES = {
    SUPER: 'super',
    ADMIN: 'admin',
    USER: 'user',
} as const;

export const USER_TYPE_VALUES = Object.values(USER_TYPES);

// ============================================================================
// PRODUCT CATEGORIES (Example - customize as needed)
// ============================================================================

export const PRODUCT_CATEGORIES = {
    ELECTRONICS: 'Electronics',
    CLOTHING: 'Clothing',
    FOOD: 'Food',
    BOOKS: 'Books',
    TOYS: 'Toys',
    FURNITURE: 'Furniture',
    SPORTS: 'Sports',
    BEAUTY: 'Beauty',
    AUTOMOTIVE: 'Automotive',
    OTHER: 'Other',
} as const;

export const PRODUCT_CATEGORY_VALUES = Object.values(PRODUCT_CATEGORIES);

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

// ============================================================================
// JWT
// ============================================================================

export const JWT = {
    DEFAULT_EXPIRES_IN: '7d',
    REFRESH_EXPIRES_IN: '30d',
};

// ============================================================================
// REGEX PATTERNS
// ============================================================================

export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    PHONE: /^\+?[\d\s-()]+$/,
    MONGODB_OBJECT_ID: /^[0-9a-fA-F]{24}$/,
};

// ============================================================================
// DATE FORMATS
// ============================================================================

export const DATE_FORMATS = {
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    DATE_ONLY: 'YYYY-MM-DD',
    TIME_ONLY: 'HH:mm:ss',
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
    VALIDATION_MESSAGES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    HTTP_STATUS,
    VALIDATION_CONSTRAINTS,
    USER_TYPES,
    USER_TYPE_VALUES,
    PRODUCT_CATEGORIES,
    PRODUCT_CATEGORY_VALUES,
    PAGINATION,
    JWT,
    REGEX_PATTERNS,
    DATE_FORMATS,
};

// ============================================================================
// API DOCUMENTATION MESSAGES
// ============================================================================

export const API_DOCS = {
    // Common API documentation
    COMMON: {
        UNAUTHORIZED: 'Unauthorized',
        BAD_REQUEST: 'Bad request - Invalid data',
        NOT_FOUND: 'Resource not found',
        INTERNAL_ERROR: 'Internal server error',
    },

    // Product API documentation
    PRODUCT: {
        // Operations
        CREATE_SUMMARY: 'Create a new product',
        GET_ALL_SUMMARY: 'Get all products',
        GET_ONE_SUMMARY: 'Get product by ID',
        UPDATE_SUMMARY: 'Update product by ID',
        DELETE_SUMMARY: 'Delete product by ID',

        // Descriptions
        PRODUCT_ID_PARAM: 'Product ID',

        // Responses
        CREATED_SUCCESS: 'Product created successfully',
        RETRIEVED_SUCCESS: 'Product retrieved successfully',
        LIST_SUCCESS: 'List of products retrieved successfully',
        UPDATED_SUCCESS: 'Product updated successfully',
        DELETED_SUCCESS: 'Product deleted successfully',
        NOT_FOUND: 'Product not found',
    },

    // User API documentation
    USER: {
        // Operations
        CREATE_SUMMARY: 'Create a new user (super admin only)',
        GET_ALL_SUMMARY: 'List all users (super admin only)',
        GET_ONE_SUMMARY: 'Get user by ID (super admin only)',
        UPDATE_SUMMARY: 'Update user (super admin only)',
        DELETE_SUMMARY: 'Delete user (super admin only)',

        // Descriptions
        USER_ID_PARAM: 'User ID',

        // Responses
        CREATED_SUCCESS: 'User created successfully',
        RETRIEVED_SUCCESS: 'User retrieved successfully',
        LIST_SUCCESS: 'List of users retrieved successfully',
        UPDATED_SUCCESS: 'User updated successfully',
        DELETED_SUCCESS: 'User deleted successfully',
        NOT_FOUND: 'User not found',
        SUPER_ADMIN_REQUIRED: 'Forbidden - Super admin access required',
        EMAIL_EXISTS: 'Bad request - User already exists',
        CANNOT_DELETE_SUPER: 'Bad request - Cannot delete super admin users',
    },

    // Auth API documentation
    AUTH: {
        // Operations
        REGISTER_SUMMARY: 'Register a new user',
        LOGIN_SUMMARY: 'Login with email and password',

        // Responses
        REGISTER_SUCCESS: 'User created successfully',
        LOGIN_SUCCESS: 'Returns access_token and user',
        INVALID_CREDENTIALS: 'Invalid credentials',
    },

    // Sales API documentation
    SALE: {
        // Operations
        CREATE_SUMMARY: 'Create a new sale',
        GET_ALL_SUMMARY: 'Get all sales',
        GET_ONE_SUMMARY: 'Get sale by ID',
        UPDATE_SUMMARY: 'Update sale by ID',
        DELETE_SUMMARY: 'Delete sale by ID',

        // Descriptions
        SALE_ID_PARAM: 'Sale ID',

        // Responses
        CREATED_SUCCESS: 'Sale created successfully',
        RETRIEVED_SUCCESS: 'Sale retrieved successfully',
        LIST_SUCCESS: 'List of sales retrieved successfully',
        UPDATED_SUCCESS: 'Sale updated successfully',
        DELETED_SUCCESS: 'Sale deleted successfully',
        NOT_FOUND: 'Sale not found',
    },

    // Inventory API documentation
    INVENTORY: {
        // Operations
        CREATE_SUMMARY: 'Create inventory record',
        GET_ALL_SUMMARY: 'Get all inventory records',
        GET_ONE_SUMMARY: 'Get inventory by ID',
        UPDATE_SUMMARY: 'Update inventory by ID',
        DELETE_SUMMARY: 'Delete inventory by ID',

        // Descriptions
        INVENTORY_ID_PARAM: 'Inventory ID',

        // Responses
        CREATED_SUCCESS: 'Inventory created successfully',
        RETRIEVED_SUCCESS: 'Inventory retrieved successfully',
        LIST_SUCCESS: 'List of inventory retrieved successfully',
        UPDATED_SUCCESS: 'Inventory updated successfully',
        DELETED_SUCCESS: 'Inventory deleted successfully',
        NOT_FOUND: 'Inventory not found',
    },

    // Forecast API documentation
    FORECAST: {
        // Operations
        GENERATE_SUMMARY: 'Generate sales forecast',
        GET_ONE_SUMMARY: 'Get forecast by ID',

        // Descriptions
        FORECAST_ID_PARAM: 'Forecast ID',

        // Responses
        GENERATED_SUCCESS: 'Forecast generated successfully',
        RETRIEVED_SUCCESS: 'Forecast retrieved successfully',
        NOT_FOUND: 'Forecast not found',
        INSUFFICIENT_DATA: 'Insufficient data to generate forecast',
    },

    // Insights API documentation
    INSIGHTS: {
        // Operations
        GENERATE_SUMMARY: 'Generate AI insights',
        GET_ONE_SUMMARY: 'Get insights by ID',

        // Descriptions
        INSIGHT_ID_PARAM: 'Insight ID',

        // Responses
        GENERATED_SUCCESS: 'Insights generated successfully',
        RETRIEVED_SUCCESS: 'Insights retrieved successfully',
        NOT_FOUND: 'Insights not found',
        GENERATION_FAILED: 'Failed to generate insights',
    },
};
