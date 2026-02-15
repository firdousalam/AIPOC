# Enterprise Sales AI - Project Architecture Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure Explained](#folder-structure-explained)
3. [Why This Architecture](#why-this-architecture)
4. [Adding New Routes](#adding-new-routes)
5. [MongoDB Integration](#mongodb-integration)
6. [Machine Learning Architecture](#machine-learning-architecture)
7. [Agentic AI System](#agentic-ai-system)
8. [Deployment Guide](#deployment-guide)
9. [Models & Technologies](#models--technologies)

---

## Project Overview

This is a **monorepo** enterprise application for sales forecasting and inventory management with AI-powered predictions. It uses a microservices architecture with three main services:

- **Frontend (Next.js)**: User interface and client-side logic
- **Backend API (NestJS)**: Business logic, authentication, and data management
- **ML Service (Python FastAPI)**: Machine learning models and AI agents

**Tech Stack:**
- Frontend: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript, Passport.js (JWT auth)
- ML Service: Python, FastAPI, scikit-learn, Prophet, XGBoost, Ollama
- Database: MongoDB with Mongoose ODM
- Package Manager: pnpm (workspaces)

---

## Folder Structure Explained

### Root Level
```
enterprise-sales-ai/
├── apps/                    # All application services
│   ├── web/                # Next.js frontend
│   ├── api/                # NestJS backend
│   └── ml-service/         # Python ML service
├── packages/               # Shared packages (if any)
├── infrastructure/         # Docker, K8s configs
├── .env                    # Environment variables
└── package.json           # Root workspace config
```


### Frontend Structure (`apps/web/`)

```
apps/web/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx         # Root layout (global)
│   │   ├── page.tsx           # Home page (/)
│   │   ├── providers.tsx      # React context providers
│   │   └── globals.css        # Global styles
│   ├── modules/               # Feature modules
│   │   ├── dashboard/         # Dashboard components
│   │   ├── forecast/          # Forecasting UI
│   │   ├── inventory/         # Inventory management
│   │   └── sales/             # Sales tracking
│   ├── services/              # API client services
│   │   └── api/               # HTTP clients for backend
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS config
└── package.json              # Frontend dependencies
```

**Why this structure:**
- **App Router**: Next.js 14's file-based routing for better performance and SEO
- **Modules**: Feature-based organization for scalability
- **Services**: Centralized API calls for maintainability
- **Separation of concerns**: Clear boundaries between UI, logic, and data


### Backend Structure (`apps/api/`)

```
apps/api/
├── src/
│   ├── modules/                  # Feature modules (NestJS pattern)
│   │   ├── auth/                # Authentication & JWT
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── guards/          # Auth guards
│   │   │   └── strategies/      # Passport strategies
│   │   ├── users/               # User management
│   │   ├── products/            # Product CRUD
│   │   ├── sales/               # Sales tracking
│   │   ├── inventory/           # Inventory management
│   │   ├── forecast/            # Forecast proxy to ML
│   │   └── insights/            # AI insights proxy
│   ├── common/                  # Shared resources
│   │   └── guards/              # Global guards
│   ├── config/                  # Configuration files
│   │   └── database.config.ts   # MongoDB config
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Application entry point
├── dist/                        # Compiled output
├── nest-cli.json               # NestJS CLI config
└── package.json                # Backend dependencies
```

**Why this structure:**
- **Modular architecture**: Each feature is self-contained (controller, service, module, DTOs)
- **Dependency injection**: NestJS's powerful DI system for testability
- **Guards & strategies**: Centralized authentication and authorization
- **DTOs**: Type-safe data validation with class-validator
- **Scalability**: Easy to add new modules without affecting existing code


### ML Service Structure (`apps/ml-service/`)

```
apps/ml-service/
├── app/
│   ├── api/                     # FastAPI routes
│   │   └── routes/
│   │       ├── prediction.py    # Prediction endpoints
│   │       ├── training.py      # Model training endpoints
│   │       └── agentic_ai.py    # AI agent endpoints
│   ├── models/                  # ML model implementations
│   │   ├── base_model.py        # Abstract base class
│   │   ├── prophet_model.py     # Facebook Prophet (time series)
│   │   ├── xgboost_model.py     # XGBoost (gradient boosting)
│   │   └── lstm_model.py        # LSTM (deep learning)
│   ├── preprocessing/           # Data preprocessing
│   │   ├── data_cleaner.py      # Data cleaning utilities
│   │   ├── feature_engineering.py
│   │   └── scaler.py            # Data normalization
│   ├── training/                # Model training pipeline
│   │   ├── data_loader.py       # Load training data
│   │   ├── trainer.py           # Training orchestration
│   │   └── evaluator.py         # Model evaluation
│   ├── inference/               # Prediction pipeline
│   │   ├── predictor.py         # Single predictions
│   │   └── batch_predictor.py   # Batch predictions
│   ├── agentic_ai/              # AI agent system
│   │   ├── agent.py             # Main agent orchestrator
│   │   ├── llm_client.py        # LLM integration (Ollama)
│   │   └── tools/               # Agent tools
│   │       ├── forecast_tool.py
│   │       └── data_analysis_tool.py
│   ├── prompts/                 # LLM prompt templates
│   ├── schemas/                 # Pydantic schemas
│   └── utils/                   # Utility functions
├── main.py                      # FastAPI app entry
└── requirements.txt             # Python dependencies
```

**Why this structure:**
- **Separation of concerns**: Models, training, inference, and AI are separate
- **Modular models**: Easy to add new ML algorithms
- **Pipeline architecture**: Clear data flow from preprocessing to prediction
- **Agentic AI**: Separate system for intelligent decision-making
- **FastAPI**: High-performance async API with automatic docs


---

## Why This Architecture

### 1. Monorepo with Workspaces
**Why:** 
- Share code and types between services
- Single repository for easier version control
- Unified dependency management with pnpm
- Consistent tooling and CI/CD

**Benefits:**
- Atomic commits across services
- Easier refactoring
- Better developer experience

### 2. Microservices Pattern
**Why:**
- **Frontend (Next.js)**: Optimized for user experience, SSR, and SEO
- **Backend (NestJS)**: Business logic, authentication, data validation
- **ML Service (Python)**: Python's ML ecosystem (scikit-learn, Prophet, XGBoost)

**Benefits:**
- Independent scaling (scale ML service separately)
- Technology flexibility (TypeScript for web, Python for ML)
- Fault isolation (ML service crash doesn't affect main app)
- Team specialization (frontend, backend, ML teams)

### 3. Feature-Based Modules
**Why:**
- Each feature (auth, products, sales) is self-contained
- Easy to understand and maintain
- Clear ownership and boundaries

**Benefits:**
- Faster onboarding for new developers
- Easier testing (unit test per module)
- Reduced merge conflicts

### 4. TypeScript Everywhere (except ML)
**Why:**
- Type safety reduces bugs
- Better IDE support and autocomplete
- Self-documenting code

**Benefits:**
- Catch errors at compile time
- Refactoring confidence
- Better collaboration


---

## Adding New Routes

### Frontend (Next.js)

#### 1. Add a New Page Route

**File-based routing** in Next.js 14 App Router:

```bash
# Create a new page at /products
apps/web/src/app/products/page.tsx
```

```typescript
// apps/web/src/app/products/page.tsx
export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      {/* Your component code */}
    </div>
  );
}
```

**Dynamic routes:**
```bash
# Create /products/[id] route
apps/web/src/app/products/[id]/page.tsx
```

```typescript
// apps/web/src/app/products/[id]/page.tsx
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <div>Product ID: {params.id}</div>;
}
```

#### 2. Add API Client Service

```typescript
// apps/web/src/services/api/products.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const productsApi = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await axios.get(`${API_URL}/api/products/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await axios.post(`${API_URL}/api/products`, data);
    return response.data;
  }
};
```

#### 3. Create Feature Module (Optional)

```bash
# Organize complex features
apps/web/src/modules/products/
├── components/
│   ├── ProductList.tsx
│   └── ProductCard.tsx
├── hooks/
│   └── useProducts.ts
└── types.ts
```


### Backend (NestJS)

#### 1. Generate a New Module

```bash
cd apps/api
nest generate module modules/orders
nest generate controller modules/orders
nest generate service modules/orders
```

This creates:
```
apps/api/src/modules/orders/
├── orders.controller.ts
├── orders.service.ts
└── orders.module.ts
```

#### 2. Create Schema (MongoDB Model)

```typescript
// apps/api/src/modules/orders/orders.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  items: Array<{ productId: string; quantity: number; price: number }>;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
```

#### 3. Create DTOs (Data Transfer Objects)

```typescript
// apps/api/src/modules/orders/dto/create-order.dto.ts
import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  customerId: string;

  @IsArray()
  items: Array<{ productId: string; quantity: number; price: number }>;

  @IsNumber()
  totalAmount: number;
}
```

#### 4. Implement Service

```typescript
// apps/api/src/modules/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel(createOrderDto);
    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }
}
```


#### 5. Implement Controller

```typescript
// apps/api/src/modules/orders/orders.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard) // Protect all routes
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
```

#### 6. Register Module

```typescript
// apps/api/src/modules/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './orders.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Export if other modules need it
})
export class OrdersModule {}
```

#### 7. Import in App Module

```typescript
// apps/api/src/app.module.ts
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    // ... other imports
    OrdersModule, // Add here
  ],
})
export class AppModule {}
```

**Your API is now available at:** `http://localhost:3001/api/orders`


