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

## License

MIT

