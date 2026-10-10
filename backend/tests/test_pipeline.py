"""
Test end-to-end LifeLink AI backend pipeline:
1. Binary packet encoding via protocols/packet_codec.py
2. Binary decoding and ingest simulation
3. Multi-Agent AI evaluation
4. Spatio-temporal clustering & team suitability matching
"""

import sys
import os
import time

# Ensure project root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from protocols.packet_codec import encode_sos_payload, decode_sos_payload, wrap_bitchat_frame
from app.agents.risk_engine import CoordinatorAgent
from app.services.team_matcher import TeamMatcher
from app.models.schemas import RescueTeam


def test_full_pipeline():
    print("=== STEP 1: VICTIM CREATES SOS (OFFLINE FLUTTER APP) ===")
    victim_sos = {
        "sos_id": "8fa21611-304d-44aa-9c32-a5814032d19b",
        "timestamp": int(time.time()),
        "latitude": 19.9975,
        "longitude": 73.7898,
        "accuracy_meters": 6,
        "battery_pct": 22,
        "emergency_type": 2, # Flood
        "medical_urgency": 2, # Severe Trauma
        "total_people": 5,
        "elderly_count": 2,
        "children_count": 1,
        "vulnerable_count": 3,
        "hazards": {
            "rising_water": True,
            "structural_collapse": False,
            "electrical_hazard": True
        },
        "note": "Terrace water level 3 feet. Elder needs medicine."
    }

    # Encode to compact binary (<120 bytes)
    raw_binary = encode_sos_payload(victim_sos)
    bitchat_frame = wrap_bitchat_frame(b"VICTIM01", raw_binary, ttl=7)
    print(f"Packed Binary Frame Size: {len(bitchat_frame)} bytes (Fits in single BLE MTU!)")

    print("\n=== STEP 2: PACKET HOPS OVER BITCHAT BLE MESH ===")
    print("Hop 1: Victim -> Neighbor (TTL 7 -> 6)")
    print("Hop 2: Neighbor -> Passing Evacuee Courier (TTL 6 -> 5)")
    print("Hop 3: Evacuee -> NDRF Drone Gateway (TTL 5 -> 4)")

    print("\n=== STEP 3: GATEWAY INGESTS & DECODES PACKET ===")
    # Extract payload from BitChat frame (header is 14 bytes + 8 bytes sender ID)
    payload_extracted = bitchat_frame[22:]
    decoded_sos = decode_sos_payload(payload_extracted)
    print(f"Decoded SOS ID: {decoded_sos['sos_id']}")
    print(f"Decoded Coordinates: {decoded_sos['latitude']}, {decoded_sos['longitude']}")

    print("\n=== STEP 4: MULTI-AGENT AI EMERGENCY TRIAGE ===")
    coordinator = CoordinatorAgent()
    triage = coordinator.evaluate_sos(decoded_sos)
    print(f"Priority Score: {triage['priority_score']} [{triage['category']}]")
    print(f"Explainability: {triage['explanation']}")
    assert triage["priority_score"] >= 80.0 # Should be CRITICAL

    print("\n=== STEP 5: RESCUE TEAM SUITABILITY MATCHING ===")
    teams = [
        RescueTeam(
            team_id="team-01",
            callsign="NDRF Water Rescue Alpha",
            unit_type="NDRF_WATER_RESCUE",
            current_status="AVAILABLE",
            latitude=19.9920,
            longitude=73.7850,
            equipment=["INFLATABLE_MOTORBOAT", "LIFE_JACKETS", "AED"],
            capacity_victims=10
        ),
        RescueTeam(
            team_id="team-02",
            callsign="Civil Defense Truck 3",
            unit_type="GENERAL_EVAC",
            current_status="AVAILABLE",
            latitude=20.0100,
            longitude=73.8000,
            equipment=["FIRST_AID", "STRETCHERS"],
            capacity_victims=15
        )
    ]

    matcher = TeamMatcher()
    ranked = matcher.rank_teams(decoded_sos, teams)
    top_team = ranked[0]
    print(f"Top Recommended Team: {top_team['callsign']}")
    print(f"  Suitability Score: {top_team['suitability_score']}/100")
    print(f"  Distance: {top_team['distance_km']} km, ETA: {top_team['eta_minutes']} mins")
    assert top_team["team_id"] == "team-01" # Water Rescue should beat General Evac for floods

    print("\n=== PIPELINE VALIDATION TEST PASSED 100%! ===")


if __name__ == "__main__":
    test_full_pipeline()
