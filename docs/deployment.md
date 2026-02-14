# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js >= 18
- Python >= 3.10
- MongoDB (or use Docker)

## Local Development

### 1. Clone and Setup

```bash
git clone <repository>
cd enterprise-sales-ai
pnpm install
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start MongoDB

```bash
docker-compose up -d mongodb
```

### 3. Start Services

```bash
# Start all services
pnpm dev

# Or individually:
# Frontend
cd apps/web && pnpm dev

# Backend
cd apps/api && pnpm start:dev

# ML Service
cd apps/ml-service && uvicorn main:app --reload
```

## Docker Deployment

### Build and Run

```bash
docker-compose up -d
```

### Access Services

- Frontend: http://localhost:3000
- API: http://localhost:3001/api
- ML Service: http://localhost:8000/docs

## Production Deployment

### Kubernetes

1. Build Docker images
2. Push to container registry
3. Apply Kubernetes manifests:

```bash
kubectl apply -f infrastructure/k8s/
```

### Environment Variables

Ensure all environment variables are set:
- `MONGODB_URI`
- `JWT_SECRET`
- `AI_MODEL_URL`
- `AI_MODEL_NAME`

## Database Migration

```bash
node scripts/db-seed.js
```

## Model Training

```bash
python scripts/train-model.py
```

## Backup

```bash
./scripts/backup.sh
```