### ML Service (Python FastAPI)

#### 1. Create New Route File

```python
# apps/ml-service/app/api/routes/recommendations.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class RecommendationRequest(BaseModel):
    user_id: str
    limit: int = 10

class RecommendationResponse(BaseModel):
    product_id: str
    score: float
    reason: str

@router.post("/recommend", response_model=List[RecommendationResponse])
async def get_recommendations(request: RecommendationRequest):
    """Get product recommendations for a user"""
    try:
        # Your ML logic here
        recommendations = [
            {
                "product_id": "prod_123",
                "score": 0.95,
                "reason": "Based on purchase history"
            }
        ]
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "recommendations"}
```

#### 2. Register Route in Main App

```python
# apps/ml-service/main.py
from app.api.routes import prediction, training, agentic_ai, recommendations

app.include_router(
    recommendations.router, 
    prefix="/api/v1/recommendations", 
    tags=["recommendations"]
)
```

#### 3. Create Model Class (if needed)

```python
# apps/ml-service/app/models/recommendation_model.py
from app.models.base_model import BaseModel
import numpy as np

class RecommendationModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.model_type = "collaborative_filtering"
    
    def train(self, data):
        """Train recommendation model"""
        pass
    
    def predict(self, user_id: str, limit: int = 10):
        """Generate recommendations"""
        pass
```

**Your ML API is now available at:** `http://localhost:8000/api/v1/recommendations`


---

## MongoDB Integration

### How MongoDB Works in This Project

#### 1. Connection Setup

**Backend (NestJS):**
```typescript
// apps/api/src/app.module.ts
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-sales-ai'),
    // ... other modules
  ],
})
export class AppModule {}
```

**Environment variable:**
```bash
# .env
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

#### 2. Schema Definition (Mongoose ODM)

Mongoose provides an Object-Document Mapping (ODM) layer:

```typescript
// Example: Product Schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true }) // Adds createdAt, updatedAt
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

**What happens:**
- `@Schema()` decorator creates a MongoDB collection
- `@Prop()` defines document fields with validation
- `timestamps: true` auto-manages createdAt/updatedAt
- TypeScript types ensure compile-time safety


#### 3. CRUD Operations

```typescript
// Service layer
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Create
  async create(data: CreateProductDto): Promise<Product> {
    const product = new this.productModel(data);
    return product.save();
  }

  // Read all
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // Read one
  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  // Update
  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // Delete
  async remove(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }

  // Custom queries
  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel.find({ category }).exec();
  }

  async findLowStock(threshold: number): Promise<Product[]> {
    return this.productModel.find({ stock: { $lt: threshold } }).exec();
  }
}
```

#### 4. Data Flow

```
Frontend (Next.js)
    ↓ HTTP Request
Backend API (NestJS)
    ↓ Mongoose ODM
MongoDB Database
```

