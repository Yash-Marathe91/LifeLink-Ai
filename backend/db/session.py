from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.core.config import settings

db_url = settings.DATABASE_URL
is_sqlite = False

if "postgresql://" in db_url:
    try:
        temp_engine = create_engine(db_url, pool_pre_ping=True, echo=False)
        conn = temp_engine.connect()
        conn.close()
        engine = temp_engine
    except Exception:
        print("[DATABASE] Local PostgreSQL not initialized/reachable. Using zero-config local SQLite (lifelink_ai.db)...")
        db_url = "sqlite:///./lifelink_ai.db"
        is_sqlite = True
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    is_sqlite = True
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency for providing database session to FastAPI endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
