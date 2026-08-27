from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.models.role import Role
from backend.schemas.auth import UserCreate, UserLogin, Token, UserOut
from backend.core.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

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
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    
    # Hash password & create user
    hashed = hash_password(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed,
        full_name=user_in.full_name,
        phone_number=user_in.phone_number,
        badge_number=user_in.badge_number
    )
    
    # Assign Role (Default: CITIZEN if role not found)
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

# Swagger UI / OAuth2 form support endpoint
@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
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

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    user_roles = [r.name for r in current_user.roles]
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        phone_number=current_user.phone_number,
        agency_id=current_user.agency_id,
        badge_number=current_user.badge_number,
        blood_group=current_user.blood_group,
        allergies=current_user.allergies,
        roles=user_roles,
        is_active=current_user.is_active
    )