**Example flow:**
1. User clicks "Add Product" in frontend
2. Frontend sends POST request to `/api/products`
3. NestJS controller receives request
4. DTO validates data
5. Service creates Mongoose model instance
6. Mongoose saves to MongoDB
7. Response sent back to frontend


#### 5. MongoDB Collections in This Project

| Collection | Schema | Purpose |
|-----------|--------|---------|
| `users` | User | Authentication, user profiles |
| `products` | Product | Product catalog |
| `sales` | Sale | Sales transactions |
| `inventory` | Inventory | Stock levels |

#### 6. Why MongoDB?

**Advantages:**
- **Flexible schema**: Easy to evolve data models
- **JSON-like documents**: Natural fit for JavaScript/TypeScript
- **Scalability**: Horizontal scaling with sharding
- **Rich queries**: Powerful aggregation framework
- **Atlas free tier**: Easy cloud deployment

**Use cases in this project:**
- Storing sales transactions (time-series data)
- Product catalog (varying attributes)
- User profiles (flexible fields)
- Inventory tracking (frequent updates)

#### 7. Local vs Cloud MongoDB

**Local (Development):**
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
# Windows: MongoDB Compass + MongoDB Server
# Mac: brew install mongodb-community
```

**Cloud (Production - MongoDB Atlas):**
1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `.env`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/enterprise-sales-ai?retryWrites=true&w=majority
```


---

## Machine Learning Architecture

### How ML Works in This Project

#### 1. ML Pipeline Overview

```
Data Collection → Preprocessing → Training → Model Storage → Inference → Results
```

#### 2. Models Used

| Model | Type | Use Case | Library |
|-------|------|----------|---------|
| **Prophet** | Time Series | Sales forecasting, trend analysis | Facebook Prophet |
| **XGBoost** | Gradient Boosting | Demand prediction, classification | XGBoost |
| **LSTM** | Deep Learning | Sequential patterns, long-term trends | TensorFlow/Keras |

#### 3. Prophet Model (Primary Forecasting)

**Why Prophet:**
- Designed for business time series
- Handles seasonality automatically (daily, weekly, yearly)
- Robust to missing data and outliers
- Interpretable components (trend, seasonality, holidays)

**Implementation:**
```python
# apps/ml-service/app/models/prophet_model.py
from prophet import Prophet
import pandas as pd

class ProphetModel:
    def __init__(self):
        self.model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False
        )
    
    def train(self, data: pd.DataFrame):
        """
        data must have columns: 'ds' (date) and 'y' (value)
        """
        self.model.fit(data)
    
    def predict(self, periods: int):
        """Forecast future periods"""
        future = self.model.make_future_dataframe(periods=periods)
        forecast = self.model.predict(future)
        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
```

**Use case:** Predicting next 30 days of sales based on historical data


#### 4. XGBoost Model (Demand Prediction)

**Why XGBoost:**
- High accuracy for structured data
- Fast training and inference
- Feature importance analysis
- Handles non-linear relationships

**Implementation:**
```python
# apps/ml-service/app/models/xgboost_model.py
import xgboost as xgb
import numpy as np

class XGBoostModel:
    def __init__(self):
        self.model = xgb.XGBRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5
        )
    
    def train(self, X, y):
        """Train on features and target"""
        self.model.fit(X, y)
    
    def predict(self, X):
        """Predict demand"""
        return self.model.predict(X)
    
    def get_feature_importance(self):
        """Understand which features matter most"""
        return self.model.feature_importances_
```

**Use case:** Predicting product demand based on price, season, promotions, etc.

#### 5. LSTM Model (Deep Learning)

**Why LSTM:**
- Captures long-term dependencies
- Learns complex patterns
- Good for sequential data

**Implementation:**
```python
# apps/ml-service/app/models/lstm_model.py
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

class LSTMModel:
    def __init__(self, input_shape):
        self.model = Sequential([
            LSTM(50, activation='relu', input_shape=input_shape),
            Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mse')
    
    def train(self, X, y, epochs=50):
        self.model.fit(X, y, epochs=epochs, verbose=0)
    
    def predict(self, X):
        return self.model.predict(X)
```

**Use case:** Complex time series with long-term patterns


#### 6. Data Preprocessing Pipeline

```python
# apps/ml-service/app/preprocessing/data_cleaner.py
class DataCleaner:
    @staticmethod
    def clean_sales_data(df):
        """Clean and prepare sales data"""
        # Remove duplicates
        df = df.drop_duplicates()
        
        # Handle missing values
        df = df.fillna(method='ffill')
        
        # Remove outliers (IQR method)
        Q1 = df['sales'].quantile(0.25)
        Q3 = df['sales'].quantile(0.75)
        IQR = Q3 - Q1
        df = df[(df['sales'] >= Q1 - 1.5*IQR) & (df['sales'] <= Q3 + 1.5*IQR)]
        
        return df

# apps/ml-service/app/preprocessing/feature_engineering.py
class FeatureEngineer:
    @staticmethod
    def create_time_features(df):
        """Extract time-based features"""
        df['day_of_week'] = df['date'].dt.dayofweek
        df['month'] = df['date'].dt.month
        df['quarter'] = df['date'].dt.quarter
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        return df
```

#### 7. Training Pipeline

```python
# apps/ml-service/app/training/trainer.py
class ModelTrainer:
    def __init__(self, model_type='prophet'):
        self.model_type = model_type
        self.model = self._initialize_model()
    
    def train(self, data):
        """Complete training pipeline"""
        # 1. Clean data
        cleaned_data = DataCleaner.clean_sales_data(data)
        
        # 2. Feature engineering
        featured_data = FeatureEngineer.create_time_features(cleaned_data)
        
        # 3. Train model
        self.model.train(featured_data)
        
        # 4. Evaluate
        metrics = self._evaluate(featured_data)
        
        # 5. Save model
        self._save_model()
        
        return metrics
```

#### 8. Inference (Prediction) Pipeline

