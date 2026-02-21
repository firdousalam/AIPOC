# System Architecture Overview

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Web Browser    │         │   Mobile App     │         │
│  │   (Next.js)      │         │  (React Native)  │         │
│  │   Port: 3000     │         │   (Future)       │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              NestJS Backend API                       │  │
│  │              Port: 5000                               │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Auth Module  │  Products  │  Sales  │ Inventory│  │  │
│  │  │  JWT Guards   │  Settings  │  Users  │ Insights │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    DATABASE LAYER        │  │    ML SERVICE LAYER      │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │   MongoDB          │  │  │  │  Python FastAPI    │  │
│  │   Port: 27017      │  │  │  │  Port: 8000        │  │
│  │                    │  │  │  │                    │  │
│  │  Collections:      │  │  │  │  - Forecasting     │  │
│  │  - products        │  │  │  │  - Prophet Model   │  │
│  │  - sales           │  │  │  │  - LSTM Model      │  │
│  │  - inventory       │  │  │  │  - Agentic AI      │  │
│  │  - users           │  │  │  │  - Data Analysis   │  │
│  │  - categories      │  │  │  └────────────────────┘  │
│  │  - companies       │  │  └──────────────────────────┘
│  │  - distributors    │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

---

## 📦 Technology Stack

### Frontend (apps/web)
```
Framework: Next.js 14 (React 18)
Language: TypeScript
Styling: Tailwind CSS
State Management: React Hooks (useState, useEffect)
HTTP Client: Axios
UI Components: Custom components
Icons: Lucide React
Date Handling: date-fns
Excel Export: xlsx
```

### Backend API (apps/api)
```
Framework: NestJS 10
Language: TypeScript
Runtime: Node.js
Database ODM: Mongoose
Authentication: JWT (Passport)
Validation: class-validator, class-transformer
Password Hashing: bcrypt
Environment: dotenv
```

### ML Service (apps/ml-service)
```
Framework: FastAPI
Language: Python 3.11+
ML Libraries: Prophet, TensorFlow/PyTorch
Data Processing: Pandas, NumPy
AI: LangChain, OpenAI
```

### Database
```
Database: MongoDB 6.0+
Type: NoSQL Document Database
Hosting: Local / MongoDB Atlas
```

---

## 🗂️ Project Structure

```
AIPOC/
├── apps/
│   ├── api/                    # Backend NestJS API
│   │   ├── src/
│   │   │   ├── modules/        # Feature modules
│   │   │   │   ├── auth/       # Authentication & JWT
│   │   │   │   ├── products/   # Product management
│   │   │   │   ├── sales/      # Sales transactions
│   │   │   │   ├── inventory/  # Stock management
│   │   │   │   ├── users/      # User management
│   │   │   │   ├── settings/   # Master data
│   │   │   │   ├── insights/   # Analytics
│   │   │   │   └── forecast/   # ML predictions
│   │   │   ├── common/         # Shared guards, decorators
│   │   │   ├── config/         # Configuration files
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── app.module.ts   # Root module
│   │   │   └── main.ts         # Entry point
│   │   ├── dist/               # Compiled output
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/            # App router pages
│   │   │   │   ├── dashboard/  # Dashboard pages
│   │   │   │   │   ├── page.tsx           # Dashboard home
│   │   │   │   │   ├── products/          # Products CRUD
│   │   │   │   │   ├── sales/             # Sales CRUD
│   │   │   │   │   ├── inventory/         # Inventory CRUD
│   │   │   │   │   ├── categories/        # Categories
│   │   │   │   │   ├── companies/         # Companies
│   │   │   │   │   └── distributors/      # Distributors
│   │   │   │   ├── login/      # Login page
│   │   │   │   └── register/   # Register page
│   │   │   ├── components/     # Reusable components
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   ├── utils/          # Utility functions
│   │   │   │   └── constants.ts # Currency, constants
│   │   │   └── lib/            # API client, helpers
│   │   ├── public/             # Static assets
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ml-service/             # Python ML Service
│       ├── app/
│       │   ├── api/            # FastAPI routes
│       │   ├── models/         # ML models
│       │   │   ├── prophet_model.py
│       │   │   └── lstm_model.py
│       │   ├── inference/      # Prediction logic
│       │   ├── agentic_ai/     # AI agents
│       │   │   ├── agent.py
│       │   │   ├── llm_client.py
│       │   │   └── tools/      # AI tools
│       │   └── main.py
│       ├── requirements.txt
│       └── Dockerfile
│
├── scripts/                    # Utility scripts
│   ├── generate-sample-data.ts # Generate test data
│   ├── generate-inventory.ts   # Initialize inventory
│   ├── generate-new-sales.ts   # Generate sales data
│   └── README.md
│
├── docs/                       # Documentation
│   ├── USER_GUIDE.md           # Complete user guide
│   ├── QUICK_START.md          # Quick start guide
│   ├── FEATURE_ROADMAP.md      # Future features
│   ├── ARCHITECTURE_OVERVIEW.md # This file
│   └── [other docs]
│
├── .env                        # Environment variables
├── .env.example                # Environment template
├── package.json                # Root package.json
└── README.md                   # Project README
```

