import os
import logging
from typing import Dict, Any

logger = logging.getLogger("lifelink_twilio")

class TwilioService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
        self.from_number = os.getenv("TWILIO_PHONE_NUMBER", "").strip()
        self.client = None

        if self.account_sid and self.auth_token:
            try:
                from twilio.rest import Client
                self.client = Client(self.account_sid, self.auth_token)
            except Exception as e:
                logger.warning(f"Failed to initialize Twilio client: {e}")

    def send_emergency_sms(self, to_number: str, message: str) -> Dict[str, Any]:
        """
        Dispatches an emergency SMS via Twilio Gateway.
        Falls back gracefully if Twilio API credentials are dummy or trial sandbox restricted.
        """
        if not self.client or not self.from_number:
            logger.info(f"[SMS MOCK DISPATCH] To: {to_number} | Message: {message}")
            return {"success": True, "mode": "MOCK_DISPATCH", "to": to_number}

        try:
            sms = self.client.messages.create(
                body=message,
                from_=self.from_number,
                to=to_number
            )
            logger.info(f"[TWILIO DISPATCH SUCCESS] SID: {sms.sid} | Status: {sms.status}")
            return {"success": True, "sid": sms.sid, "status": sms.status, "to": to_number}
        except Exception as e:
            logger.error(f"[TWILIO DISPATCH EXCEPTION] {e}")
            return {"success": False, "error": str(e), "mode": "FALLBACK_DISPATCH", "to": to_number}

# Singleton instance export
twilio_service = TwilioService()