```python
# apps/ml-service/app/inference/predictor.py
class Predictor:
    def __init__(self, model_path):
        self.model = self._load_model(model_path)
    
    def predict(self, input_data):
        """Make predictions"""
        # Preprocess input
        processed = self._preprocess(input_data)
        
        # Predict
        predictions = self.model.predict(processed)
        
        # Post-process
        results = self._postprocess(predictions)
        
        return results
```


#### 9. ML Service API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/predictions/forecast` | POST | Get sales forecast |
| `/api/v1/predictions/demand` | POST | Predict product demand |
| `/api/v1/training/train` | POST | Train new model |
| `/api/v1/training/evaluate` | GET | Get model metrics |

**Example request:**
```bash
curl -X POST http://localhost:8000/api/v1/predictions/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_123",
    "periods": 30,
    "model_type": "prophet"
  }'
```

**Example response:**
```json
{
  "predictions": [
    {"date": "2026-02-16", "value": 1250, "lower": 1100, "upper": 1400},
    {"date": "2026-02-17", "value": 1280, "lower": 1130, "upper": 1430}
  ],
  "model_type": "prophet",
  "confidence": 0.95
}
```

#### 10. Why This ML Architecture?

**Separation from main API:**
- Python's ML ecosystem is superior
- Independent scaling (ML is compute-intensive)
- Can use GPU instances for ML service only
- Easier to update models without affecting main app

**Multiple models:**
- Different models for different use cases
- Ensemble predictions for better accuracy
- Fallback if one model fails

**Pipeline approach:**
- Consistent data processing
- Reproducible results
- Easy to debug and improve


---

## Agentic AI System

### What is Agentic AI?

Agentic AI refers to AI systems that can:
- **Reason** about problems
- **Plan** actions to solve them
- **Use tools** to gather information
- **Make decisions** autonomously
- **Learn** from feedback

Think of it as an AI assistant that can think through problems and take actions, not just answer questions.

### How Agentic AI Works in This Project

#### 1. Architecture Overview

```
User Query → AI Agent → LLM (Ollama) → Tools → Response
                ↓
         [Forecast Tool]
         [Data Analysis Tool]
         [Recommendation Tool]
```

#### 2. LLM Integration (Ollama)

**Why Ollama:**
- **Open-source**: No API costs, full control
- **Local deployment**: Data privacy, no external API calls
- **Multiple models**: Llama 2, Mistral, CodeLlama, etc.
- **Fast inference**: Optimized for local hardware

**Setup:**
```bash
# Install Ollama
# Windows: Download from ollama.ai
# Mac: brew install ollama
# Linux: curl https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2

# Run Ollama server (runs on localhost:11434)
ollama serve
```

**Configuration:**
```bash
# .env
AI_MODEL_URL=http://localhost:11434
AI_MODEL_NAME=llama2
```


#### 3. LLM Client Implementation

```python
# apps/ml-service/app/agentic_ai/llm_client.py
import httpx
import os

class LLMClient:
    def __init__(self):
        self.base_url = os.getenv("AI_MODEL_URL", "http://localhost:11434")
        self.model_name = os.getenv("AI_MODEL_NAME", "llama2")
    
    async def generate(self, prompt: str, context: dict = {}) -> str:
        """Generate response using local LLM"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model_name,
                        "prompt": prompt,
                        "stream": False,
                        "context": context
                    },
                    timeout=60.0
                )
                
                if response.status_code == 200:
                    return response.json().get("response", "")
                else:
                    return "Error generating response"
        except Exception as e:
            return f"Error: {str(e)}"
```

#### 4. AI Agent Implementation

```python
# apps/ml-service/app/agentic_ai/agent.py
from app.agentic_ai.llm_client import LLMClient
from app.agentic_ai.tools import ForecastTool, DataAnalysisTool

class SalesAIAgent:
    def __init__(self):
        self.llm_client = LLMClient()
        self.tools = {
            "forecast": ForecastTool(),
            "analyze": DataAnalysisTool()
        }
    
    async def process_query(self, query: str, context: dict = {}) -> dict:
        """Process user query with reasoning and tool use"""
        
        # 1. Understand intent
        intent = await self._classify_intent(query)
        
        # 2. Select appropriate tool
        tool = self.tools.get(intent)
        
        # 3. Execute tool if needed
        if tool:
            tool_result = await tool.execute(context)
            context["tool_result"] = tool_result
        
        # 4. Generate response with LLM
        response = await self.llm_client.generate(
            prompt=self._build_prompt(query, context),
            context=context
        )
        
        return {
            "response": response,
            "intent": intent,
            "tool_used": intent if tool else None,
            "reasoning": "Agent analyzed query and selected appropriate action"
        }
    
    async def _classify_intent(self, query: str) -> str:
        """Determine what the user wants"""
        if "forecast" in query.lower() or "predict" in query.lower():
            return "forecast"
        elif "analyze" in query.lower() or "insight" in query.lower():
            return "analyze"
        else:
            return "general"
```


#### 5. Agent Tools

**Forecast Tool:**
```python
# apps/ml-service/app/agentic_ai/tools/forecast_tool.py
from app.models.prophet_model import ProphetModel

class ForecastTool:
    def __init__(self):
        self.model = ProphetModel()
    
    async def execute(self, context: dict) -> dict:
        """Execute forecasting"""
        product_id = context.get("product_id")
        periods = context.get("periods", 30)
        
        # Get historical data
        historical_data = await self._fetch_data(product_id)
        
        # Train and predict
        self.model.train(historical_data)
        forecast = self.model.predict(periods)
        
        return {
            "forecast": forecast.to_dict(),
            "product_id": product_id,
            "periods": periods
        }
```

**Data Analysis Tool:**
```python
# apps/ml-service/app/agentic_ai/tools/data_analysis_tool.py
import pandas as pd

class DataAnalysisTool:
    async def execute(self, context: dict) -> dict:
        """Analyze sales data"""
        data = context.get("data")
        
        analysis = {
            "total_sales": data["sales"].sum(),
            "average_sales": data["sales"].mean(),
            "trend": self._calculate_trend(data),
            "top_products": self._get_top_products(data),
            "insights": self._generate_insights(data)
        }
        
        return analysis
    
    def _calculate_trend(self, data):
        """Calculate sales trend"""
        # Simple linear regression
        from sklearn.linear_model import LinearRegression
        X = data.index.values.reshape(-1, 1)
        y = data["sales"].values
        model = LinearRegression().fit(X, y)
        return "increasing" if model.coef_[0] > 0 else "decreasing"
```


