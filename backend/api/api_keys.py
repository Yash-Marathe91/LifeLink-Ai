import secrets
import hashlib
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.models.api_key import APIKey
from backend.schemas.api_key import APIKeyCreate, APIKeyOut, APIKeyCreatedResponse
from backend.core.permissions import require_role

router = APIRouter(prefix="/api-keys", tags=["Developer API Keys"])

@router.post("/", response_model=APIKeyCreatedResponse)
def create_api_key(
    key_in: APIKeyCreate,
    current_user: User = require_role(["AGENCY_ADMIN", "SUPER_ADMIN"]),
    db: Session = Depends(get_db)
):
    # Generate secret key: ll_live_ + 32 random hex chars
    raw_secret = f"ll_live_{secrets.token_hex(16)}"
    prefix = raw_secret[:12]
    hashed_key = hashlib.sha256(raw_secret.encode('utf-8')).hexdigest()
    
    expires_at = datetime.utcnow() + timedelta(days=key_in.expires_in_days) if key_in.expires_in_days else None
    
    api_key_obj = APIKey(
        key_name=key_in.key_name,
        key_prefix=prefix,
        hashed_key=hashed_key,
        scopes=key_in.scopes,
        user_id=current_user.id,
        expires_at=expires_at
    )
    
    db.add(api_key_obj)
    db.commit()
    db.refresh(api_key_obj)

    return APIKeyCreatedResponse(
        id=api_key_obj.id,
        key_name=api_key_obj.key_name,
        key_prefix=api_key_obj.key_prefix,
        scopes=api_key_obj.scopes,
        is_active=api_key_obj.is_active,
        created_at=api_key_obj.created_at,
        expires_at=api_key_obj.expires_at,
        secret_key=raw_secret # Displayed only once to the admin
    )

@router.get("/", response_model=List[APIKeyOut])
def list_api_keys(
    current_user: User = require_role(["AGENCY_ADMIN", "SUPER_ADMIN"]),
    db: Session = Depends(get_db)
):
    return db.query(APIKey).filter(APIKey.user_id == current_user.id).all()

@router.delete("/{key_id}")
def revoke_api_key(
    key_id: str,
    current_user: User = require_role(["AGENCY_ADMIN", "SUPER_ADMIN"]),
    db: Session = Depends(get_db)
):
    api_key = db.query(APIKey).filter(APIKey.id == key_id, APIKey.user_id == current_user.id).first()
    if not api_key:
        raise HTTPException(status_code=404, detail="API Key not found")
    
    db.delete(api_key)
    db.commit()
    return {"message": "API Key successfully revoked"}
