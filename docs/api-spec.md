# API Specification

## Base URLs
- **API**: `http://localhost:3001/api`
- **ML Service**: `http://localhost:8000/api/v1`

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### Register
```
POST /api/auth/register
Body: { name, email, password }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { access_token, user }
```

### Sales

#### Get All Sales
```
GET /api/sales
```

#### Create Sale
```
POST /api/sales
Body: { productId, productName, quantity, price, totalAmount, saleDate }
```

#### Get Sale by ID
```
GET /api/sales/:id
```

### Products

#### Get All Products
```
GET /api/products
```

#### Create Product
```
POST /api/products
Body: { name, description, price, category, stock }
```

### Inventory

#### Get All Inventory Items
```
GET /api/inventory
```

#### Create Inventory Item
```
POST /api/inventory
Body: { productId, productName, quantity, reorderLevel }
```

### Forecast

#### Get Forecast
```
POST /api/forecast
Body: { productId, forecastDays? }
```

### Insights

#### Get Insights
```
GET /api/insights
Response: { totalSales, totalQuantity, averageSale, totalTransactions }
```

## ML Service Endpoints

### Predictions

#### Forecast Sales
```
POST /api/v1/predictions/forecast
Body: { product_id, forecast_days }
Response: { product_id, forecast_days, predictions, confidence_intervals }
```

### Training

#### Train Model
```
POST /api/v1/training/train
Body: { model_type, data_path? }
Response: { model_type, status, accuracy, model_path }
```

### Agentic AI

#### Query AI
```
POST /api/v1/ai/query
Body: { query, context? }
Response: { response, reasoning }
```