#### 6. Prompt Engineering

```python
# apps/ml-service/app/prompts/sales_prompts.py
class SalesPrompts:
    @staticmethod
    def forecast_prompt(product_name: str, forecast_data: dict) -> str:
        return f"""
You are a sales analyst AI. Analyze this forecast for {product_name}:

Forecast Data:
{forecast_data}

Provide:
1. Summary of predicted sales trend
2. Key insights (peaks, dips, patterns)
3. Recommendations for inventory management
4. Risk factors to consider

Be concise and actionable.
"""
    
    @staticmethod
    def insight_prompt(analysis: dict) -> str:
        return f"""
You are a business intelligence AI. Here's the sales analysis:

Total Sales: {analysis['total_sales']}
Average: {analysis['average_sales']}
Trend: {analysis['trend']}
Top Products: {analysis['top_products']}

Provide:
1. Key business insights
2. Opportunities for growth
3. Areas of concern
4. Actionable recommendations

Be specific and data-driven.
"""
```

#### 7. API Endpoint

```python
# apps/ml-service/app/api/routes/agentic_ai.py
from fastapi import APIRouter
from app.agentic_ai.agent import SalesAIAgent

router = APIRouter()
agent = SalesAIAgent()

@router.post("/query")
async def ai_query(request: dict):
    """Process AI query"""
    query = request.get("query")
    context = request.get("context", {})
    
    result = await agent.process_query(query, context)
    
    return result
```

**Example usage:**
```bash
curl -X POST http://localhost:8000/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What will be the sales forecast for next month?",
    "context": {
      "product_id": "prod_123",
      "periods": 30
    }
  }'
```


#### 8. Why Agentic AI?

**Benefits:**
- **Intelligent insights**: Not just data, but actionable recommendations
- **Natural language**: Users ask questions in plain English
- **Autonomous reasoning**: AI figures out what tools to use
- **Contextual**: Understands business context and history
- **Cost-effective**: Open-source models, no API fees

**Use cases in this project:**
- "What products should I stock more of?"
- "Explain this sales trend"
- "Predict demand for next quarter"
- "Why are sales dropping?"
- "Recommend pricing strategy"

**Comparison:**

| Traditional ML | Agentic AI |
|---------------|------------|
| Fixed predictions | Reasoning + predictions |
| Requires specific inputs | Natural language queries |
| Single-purpose | Multi-purpose |
| No explanation | Explains reasoning |
| Static | Adaptive |

#### 9. Model Selection

**Available models (via Ollama):**
- **Llama 2** (7B, 13B, 70B): General purpose, good reasoning
- **Mistral** (7B): Fast, efficient, good for business tasks
- **CodeLlama**: Code generation and analysis
- **Mixtral** (8x7B): High quality, mixture of experts

**Recommendation for this project:**
- **Development**: Llama 2 7B (fast, good enough)
- **Production**: Mistral 7B or Mixtral 8x7B (better quality)

**Trade-offs:**
- Larger models = better quality but slower
- Smaller models = faster but less capable
- Local deployment = privacy but requires good hardware


---

## Deployment Guide

### Local Development

Already covered in README.md. Quick recap:

```bash
# 1. Install dependencies
pnpm install
cd apps/ml-service && pip install -r requirements.txt

# 2. Start MongoDB
docker-compose up -d mongodb

# 3. Start services (3 terminals)
pnpm --filter web dev          # Frontend: localhost:3000
pnpm --filter api start:dev    # API: localhost:3001
cd apps/ml-service && python -m uvicorn main:app --reload --port 8000
```

### Production Deployment (Free Tier)

#### 1. MongoDB Atlas (Database)

**Steps:**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create M0 (free) cluster
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (allow all)
6. Get connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/enterprise-sales-ai?retryWrites=true&w=majority
```

**Cost:** $0/month (512MB storage, shared CPU)

#### 2. Vercel (Frontend)

**Steps:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Configure:
   - **Root Directory**: `apps/web`
   - **Framework**: Next.js
   - **Build Command**: `cd ../.. && pnpm install && pnpm --filter web build`
   - **Output Directory**: `.next`

5. Environment variables:
```bash
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml.onrender.com
```

6. Deploy

**Cost:** $0/month (100GB bandwidth, unlimited sites)


#### 3. Render (Backend API)

**Steps:**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Name**: enterprise-sales-api
   - **Root Directory**: `apps/api`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: Free

5. Environment variables:
```bash
MONGODB_URI=mongodb+srv://...  # From Atlas
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3001
```

6. Deploy

**Cost:** $0/month (750 hours/month, sleeps after 15min inactivity)

#### 4. Render (ML Service)

**Steps:**
1. Create another Web Service on Render
2. Configure:
   - **Name**: enterprise-sales-ml
   - **Root Directory**: `apps/ml-service`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

3. Environment variables:
```bash
CORS_ORIGINS=https://your-app.vercel.app,https://your-api.onrender.com
AI_MODEL_URL=http://localhost:11434  # Note: Ollama won't work on free tier
AI_MODEL_NAME=llama2
```

**Note:** Ollama requires persistent storage and more resources. For free tier, consider:
- Using OpenAI API instead (pay per use)
- Disabling AI features
- Upgrading to paid Render plan ($7/month)

**Cost:** $0/month (same limits as API)


#### 5. Railway (Alternative to Render)

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub
4. Add services:
   - **API**: `apps/api`
   - **ML Service**: `apps/ml-service`

5. Configure build:
```toml
# railway.toml (in apps/api/)
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start:prod"
```

**Cost:** $5 free credit/month (then $0.000231/GB-hour)

#### 6. Docker Deployment (Self-hosted)

**Using Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  api:
    build:
      context: ./apps/api
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/enterprise-sales-ai
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  ml-service:
    build:
      context: ./apps/ml-service
    ports:
      - "8000:8000"
    environment:
      - CORS_ORIGINS=http://localhost:3000
    depends_on:
      - mongodb

  web:
    build:
      context: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
      - NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
    depends_on:
      - api
      - ml-service

volumes:
  mongo-data:
```

