from fastapi import APIRouter, Depends
from pydantic import BaseModel
from backend.api.auth import get_current_user
from backend.models.user import User
from backend.core.permissions import require_role

router = APIRouter(prefix="/notifications", tags=["Emergency Broadcast Notifications"])

class BroadcastSMSRequest(BaseModel):
    zone: str
    message: str
    priority: str # CRITICAL, WARNING, INFO

class BroadcastSMSResponse(BaseModel):
    status: str
    recipient_count: int
    delivery_mode: str
    broadcast_id: str

@router.post("/broadcast-sms", response_model=BroadcastSMSResponse)
def broadcast_emergency_sms(
    request: BroadcastSMSRequest,
    current_user: User = require_role(["DISPATCHER", "AGENCY_ADMIN", "SUPER_ADMIN"])
):
    # Simulated high-speed Twilio SMS Relay Broadcast
    return BroadcastSMSResponse(
        status="DISPATCHED",
        recipient_count=1420,
        delivery_mode="TWILIO_CELLULAR_CELL_BROADCAST",
        broadcast_id="sms_rel_89f0a21"
    )
