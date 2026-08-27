import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from backend.db.session import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = Column(String(36), nullable=False)
    actor_email = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False) # e.g. LOGIN, API_KEY_CREATED, DISPATCH_SENT
    resource_target = Column(String(255), nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