**Deploy:**
```bash
docker-compose up -d
```

**Cost:** Depends on hosting (DigitalOcean, AWS, etc.)


#### 7. Environment Variables Summary

**Frontend (.env):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

**Backend (.env):**
```bash
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=7d
NODE_ENV=development
PORT=3001
```

**ML Service (.env):**
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
AI_MODEL_URL=http://localhost:11434
AI_MODEL_NAME=llama2
PORT=8000
```

#### 8. Deployment Checklist

**Before deploying:**
- [ ] Update all environment variables
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS origins
- [ ] Test all API endpoints
- [ ] Run production build locally
- [ ] Check MongoDB connection
- [ ] Verify Ollama setup (if using)
- [ ] Update API URLs in frontend

**After deploying:**
- [ ] Test authentication flow
- [ ] Verify database operations
- [ ] Test ML predictions
- [ ] Check AI agent responses
- [ ] Monitor error logs
- [ ] Set up monitoring (optional)

#### 9. Monitoring & Logs

**Vercel:**
- Dashboard → Your Project → Logs
- Real-time function logs
- Analytics included

**Render:**
- Dashboard → Service → Logs
- Real-time streaming logs
- Metrics (CPU, memory)

**Railway:**
- Project → Service → Logs
- Metrics dashboard
- Deployment history


---

## Models & Technologies

### Frontend Technologies

| Technology | Version | Purpose | Why We Use It |
|-----------|---------|---------|---------------|
| **Next.js** | 14 | React framework | Server-side rendering, App Router, optimized performance, SEO |
| **React** | 18 | UI library | Component-based, large ecosystem, industry standard |
| **TypeScript** | 5.3 | Type system | Type safety, better IDE support, fewer runtime errors |
| **Tailwind CSS** | 3.x | CSS framework | Utility-first, fast development, consistent design |
| **Axios** | 1.6 | HTTP client | Promise-based, interceptors, better error handling |

**Why Next.js 14:**
- **App Router**: Better performance, nested layouts, streaming
- **Server Components**: Reduce client-side JavaScript
- **Built-in optimization**: Image optimization, font optimization
- **API routes**: Backend functionality in same codebase
- **Vercel deployment**: One-click deployment, edge functions

**Why TypeScript:**
- Catch bugs at compile time
- Better refactoring support
- Self-documenting code
- Industry standard for large projects

**Why Tailwind:**
- Faster than writing custom CSS
- Consistent design system
- Smaller bundle size (purges unused styles)
- Responsive design utilities

### Backend Technologies

| Technology | Version | Purpose | Why We Use It |
|-----------|---------|---------|---------------|
| **NestJS** | 10 | Node.js framework | TypeScript-first, modular, scalable, enterprise-ready |
| **Mongoose** | 8 | MongoDB ODM | Schema validation, middleware, TypeScript support |
| **Passport** | 0.7 | Authentication | Strategy-based, flexible, well-tested |
| **JWT** | 10 | Token auth | Stateless, scalable, secure |
| **class-validator** | 0.14 | Validation | Decorator-based, type-safe, automatic validation |

**Why NestJS:**
- **TypeScript native**: Full type safety
- **Modular architecture**: Easy to scale and maintain
- **Dependency injection**: Testable, loosely coupled
- **Built-in features**: Guards, interceptors, pipes, middleware
- **Similar to Angular**: Familiar for Angular developers
- **Great documentation**: Easy to learn

**Why Mongoose:**
- **Schema validation**: Ensure data integrity
- **Middleware**: Pre/post hooks for business logic
- **Population**: Easy relationships between collections
- **TypeScript support**: Type-safe database operations

**Why JWT:**
- **Stateless**: No server-side session storage
- **Scalable**: Works across multiple servers
- **Mobile-friendly**: Easy to use in mobile apps
- **Secure**: Signed tokens prevent tampering


### ML Technologies

| Technology | Version | Purpose | Why We Use It |
|-----------|---------|---------|---------------|
| **FastAPI** | 0.104 | Python web framework | Fast, async, automatic docs, type hints |
| **Prophet** | 1.1+ | Time series forecasting | Business-focused, handles seasonality, robust |
| **XGBoost** | 2.0+ | Gradient boosting | High accuracy, fast, feature importance |
| **scikit-learn** | 1.3+ | ML library | Standard algorithms, preprocessing, evaluation |
| **Pandas** | 2.1+ | Data manipulation | DataFrame operations, time series support |
| **NumPy** | 1.26+ | Numerical computing | Array operations, mathematical functions |
| **Pydantic** | 2.5 | Data validation | Type validation, automatic docs, FastAPI integration |

**Why FastAPI:**
- **Fast**: Comparable to Node.js and Go
- **Async**: Handle multiple requests efficiently
- **Type hints**: Python 3.6+ type annotations
- **Automatic docs**: Swagger UI and ReDoc included
- **Easy to learn**: Intuitive API design

**Why Prophet:**
- **Designed for business**: Handles business time series patterns
- **Automatic seasonality**: Detects daily, weekly, yearly patterns
- **Robust to missing data**: Handles gaps in data
- **Interpretable**: Clear trend and seasonality components
- **Easy to use**: Minimal configuration needed
- **Facebook-backed**: Well-maintained, production-tested

**Why XGBoost:**
- **State-of-the-art**: Wins many ML competitions
- **Fast training**: Optimized C++ implementation
- **Feature importance**: Understand what drives predictions
- **Handles missing values**: Built-in support
- **Regularization**: Prevents overfitting

**Why scikit-learn:**
- **Standard library**: Industry standard for ML
- **Consistent API**: Easy to switch between algorithms
- **Preprocessing**: Scalers, encoders, feature selection
- **Evaluation**: Metrics, cross-validation, model selection


### AI Technologies

| Technology | Version | Purpose | Why We Use It |
|-----------|---------|---------|---------------|
| **Ollama** | 0.1+ | LLM runtime | Local LLM deployment, multiple models, easy setup |
| **Llama 2** | 7B/13B/70B | Language model | Open-source, good reasoning, no API costs |
| **LangChain** | 0.1+ | LLM framework | Agent orchestration, tool integration, chains |

**Why Ollama:**
- **Local deployment**: No external API calls, data privacy
- **Multiple models**: Easy to switch between models
- **No API costs**: Run unlimited queries
- **Simple API**: REST API for easy integration
- **Optimized**: Fast inference on consumer hardware

**Why Llama 2:**
- **Open-source**: Free to use, no licensing fees
- **Good quality**: Comparable to GPT-3.5 for many tasks
- **Multiple sizes**: Choose based on hardware (7B, 13B, 70B)
- **Commercial use**: Allowed for commercial applications
- **Active community**: Lots of resources and support

**Why LangChain:**
- **Agent framework**: Build autonomous AI agents
- **Tool integration**: Connect LLMs to external tools
- **Memory**: Maintain conversation context
- **Chains**: Compose complex workflows
- **Prompt templates**: Reusable prompt patterns

**Alternative AI Options:**

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Ollama (Local)** | Privacy, no costs, unlimited | Requires good hardware | $0 |
| **OpenAI API** | High quality, no hardware needed | API costs, data sent to OpenAI | ~$0.002/1K tokens |
| **Anthropic Claude** | Good reasoning, large context | API costs | ~$0.008/1K tokens |
| **Google Gemini** | Multimodal, free tier | Limited free tier | Free tier available |
| **Hugging Face** | Many models, free inference API | Rate limits on free tier | Free tier available |

**Recommendation:**
- **Development**: Ollama with Llama 2 7B (fast, free)
- **Production (low budget)**: Ollama with Mistral 7B
- **Production (high quality)**: OpenAI GPT-4 or Claude 3


### Database Technology

| Technology | Version | Purpose | Why We Use It |
|-----------|---------|---------|---------------|
| **MongoDB** | 8.0 | NoSQL database | Flexible schema, JSON-like documents, scalable |
| **Mongoose** | 8.0 | ODM | Schema validation, middleware, TypeScript support |

**Why MongoDB:**
- **Flexible schema**: Easy to evolve data models
- **JSON-like**: Natural fit for JavaScript/TypeScript
- **Scalability**: Horizontal scaling with sharding
- **Rich queries**: Powerful aggregation framework
- **Atlas free tier**: Easy cloud deployment
- **Time series**: Good for sales data over time
- **Indexing**: Fast queries on large datasets

**MongoDB vs SQL:**

| Feature | MongoDB | SQL (PostgreSQL) |
|---------|---------|------------------|
| **Schema** | Flexible | Fixed |
| **Scaling** | Horizontal (sharding) | Vertical (bigger server) |
| **Joins** | Limited (population) | Full support |
| **Transactions** | Supported (4.0+) | Full ACID |
| **Learning curve** | Easier | Steeper |
| **Use case** | Flexible data, rapid development | Complex relationships, strict schema |

**Why MongoDB for this project:**
- Sales data varies by product (flexible schema)
- Rapid development (no migrations)
- Easy to add new fields
- Good for time-series data
- Free cloud hosting (Atlas)

### Package Manager

| Technology | Purpose | Why We Use It |
|-----------|---------|---------------|
| **pnpm** | Package manager | Fast, disk-efficient, strict, workspace support |

**Why pnpm over npm/yarn:**
- **Faster**: Parallel installation, content-addressable storage
- **Disk efficient**: Shared dependencies across projects
- **Strict**: Prevents phantom dependencies
- **Workspace support**: Perfect for monorepos
- **Compatible**: Works with npm packages

**Comparison:**

| Feature | pnpm | npm | yarn |
|---------|------|-----|------|
| **Speed** | ⚡⚡⚡ | ⚡ | ⚡⚡ |
| **Disk usage** | 📦 | 📦📦📦 | 📦📦 |
| **Workspaces** | ✅ | ✅ | ✅ |
| **Strict mode** | ✅ | ❌ | ❌ |


---

## How It All Works Together

### Complete Request Flow Example

**Scenario:** User wants to see sales forecast for a product

```
1. User clicks "Forecast" button in frontend
   ↓
