from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ONLINE"
    print("[PASS] Health check passed!")

def test_auth_workflow():
    test_email = "test_responder_2026@lifelink.ai"
    test_password = "SecurePassword123!"
    
    # 1. Register
    reg_payload = {
        "email": test_email,
        "password": test_password,
        "full_name": "Lieutenant Commander Alex Vance",
        "role": "DISPATCHER",
        "badge_number": "DISPATCH-990"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    if reg_res.status_code == 400: # Already registered in test DB
        print("[INFO] User already registered, proceeding to login test...")
    else:
        assert reg_res.status_code == 200
        assert reg_res.json()["email"] == test_email
        print("[PASS] User registration test passed!")

    # 2. Login
    login_res = client.post("/api/v1/auth/login", json={"email": test_email, "password": test_password})
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    token = data["access_token"]
    print("[PASS] User login & JWT issuance test passed!")

    # 3. Read Profile /auth/me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == test_email
    print("[PASS] /auth/me profile verification test passed!")

    # 4. Twilio Emergency SMS Broadcast
    sms_payload = {
        "zone": "Sector 7 Hydro-Dam",
        "message": "Immediate evacuation directive active due to rising flood waters.",
        "target_phone": "+18777804236",
        "priority": "CRITICAL"
    }
    sms_res = client.post("/api/v1/notifications/broadcast-sms", json=sms_payload, headers={"Authorization": f"Bearer {token}"})
    assert sms_res.status_code == 200
    sms_data = sms_res.json()
    assert sms_data["status"] == "DISPATCHED"
    print(f"[PASS] Twilio SMS Broadcast test passed! Broadcast ID: {sms_data['broadcast_id']} (Twilio SID: {sms_data.get('twilio_sid')})")

if __name__ == "__main__":
    test_health_check()
    test_auth_workflow()
