from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class APIKeyCreate(BaseModel):
    key_name: str
    scopes: str = "incidents:read,facilities:read"
    expires_in_days: Optional[int] = 30

class APIKeyOut(BaseModel):
    id: str
    key_name: str
    key_prefix: str
    scopes: str
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class APIKeyCreatedResponse(APIKeyOut):
    secret_key: str # Full plaintext key shown ONLY ONCE upon creation