2. Frontend (Next.js) sends request:
   POST http://localhost:3001/api/forecast
   Body: { productId: "prod_123", periods: 30 }
   ↓
3. Backend API (NestJS) receives request:
   - JWT Guard validates user token
   - ForecastController handles request
   - ForecastService processes logic
   ↓
4. Backend calls ML Service:
   POST http://localhost:8000/api/v1/predictions/forecast
   Body: { product_id: "prod_123", periods: 30 }
   ↓
5. ML Service (FastAPI) processes:
   - Fetches historical sales from MongoDB
   - Preprocesses data (cleaning, feature engineering)
   - Loads Prophet model
   - Generates forecast
   - Returns predictions
   ↓
6. Backend receives ML response:
   - Validates response
   - Saves forecast to MongoDB (optional)
   - Returns to frontend
   ↓
7. Frontend displays:
   - Chart with predictions
   - Confidence intervals
   - Key insights
```

### Data Flow Diagram

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port 3000     │
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐      ┌──────────────┐
│   Backend API   │◄────►│   MongoDB    │
│   (NestJS)      │      │   Port 27017 │
│   Port 3001     │      └──────────────┘
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐      ┌──────────────┐
│   ML Service    │◄────►│   Ollama     │
│   (FastAPI)     │      │   Port 11434 │
│   Port 8000     │      └──────────────┘
└─────────────────┘
```

### Technology Stack Summary

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│  Next.js 14 + React + TypeScript        │
│  Tailwind CSS + Axios                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           APPLICATION LAYER             │
│  NestJS + TypeScript + Passport         │
│  JWT Auth + Class Validator             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│              DATA LAYER                 │
│  MongoDB + Mongoose ODM                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          INTELLIGENCE LAYER             │
│  Python + FastAPI + Prophet + XGBoost   │
│  Ollama + Llama 2 + LangChain           │
└─────────────────────────────────────────┘
```


---

## Quick Reference

### Common Commands

**Development:**
```bash
# Install all dependencies
pnpm install

# Start all services
pnpm dev                              # Frontend + API
cd apps/ml-service && python -m uvicorn main:app --reload

