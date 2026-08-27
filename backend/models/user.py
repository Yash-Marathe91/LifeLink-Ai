import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from backend.db.session import Base

# Association table for User <-> Role (Many-to-Many)
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', String(36), ForeignKey('users.id', ondelete="CASCADE"), primary_key=True),
    Column('role_id', String(36), ForeignKey('roles.id', ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=True)
    
    # Agency / Tenant Isolation
    agency_id = Column(String(36), ForeignKey("agencies.id"), nullable=True)
    badge_number = Column(String(50), nullable=True)
    
    # Citizen Medical Emergency Profile
    blood_group = Column(String(10), nullable=True)
    allergies = Column(String(500), nullable=True)
    chronic_conditions = Column(String(500), nullable=True)
    
    # Security & Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    agency = relationship("Agency", back_populates="users")
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
