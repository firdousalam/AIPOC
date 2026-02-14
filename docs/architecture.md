# Architecture Documentation

## Overview

Enterprise Sales AI is a monorepo application built with:
- **Frontend**: Next.js 14 (App Router)
- **Backend**: NestJS
- **ML Service**: Python FastAPI
- **Database**: MongoDB
- **AI**: Open-source LLM (Ollama)

## System Architecture

```
┌─────────────┐
│   Next.js   │
│  Frontend   │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────┐
│   NestJS    │
│   Backend   │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
┌──────▼──────┐ ┌────▼──────┐
│  MongoDB    │ │ FastAPI   │
│  Database   │ │ ML Service│
└─────────────┘ └────┬──────┘
                      │
                      │ HTTP
                      │
                ┌─────▼─────┐
                │  Ollama   │
                │  LLM API  │
                └───────────┘
```

## Module Structure

### Frontend (Next.js)
- Modular architecture with feature-based modules
- Each module contains: components, hooks, services, types
- Shared components in packages/ui-components

### Backend (NestJS)
- Modular architecture following NestJS best practices
- Each module: controller, service, schema, DTOs
- Common guards, interceptors, and filters

### ML Service (FastAPI)
- Separate service for ML operations
- Supports multiple models: Prophet, XGBoost, LSTM
- Agentic AI integration with Ollama

## Data Flow

1. User interacts with Next.js frontend
2. Frontend calls NestJS API
3. NestJS processes request and queries MongoDB
4. For predictions, NestJS calls ML Service
5. ML Service uses trained models or queries Ollama for AI insights

## Security

- JWT authentication
- CORS configuration
- Input validation with class-validator
- Environment variable management

## Deployment

- Docker Compose for local development
- Kubernetes manifests for production scaling
- Nginx for reverse proxy (optional)