---

## 🔄 Data Flow

### 1. User Authentication Flow
```
User → Login Page → POST /auth/login
                    ↓
              Validate credentials
                    ↓
              Generate JWT token
                    ↓
              Return token + user data
                    ↓
              Store in localStorage
                    ↓
              Redirect to Dashboard
```

### 2. Create Sale Flow
```
User → Sales Page → Click "Add Sale"
                    ↓
              Fill form (products, customer, payment)
                    ↓
              POST /sales
                    ↓
              Backend validates:
              - JWT token
              - Product exists
              - Stock available
                    ↓
              If valid:
              - Create sale record
              - Deduct from inventory
              - Return success
                    ↓
              Frontend:
              - Close modal
              - Refresh sales list
              - Show success message
```

### 3. Inventory Check Flow
```
Sale Creation → Check Stock
                    ↓
              GET /inventory/check/:productId
                    ↓
              Query inventory collection
                    ↓
              Return { available: boolean, currentStock: number }
                    ↓
              If insufficient:
              - Throw error
              - Show error message
              - Prevent sale
```

### 4. ML Forecasting Flow (Future)
```
User → Request Forecast
                    ↓
              GET /forecast/:productId
                    ↓
              API → ML Service (HTTP)
                    ↓
              ML Service:
              - Fetch historical sales
              - Run Prophet/LSTM model
              - Generate predictions
                    ↓
              Return forecast data
                    ↓
              Display chart on frontend
```

---

## 🔐 Security Architecture

### Authentication
```
1. User registers → Password hashed with bcrypt (10 rounds)
2. User logs in → Validate password → Generate JWT
3. JWT contains: { userId, email, role }
4. JWT expires in 24 hours
5. Frontend stores JWT in localStorage
6. Every API request includes: Authorization: Bearer <token>
```

### Authorization
```
Guards:
- JwtAuthGuard: Validates JWT token
- SuperAdminGuard: Checks if user is super admin
- RolesGuard: Checks user role/permissions (future)

Usage:
@UseGuards(JwtAuthGuard)
@UseGuards(SuperAdminGuard)
```

### Data Validation
```
DTOs (Data Transfer Objects):
- class-validator decorators
- Automatic validation in NestJS
- Type safety with TypeScript

Example:
@IsString()
@IsNotEmpty()
name: string;

@IsNumber()
@Min(0)
price: number;
```

---

## 💾 Database Schema

