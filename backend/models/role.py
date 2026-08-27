import uuid
from sqlalchemy import Column, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.session import Base

# Association table for Role <-> Permission (Many-to-Many)
role_permissions = Table(
    'role_permissions',
    Base.metadata,
    Column('role_id', String(36), ForeignKey('roles.id', ondelete="CASCADE"), primary_key=True),
    Column('permission_id', String(36), ForeignKey('permissions.id', ondelete="CASCADE"), primary_key=True)
)

class Role(Base):
    __tablename__ = "roles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), unique=True, nullable=False, index=True) # CITIZEN, FIELD_RESPONDER, DISPATCHER, AGENCY_ADMIN, SUPER_ADMIN
    description = Column(String(255), nullable=True)

    # Relationships
    users = relationship("User", secondary="user_roles", back_populates="roles")
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(100), unique=True, nullable=False, index=True) # e.g. incident:create, incident:dispatch
    description = Column(String(255), nullable=True)

    # Relationships
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")
