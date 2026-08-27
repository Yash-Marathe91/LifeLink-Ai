from typing import Optional, List
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    role: str = "CITIZEN" # CITIZEN, FIELD_RESPONDER, DISPATCHER, AGENCY_ADMIN
    badge_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    phone_number: Optional[str] = None
    agency_id: Optional[str] = None
    badge_number: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    roles: List[str] = []
    is_active: bool

    class Config:
        from_attributes = True