### Products Collection
```typescript
{
  _id: ObjectId,
  name: string,
  sku: string (unique),
  barcode: string,
  costPrice: number,        // Cost from supplier
  salePrice: number,        // Selling price
  mrp: number,              // Maximum retail price
  category: ObjectId,       // Reference to Category
  company: ObjectId,        // Reference to Company
  distributor: ObjectId,    // Reference to Distributor
  description: string,
  expiryDate: Date,
  manufacturingDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Sales Collection
```typescript
{
  _id: ObjectId,
  items: [
    {
      product: ObjectId,    // Reference to Product
      productName: string,  // Denormalized for performance
      quantity: number,
      unitPrice: number,
      totalPrice: number
    }
  ],
  customer: {
    name: string,           // Default: "Cash"
    email: string,
    mobile: string,
    panOrVoterId: string
  },
  paymentMethod: string,    // Default: "Cash"
  totalAmount: number,
  saleDate: Date,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Collection
```typescript
{
  _id: ObjectId,
  productId: ObjectId (unique), // One inventory per product
  productName: string,          // Denormalized
  quantity: number,
  location: string,
  reorderLevel: number,
  lastRestocked: Date,
  status: string,               // Calculated field
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  name: string,
  role: string,                 // 'super_admin', 'admin', 'user'
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login user
GET    /auth/profile           # Get current user
```

### Products
```
GET    /products               # List products (paginated)
GET    /products/:id           # Get single product
POST   /products               # Create product
PUT    /products/:id           # Update product
DELETE /products/:id           # Delete product
```

### Sales
```
GET    /sales                  # List sales (paginated)
GET    /sales/:id              # Get single sale
POST   /sales                  # Create sale
PUT    /sales/:id              # Update sale
DELETE /sales/:id              # Delete sale
```

### Inventory
```
GET    /inventory              # List inventory
GET    /inventory/:id          # Get single inventory
POST   /inventory              # Create inventory
PUT    /inventory/:id          # Update inventory
DELETE /inventory/:id          # Delete inventory
GET    /inventory/low-stock    # Get low stock items
GET    /inventory/check/:productId  # Check stock availability
```

### Settings
```
GET    /settings/categories    # List categories
POST   /settings/categories    # Create category
PUT    /settings/categories/:id # Update category
DELETE /settings/categories/:id # Delete category

GET    /settings/companies     # List companies
POST   /settings/companies     # Create company
PUT    /settings/companies/:id # Update company
DELETE /settings/companies/:id # Delete company

GET    /settings/distributors  # List distributors
POST   /settings/distributors  # Create distributor
PUT    /settings/distributors/:id # Update distributor
DELETE /settings/distributors/:id # Delete distributor
```

---

## 🚀 Performance Optimizations

### Current Optimizations
1. **Server-side Pagination**: Fetch only needed data (20/50/100 items)
2. **Debounced Search**: 500ms delay to reduce API calls
3. **Indexed Fields**: MongoDB indexes on frequently queried fields
4. **Denormalization**: Store productName in sales/inventory for faster reads

### Future Optimizations
1. **Caching**: Redis for frequently accessed data
2. **Database Indexing**: Compound indexes for complex queries
3. **CDN**: Static assets on CDN
4. **Image Optimization**: Compress and resize product images
5. **Lazy Loading**: Load components on demand
6. **Virtual Scrolling**: For large lists
7. **Query Optimization**: Aggregate pipelines for reports

---

## 🧪 Testing Strategy

### Unit Tests
```
- Test individual functions
- Mock dependencies
- Tools: Jest, @nestjs/testing
- Target: 80% code coverage
```

### Integration Tests
```
- Test API endpoints
- Use test database
- Test authentication flow
- Test business logic
```

### E2E Tests
```
- Test complete user flows
- Tools: Playwright, Cypress
- Test: Login → Add Product → Create Sale → Check Inventory
```

---

## 🔄 Deployment Architecture

### Development
```
Local Machine:
- Frontend: localhost:3000
- Backend: localhost:5000
- MongoDB: localhost:27017
- ML Service: localhost:8000
```

### Production (Recommended)
```
Frontend:
- Vercel / Netlify
- CDN enabled
- Environment: production

Backend:
- Railway / Heroku / AWS EC2
- PM2 for process management
- Environment: production

Database:
- MongoDB Atlas (cloud)
- Automated backups
- Replica sets for high availability

ML Service:
- AWS Lambda / Google Cloud Run
- Serverless deployment
- Auto-scaling
```

---

## 🔧 Environment Variables

### Backend (.env)
```
# Database
MONGODB_URI=mongodb://localhost:27017/inventory-db

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Email (future)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

---

## 📊 Monitoring & Logging

### Current
```
- Console logs
- Error messages in UI
- MongoDB logs
```

### Future
```
Logging:
- Winston / Pino for structured logging
- Log levels: error, warn, info, debug
- Log rotation

Monitoring:
- Application Performance Monitoring (APM)
- Error tracking: Sentry
- Uptime monitoring: UptimeRobot
- Analytics: Google Analytics, Mixpanel

Metrics:
- API response times
- Database query performance
- Error rates
- User activity
```

---

## 🔄 CI/CD Pipeline (Future)

```
Code Push → GitHub
    ↓
GitHub Actions
    ↓
Run Tests (Unit, Integration, E2E)
    ↓
Build Application
    ↓
Deploy to Staging
    ↓
Manual Approval
    ↓
Deploy to Production
    ↓
Health Check
    ↓
Notify Team (Slack/Email)
```

---

## 🛠️ Development Workflow

### Setup
```bash
# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Start MongoDB
mongod

# Start backend
cd apps/api
npm start

# Start frontend
cd apps/web
npm run dev
```

### Adding a New Feature
```
1. Create feature branch: git checkout -b feature/new-feature
2. Backend:
   - Create module: nest g module feature
   - Create controller: nest g controller feature
   - Create service: nest g service feature
   - Create schema and DTOs
   - Add business logic
   - Test endpoints
3. Frontend:
   - Create page/component
   - Add API calls
   - Add UI
   - Test functionality
4. Commit and push
5. Create pull request
6. Code review
7. Merge to main
```

---

## 🔐 Security Best Practices

1. **Never commit .env files** - Use .env.example
2. **Hash passwords** - Use bcrypt with salt rounds ≥ 10
3. **Validate all inputs** - Use DTOs and class-validator
4. **Use HTTPS** in production
5. **Implement rate limiting** - Prevent brute force attacks
6. **Sanitize user inputs** - Prevent XSS and SQL injection
7. **Keep dependencies updated** - Regular npm audit
8. **Use environment variables** - Never hardcode secrets
9. **Implement CORS** properly
10. **Add request logging** - Track suspicious activity

---

## 📚 Additional Resources

### Documentation
- NestJS: https://docs.nestjs.com
- Next.js: https://nextjs.org/docs
- MongoDB: https://docs.mongodb.com
- Mongoose: https://mongoosejs.com/docs

### Learning
- TypeScript: https://www.typescriptlang.org/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs

---

This architecture is designed to be scalable, maintainable, and production-ready. It follows industry best practices and can be extended to support enterprise-level requirements.
