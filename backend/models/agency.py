import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from backend.db.session import Base

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False) # e.g. National Disaster Response Force (NDRF)
    agency_code = Column(String(50), unique=True, nullable=False, index=True) # e.g. NDRF-ALPHA
    agency_type = Column(String(50), nullable=False) # POLICE, MEDICAL, FIRE, DISASTER_RELIEF
    jurisdiction_zone = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="agency")
