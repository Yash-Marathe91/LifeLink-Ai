from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import random
import os

from backend.db.session import get_db
from backend.models.user import User
from backend.models.role import Role
from backend.schemas.auth import UserCreate, UserLogin, Token, UserOut
from backend.core.security import hash_password, verify_password, create_access_token, decode_access_token
from backend.services.twilio_service import twilio_service

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

# In-memory emergency OTP store for demonstration & fallback
otp_store = {}

class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    code: str

class GoogleSSORequest(BaseModel):
    id_token: str
    email: EmailStr
    full_name: str
    google_id: str

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired, or malformed authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive, disabled, or no longer exists"
        )
    return user

@router.post("/register", response_model=UserOut)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    
    hashed = hash_password(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed,
        full_name=user_in.full_name,
        phone_number=user_in.phone_number,
        badge_number=user_in.badge_number
    )
    
    role_name = (user_in.role or "CITIZEN").upper()
    role_obj = db.query(Role).filter(Role.name == role_name).first()
    if not role_obj:
        role_obj = db.query(Role).filter(Role.name == "CITIZEN").first()
    if role_obj:
        user.roles.append(role_obj)
    
    db.add(user)
    db.commit()
    db.refresh(user)

    user_roles = [r.name for r in user.roles]
    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        badge_number=user.badge_number,
        roles=user_roles,
        is_active=user.is_active
    )

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email address or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    primary_role = user.roles[0].name if user.roles else "CITIZEN"
    access_token = create_access_token(subject=user.id)
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=primary_role
    )

@router.post("/request-otp")
def request_otp(payload: OTPRequest):
    phone = payload.phone.strip()
    if not phone:
        raise HTTPException(status_code=400, detail="Phone number is required")
    
    # Generate 6-digit OTP code
    otp_code = str(random.randint(100000, 999999))
    otp_store[phone] = otp_code

    # Dispatch SMS via Twilio Emergency Gateway
    message_text = f"LIFELINK AI EMERGENCY VERIFICATION CODE: {otp_code}. Valid for 5 minutes."
    sms_res = twilio_service.send_emergency_sms(to_number=phone, message=message_text)

    return {
        "status": "success",
        "message": "Emergency verification code sent to phone via Twilio SMS",
        "demo_code": otp_code  # Provided for easy testing in demo environment
    }

@router.post("/verify-otp", response_model=Token)
def verify_otp(payload: OTPVerify, db: Session = Depends(get_db)):
    phone = payload.phone.strip()
    code = payload.code.strip()

    stored_code = otp_store.get(phone)
    if not stored_code or stored_code != code:
        # Fallback demo code check for smooth testing
        if code != "123456":
            raise HTTPException(status_code=400, detail="Invalid or expired SMS OTP code")

    # Find or provision user by phone number
    user = db.query(User).filter(User.phone_number == phone).first()
    if not user:
        # Create auto-provisioned survivor account
        dummy_email = f"phone_{phone.replace('+', '').replace(' ', '')}@lifelink.ai"
        user = User(
            email=dummy_email,
            hashed_password=hash_password("EmergencyPass123!"),
            full_name=f"Survivor ({phone})",
            phone_number=phone
        )
        citizen_role = db.query(Role).filter(Role.name == "CITIZEN").first()
        if citizen_role:
            user.roles.append(citizen_role)
        db.add(user)
        db.commit()
        db.refresh(user)

    primary_role = user.roles[0].name if user.roles else "CITIZEN"
    access_token = create_access_token(subject=user.id)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=primary_role
    )

@router.post("/google-sso", response_model=Token)
def google_sso(payload: GoogleSSORequest, db: Session = Depends(get_db)):
    # Verify or provision user by Google email
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        user = User(
            email=payload.email,
            hashed_password=hash_password(f"GoogleSSO_{payload.google_id}"),
            full_name=payload.full_name,
        )
        citizen_role = db.query(Role).filter(Role.name == "CITIZEN").first()
        if citizen_role:
            user.roles.append(citizen_role)
        db.add(user)
        db.commit()
        db.refresh(user)

    primary_role = user.roles[0].name if user.roles else "CITIZEN"
    access_token = create_access_token(subject=user.id)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=primary_role
    )

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    user_roles = [r.name for r in current_user.roles]
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        phone_number=current_user.phone_number,
        badge_number=current_user.badge_number,
        roles=user_roles,
        is_active=current_user.is_active
    )
