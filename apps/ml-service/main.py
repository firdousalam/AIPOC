from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import prediction, training, agentic_ai
import uvicorn

app = FastAPI(
    title="Enterprise Sales AI - ML Service",
    description="ML and AI service for sales forecasting and predictions",
    version="1.0.0"
)

# CORS configuration (use env in production, e.g. CORS_ORIGINS=https://yourapp.vercel.app)
import os
_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction.router, prefix="/api/v1/predictions", tags=["predictions"])
app.include_router(training.router, prefix="/api/v1/training", tags=["training"])
app.include_router(agentic_ai.router, prefix="/api/v1/ai", tags=["agentic-ai"])

@app.get("/")
async def root():
    return {"message": "Enterprise Sales AI ML Service", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

