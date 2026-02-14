# Enterprise Sales AI Application

A production-ready enterprise application for sales forecasting and inventory management with AI-powered predictions.

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

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Python >= 3.10
- MongoDB >= 6.0
- Docker & Docker Compose (optional)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start MongoDB

```bash
# Using Docker
docker-compose up -d mongodb

# Or install MongoDB locally
```

### 4. Start Development Servers

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter web dev
pnpm --filter api start:dev
cd apps/ml-service && uvicorn main:app --reload
```

### 5. Access Applications

- Frontend: http://localhost:3000
- API: http://localhost:3001
- ML Service: http://localhost:8000
- API Docs: http://localhost:3001/api/docs
- ML Service Docs: http://localhost:8000/docs

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

## License

MIT

