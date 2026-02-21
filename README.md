# Inventory & Sales Management System

A comprehensive, production-ready enterprise application for retail businesses, distributors, and wholesalers. Track products, manage inventory, record sales, and gain AI-powered business insights.

## 📚 Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete guide on how to use the application
- **[Quick Start](docs/QUICK_START.md)** - Get started in 5 minutes
- **[Feature Roadmap](docs/FEATURE_ROADMAP.md)** - Future enhancements and industry features
- **[Architecture Overview](docs/ARCHITECTURE_OVERVIEW.md)** - Technical architecture and design
- **[Deployment Guide](docs/DEPLOYMENT-FREE.md)** - Deploy for free using Vercel, Render, MongoDB Atlas

## ✨ Key Features

- ✅ Product catalog management with cost price, sale price, and MRP
- ✅ Multi-product sales with customer information
- ✅ Real-time inventory tracking with stock validation
- ✅ Automatic stock deduction on sales
- ✅ Low stock alerts and out-of-stock prevention
- ✅ Server-side pagination for performance
- ✅ Responsive design (desktop + mobile)
- ✅ Search, filtering, and Excel export
- ✅ Dashboard with key business metrics
- ✅ Master data management (categories, companies, distributors)
- ✅ JWT authentication and role-based access
- 🔄 AI-powered demand forecasting (ML service ready)

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: NestJS
- **ML Service**: Python FastAPI
- **Database**: MongoDB
- **AI Models**: Open-source agentic AI models (Ollama/Local LLM)
- **Containerization**: Docker & Docker Compose

## Project Structure

```
enterprise-sales-ai/
├── apps/
│   ├── web/          # Next.js Frontend
│   ├── api/          # NestJS Backend
│   └── ml-service/   # Python FastAPI ML Service
├── packages/         # Shared packages
└── infrastructure/   # Docker & K8s configs
```

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8 (`npm install -g pnpm`)
- **Python** >= 3.10 (for ML service)
- **MongoDB** (local or Docker)

## Run locally

### 1. Clone and install

```bash
cd AIPOC
pnpm install
```

### 2. Environment file

```bash
cp .env.example .env
```

Edit `.env` if needed. Defaults work for local run:

- `MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai`
- `NEXT_PUBLIC_API_URL=http://localhost:3001`
- `NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000`

### 3. Start MongoDB

**Option A – Docker (easiest)**

```bash
cd infrastructure
docker-compose up -d mongodb
cd ..
```

**Option B – Local MongoDB**

Install and start MongoDB, then ensure it’s running on `localhost:27017`.

### 4. Start the app (3 terminals)

**Terminal 1 – Frontend**

```bash
pnpm --filter web dev
```

**Terminal 2 – API**

```bash
pnpm --filter api start:dev
```

**Terminal 3 – ML service**

```bash
cd apps/ml-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Windows:** If `uvicorn` isn’t found, use the same Python that has the packages (e.g. Store Python 3.12):
```powershell
cd apps\ml-service
py -3.12 -m uvicorn main:app --reload --port 8000
```
If you only have one Python: `python -m uvicorn main:app --reload --port 8000`

### 5. Open in browser

| App        | URL |
|-----------|-----|
| Frontend  | http://localhost:3000 |
| API       | http://localhost:3001/api |
| API docs (Swagger) | http://localhost:3001/api/docs |
| ML service | http://localhost:8000 |
| ML docs   | http://localhost:8000/docs |

### Optional: one-time setup script (Linux/macOS/Git Bash)

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Then start MongoDB and the three services as above.

## Development

### Frontend (Next.js)
```bash
cd apps/web
pnpm dev
```

### Backend (NestJS)
```bash
cd apps/api
pnpm start:dev
```

### ML Service (FastAPI)
```bash
cd apps/ml-service
uvicorn main:app --reload
```

## Building for Production

```bash
pnpm build
```

## Docker Deployment

```bash
docker-compose up -d
```

## Deploy for free

You can run this app at **$0/month** using free tiers:

| Part        | Where to deploy        |
|------------|------------------------|
| **Frontend** | [Vercel](https://vercel.com) (Next.js) |
| **API**      | [Render](https://render.com) or [Railway](https://railway.app) |
| **ML service** | Render or Railway |
| **Database**   | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free M0 cluster) |

**Step-by-step:** see **[docs/DEPLOYMENT-FREE.md](docs/DEPLOYMENT-FREE.md)** for:

- MongoDB Atlas setup
- Vercel (frontend) with monorepo
- Render (API + ML) or Railway
- Environment variables and CORS
- Optional `render.yaml` blueprint

Quick links: [Vercel](https://vercel.com) · [Render](https://render.com) · [Railway](https://railway.app) · [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📖 What Each Module Does

### Products
Master catalog of all items you sell. Tracks name, SKU, barcode, cost price (from supplier), sale price (to customer), MRP, category, company, distributor, and expiry dates.

### Sales
Record every transaction with customers. Supports multiple products per sale, customer information (name, email, mobile, PAN/Voter ID), payment methods, and automatic stock deduction.

### Inventory
Track stock levels in real-time. Prevents overselling, alerts on low stock, tracks warehouse locations, and automatically updates when sales are made.

### Settings
Configure master data: categories (product types), companies (manufacturers/brands), and distributors (suppliers).

## 🚀 Quick Usage Guide

1. **Setup Master Data**: Add categories, companies, and distributors in Settings
2. **Add Products**: Create your product catalog with pricing and details
3. **Initialize Inventory**: Set initial stock quantities for each product
4. **Make Sales**: Record transactions - system auto-validates stock and deducts inventory
5. **Monitor Dashboard**: Track revenue, sales, low stock alerts, and trends

See [Quick Start Guide](docs/QUICK_START.md) for detailed step-by-step instructions.

## 🎯 Industry Applications

- **Retail Stores**: Fast checkout, inventory tracking, barcode scanning
- **Wholesale Business**: Bulk orders, credit management, supplier tracking
- **Pharmacy**: Expiry tracking, batch management, prescription handling
- **Restaurants**: Menu management, table orders, recipe costing
- **E-commerce**: Online orders, shipping integration, marketplace sync

## 🔮 Future Enhancements

See [Feature Roadmap](docs/FEATURE_ROADMAP.md) for detailed plans:

- GST/Tax management and invoice generation
- Barcode scanning for faster checkout
- Purchase order management
- Multi-location/multi-store support
- Mobile app (React Native)
- AI demand forecasting and price optimization
- Customer insights and recommendations
- Automated reordering
- CRM and accounting integration

## 📊 Sample Data

Generate sample data for testing:

```bash
# Generate products, categories, companies, distributors
npm run generate-data

# Generate inventory entries
npm run generate-inventory

# Generate sales transactions
npm run generate-sales
```

## License

MIT

