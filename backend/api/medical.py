from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.user import User
from backend.api.auth import get_current_user
from backend.core.crypto import encrypt_medical_data, decrypt_medical_data
from backend.core.permissions import require_role

router = APIRouter(prefix="/medical", tags=["Encrypted Medical Intelligence"])

class MedicalProfileUpdate(BaseModel):
    blood_group: str
    allergies: str
    chronic_conditions: str

class DecryptRequest(BaseModel):
    citizen_id: str

class MedicalProfileOut(BaseModel):
    citizen_id: str
    full_name: str
    blood_group: str
    allergies: str
    chronic_conditions: str

@router.post("/update", response_model=dict)
def update_medical_profile(
    profile: MedicalProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Encrypt health records before database write
    current_user.blood_group = profile.blood_group
    current_user.allergies = encrypt_medical_data(profile.allergies)
    current_user.chronic_conditions = encrypt_medical_data(profile.chronic_conditions)
    
    db.commit()
    return {"message": "Medical Emergency Profile encrypted and updated successfully using AES-256"}

@router.post("/decrypt", response_model=MedicalProfileOut)
def decrypt_citizen_medical_profile(
    request: DecryptRequest,
    current_user: User = require_role(["FIELD_RESPONDER", "DISPATCHER", "SUPER_ADMIN"]),
    db: Session = Depends(get_db)
):
    citizen = db.query(User).filter(User.id == request.citizen_id).first()
    if not citizen:
        raise HTTPException(status_code=404, detail="Citizen profile not found")
        
    decrypted_allergies = decrypt_medical_data(citizen.allergies or "")
    decrypted_conditions = decrypt_medical_data(citizen.chronic_conditions or "")
    
    return MedicalProfileOut(
        citizen_id=citizen.id,
        full_name=citizen.full_name,
        blood_group=citizen.blood_group or "UNKNOWN",
        allergies=decrypted_allergies,
        chronic_conditions=decrypted_conditions
    )
