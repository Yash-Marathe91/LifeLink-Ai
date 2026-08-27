from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings

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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.api import auth, api_keys, ai_intelligence

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(api_keys.router, prefix=settings.API_V1_STR)
app.include_router(ai_intelligence.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "FLOOD_DISASTER_ACTIVE"
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to LifeLink AI Mission Control API Gateway",
        "docs": "/docs",
        "health": "/health"
    }
