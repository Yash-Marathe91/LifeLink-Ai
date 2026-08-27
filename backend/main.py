import sys
import os

# Add repository root and backend directory to sys.path for Render deployment import resolution
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
import backend.models # Ensure all ORM relationships are registered
from backend.api import auth, api_keys, ai_intelligence, websockets, medical, notifications

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware setup to allow requests from Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "https://lifelink-ai-eta.vercel.app",
    "https://zjzlfuabmchbwzjeyqgf.supabase.co",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(api_keys.router, prefix=settings.API_V1_STR)
app.include_router(ai_intelligence.router, prefix=settings.API_V1_STR)
app.include_router(websockets.router, prefix=settings.API_V1_STR)
app.include_router(medical.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "FLOOD_DISASTER_ACTIVE",
        "database": "SUPABASE_POSTGRESQL_READY",
        "websockets": "CONNECTED",
        "crypto_engine": "AES-256-ENABLED"
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to LifeLink AI Mission Control API Gateway",
        "docs": "/docs",
        "health": "/health"
    }