# Individual services
pnpm --filter web dev                 # Frontend only
pnpm --filter api start:dev           # API only

# Build for production
pnpm build

# Run tests
pnpm test
```

**Database:**
```bash
# Start MongoDB (Docker)
docker-compose up -d mongodb

# Connect to MongoDB
mongosh mongodb://localhost:27017/enterprise-sales-ai

# View collections
show collections

# Query data
db.products.find()
db.sales.find().limit(10)
```

**Ollama:**
```bash
# Install model
ollama pull llama2

# Run Ollama server
ollama serve

# Test model
ollama run llama2 "Hello, how are you?"

# List installed models
ollama list
```

### Project URLs

| Service | Local URL | Purpose |
|---------|-----------|---------|
| Frontend | http://localhost:3000 | User interface |
| API | http://localhost:3001/api | Backend API |
| API Docs | http://localhost:3001/api/docs | Swagger documentation |
| ML Service | http://localhost:8000 | ML predictions |
| ML Docs | http://localhost:8000/docs | FastAPI documentation |
| MongoDB | mongodb://localhost:27017 | Database |
| Ollama | http://localhost:11434 | LLM API |


### File Naming Conventions

**Frontend:**
- Pages: `page.tsx` (Next.js App Router)
- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Hooks: `useCamelCase.ts` (e.g., `useProducts.ts`)
- Services: `camelCase.ts` (e.g., `productsApi.ts`)
- Types: `index.ts` or `types.ts`

**Backend:**
- Modules: `kebab-case/` (e.g., `user-profile/`)
- Controllers: `kebab-case.controller.ts`
- Services: `kebab-case.service.ts`
- Schemas: `kebab-case.schema.ts`
- DTOs: `kebab-case.dto.ts`

**ML Service:**
- Routes: `snake_case.py` (e.g., `prediction.py`)
- Models: `snake_case_model.py` (e.g., `prophet_model.py`)
- Classes: `PascalCase` (e.g., `ProphetModel`)
- Functions: `snake_case` (e.g., `clean_data`)

### Key Concepts

**Monorepo:**
- Single repository with multiple projects
- Shared dependencies and tooling
- Easier to maintain and version

**Microservices:**
- Independent services that communicate via APIs
- Each service has its own responsibility
- Can be deployed and scaled independently

**ODM (Object-Document Mapping):**
- Maps JavaScript objects to MongoDB documents
- Provides schema validation and type safety
- Similar to ORM for SQL databases

**JWT (JSON Web Token):**
- Stateless authentication
- Token contains user info and signature
- No server-side session storage needed

**Property-Based Testing:**
- Tests properties that should always be true
- Generates random test cases
- Finds edge cases automatically

**Agentic AI:**
- AI that can reason and take actions
- Uses tools to accomplish tasks
- More than just question-answering


---

## Troubleshooting

### Common Issues

**1. MongoDB connection failed**
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Start MongoDB
docker-compose up -d mongodb

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai
```

**2. Port already in use**
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in .env or package.json
```

**3. pnpm command not found**
```bash
# Install pnpm globally
npm install -g pnpm

# Or use npx
npx pnpm install
```

**4. Python dependencies fail to install**
```bash
# Use specific Python version
py -3.12 -m pip install -r requirements.txt

# Or create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

**5. Ollama not responding**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull model if not exists
ollama pull llama2
```

**6. CORS errors**
```bash
# Update CORS_ORIGINS in ML service .env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Restart ML service
```

**7. JWT authentication fails**
```bash
# Check JWT_SECRET is set in backend .env
JWT_SECRET=your-secret-key

# Clear browser cookies/localStorage
# Re-login
```


---

## Next Steps

### For New Developers

1. **Setup environment:**
   - Install Node.js 18+, pnpm, Python 3.10+
   - Clone repository
   - Run `pnpm install`
   - Setup MongoDB (Docker or local)
   - Install Ollama (optional)

2. **Understand the codebase:**
   - Read this document
   - Explore folder structure
   - Run the app locally
   - Check API documentation (Swagger)

3. **Make your first change:**
   - Add a new field to Product schema
   - Create a new API endpoint
   - Add a new page in frontend
   - Test end-to-end

4. **Learn the tools:**
   - Next.js documentation
   - NestJS documentation
   - FastAPI documentation
   - MongoDB documentation

### For Adding Features

1. **Plan the feature:**
   - What data do you need? (MongoDB schema)
   - What API endpoints? (Backend routes)
   - What UI components? (Frontend pages)
   - Any ML requirements? (ML service)

2. **Backend first:**
   - Create schema
   - Create DTOs
   - Implement service
   - Create controller
   - Test with Swagger

3. **Frontend next:**
   - Create API client
   - Create components
   - Add routing
   - Test in browser

4. **ML if needed:**
   - Add route in ML service
   - Implement model/logic
   - Connect from backend
   - Test predictions

### Resources

**Documentation:**
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Ollama Docs](https://ollama.ai/docs)

**Tutorials:**
- [Next.js Tutorial](https://nextjs.org/learn)
- [NestJS Tutorial](https://docs.nestjs.com/first-steps)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Prophet Tutorial](https://facebook.github.io/prophet/docs/quick_start.html)

---

## Summary

This project is a modern, scalable enterprise application that combines:
- **Next.js** for a fast, SEO-friendly frontend
- **NestJS** for a robust, type-safe backend
- **MongoDB** for flexible data storage
- **Python ML** for accurate predictions
- **Agentic AI** for intelligent insights

The architecture is designed for:
- **Scalability**: Each service can scale independently
- **Maintainability**: Clear separation of concerns
- **Developer experience**: TypeScript, hot reload, automatic docs
- **Cost-effectiveness**: Free tier deployment options
- **Future-proof**: Easy to add new features and technologies

**Key takeaways:**
- Monorepo structure for easier management
- Microservices for flexibility and scaling
- Type safety throughout (TypeScript + Pydantic)
- Modern ML with Prophet and XGBoost
- Open-source AI with Ollama
- Free deployment options available

---

**Last Updated:** February 15, 2026  
**Version:** 1.0.0  
**Maintained by:** Development Team
