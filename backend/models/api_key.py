import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.session import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    key_name = Column(String(255), nullable=False) # e.g. "NDRF Hospital ERP Integration Key"
    key_prefix = Column(String(16), nullable=False, index=True) # e.g. "ll_live_9f8a"
    hashed_key = Column(String(255), nullable=False) # Cryptographic hash of full secret
    scopes = Column(String(500), nullable=False, default="read") # e.g. "incidents:read,facilities:write"
    
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="api_keys")
