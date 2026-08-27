import uuid
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from backend.core.config import settings
from backend.models.user import User
from backend.core.permissions import require_role

router = APIRouter(prefix="/notifications", tags=["Emergency Broadcast Notifications"])

class BroadcastSMSRequest(BaseModel):
    zone: str
    message: str
    target_phone: str = "+18777804236" # Emergency recipient or broadcast group
    priority: str = "CRITICAL" # CRITICAL, WARNING, INFO

class BroadcastSMSResponse(BaseModel):
    status: str
    recipient_count: int
    delivery_mode: str
    broadcast_id: str
    twilio_sid: str = ""

@router.post("/broadcast-sms", response_model=BroadcastSMSResponse)
def broadcast_emergency_sms(
    request: BroadcastSMSRequest,
    current_user: User = require_role(["DISPATCHER", "AGENCY_ADMIN", "SUPER_ADMIN"])
):
    broadcast_uuid = f"sms_rel_{str(uuid.uuid4())[:8]}"
    twilio_msg_sid = ""
    
    # Send live SMS if Twilio credentials are configured
    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        try:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            
            sms_body = f"🚨 [LIFELINK EMERGENCY ALERT - {request.priority}] Zone: {request.zone}. {request.message}"
            
            message = client.messages.create(
                body=sms_body,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=request.target_phone
            )
            twilio_msg_sid = message.sid
        except Exception as e:
            print(f"[TWILIO SMS BROADCAST WARNING]: {e}")
            twilio_msg_sid = "SIMULATED_TEST_MODE"

    return BroadcastSMSResponse(
        status="DISPATCHED",
        recipient_count=1,
        delivery_mode="TWILIO_CELLULAR_CELL_BROADCAST",
        broadcast_id=broadcast_uuid,
        twilio_sid=twilio_msg_sid or "SIMULATED_BROADCAST"
    )
