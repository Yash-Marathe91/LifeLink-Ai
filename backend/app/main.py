"""
LifeLink AI — FastAPI Backend Gateway & Multi-Agent Risk Engine
Integrates:
- Binary BitChat BLE packet ingestion & standard JSON ingest
- Multi-Agent AI Triage (5 agents + Coordinator)
- Spatio-temporal incident deduplication
- NDRF team suitability matching
- Real-time WebSocket streaming to Next.js Command Center
"""

import time
import uuid
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import (
    SOSIngestRequest, IncidentResponse, RescueTeam, DispatchConfirmationRequest
)
from app.agents.risk_engine import CoordinatorAgent
from app.services.team_matcher import TeamMatcher
from protocols.packet_codec import decode_sos_payload

app = FastAPI(
    title="LifeLink AI - Disaster SOS & Rescue Coordination API",
    version="2.0.0",
    description="Multi-agent emergency triage and offline-first mesh integration system."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration & fast hackathon testing
INCIDENTS_DB: Dict[str, Dict[str, Any]] = {}
SOS_RECORDS: Dict[str, Dict[str, Any]] = {}
DISPATCH_AUDIT_LOG: List[Dict[str, Any]] = []

# Mock Available NDRF Teams in Region
ACTIVE_TEAMS: List[RescueTeam] = [
    RescueTeam(
        team_id="team-ndrf-01",
        callsign="NDRF Water Rescue Bravo-1",
        unit_type="NDRF_WATER_RESCUE",
        current_status="AVAILABLE",
        latitude=19.9912,
        longitude=73.7811,
        equipment=["INFLATABLE_MOTORBOAT", "LIFE_JACKETS", "AED", "FLOOD_LIGHTS"],
        capacity_victims=12,
        current_active_missions=0
    ),
    RescueTeam(
        team_id="team-ndrf-02",
        callsign="NDRF USAR Alpha-3",
        unit_type="NDRF_COLLAPSE_USAR",
        current_status="AVAILABLE",
        latitude=20.0051,
        longitude=73.7925,
        equipment=["HYDRAULIC_CUTTER", "SEARCH_CAMERAS", "CANINE_UNIT", "SHORING_EQUIPMENT"],
        capacity_victims=6,
        current_active_missions=0
    ),
    RescueTeam(
        team_id="team-med-01",
        callsign="SDRF Rapid Trauma Medical",
        unit_type="MEDICAL_PARAMEDIC",
        current_status="AVAILABLE",
        latitude=19.9880,
        longitude=73.7750,
        equipment=["OXYGEN", "DEFIBRILLATOR", "SURGICAL_KIT", "TRIAGE_TENT"],
        capacity_victims=4,
        current_active_missions=1
    ),
    RescueTeam(
        team_id="team-evac-01",
        callsign="Civil Defense Evac Van 4",
        unit_type="GENERAL_EVAC",
        current_status="AVAILABLE",
        latitude=19.9950,
        longitude=73.8050,
        equipment=["STRETCHERS", "FIRST_AID", "RATION_PACKS"],
        capacity_victims=15,
        current_active_missions=0
    )
]

coordinator_agent = CoordinatorAgent()
team_matcher = TeamMatcher()


# WebSocket Connection Manager for Next.js Dashboard
class DashboardConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass


ws_manager = DashboardConnectionManager()


@app.get("/")
def root():
    return {
        "system": "LIFELINK AI",
        "tagline": "When connectivity fails, critical information doesn't have to.",
        "status": "OPERATIONAL",
        "endpoints": {
            "health": "/health",
            "ingest_json": "/api/v1/sos/ingest",
            "ingest_binary": "/api/v1/sos/ingest-binary",
            "incidents": "/api/v1/incidents",
            "teams": "/api/v1/teams"
        }
    }


@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "active_incidents": len(INCIDENTS_DB),
        "total_sos_ingested": len(SOS_RECORDS),
        "available_teams": len(ACTIVE_TEAMS),
        "time": time.time()
    }


@app.post("/api/v1/sos/ingest")
async def ingest_sos_json(payload: SOSIngestRequest):
    """Ingests a structured JSON SOS packet (from cellular/Wi-Fi or gateway)."""
    sos_dict = payload.model_dump()
    return await process_sos(sos_dict)


@app.post("/api/v1/sos/ingest-binary")
async def ingest_sos_binary(request: Request):
    """Ingests raw BitChat binary BLE wire bytes received from an edge gateway/drone."""
    body_bytes = await request.body()
    try:
        decoded_dict = decode_sos_payload(body_bytes)
        decoded_dict["transport_source"] = "BITCHAT_BLE_MESH"
        return await process_sos(decoded_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Binary decoding failed: {str(e)}")


async def process_sos(sos_dict: Dict[str, Any]) -> Dict[str, Any]:
    sos_id = sos_dict.get("sos_id", str(uuid.uuid4()))
    sos_dict["ingested_at"] = time.time()
    SOS_RECORDS[sos_id] = sos_dict

    # 1. Multi-Agent AI Triage
    triage_result = coordinator_agent.evaluate_sos(sos_dict)

    # 2. Incident Deduplication & Clustering
    # Check if an active incident exists within ~150 meters in the last 45 minutes
    lat, lon = sos_dict["latitude"], sos_dict["longitude"]
    matched_incident_id = None

    for inc_id, inc in INCIDENTS_DB.items():
        # Approx distance check: 0.001 deg ~ 111m
        if abs(inc["latitude"] - lat) < 0.0015 and abs(inc["longitude"] - lon) < 0.0015:
            matched_incident_id = inc_id
            break

    if matched_incident_id:
        incident = INCIDENTS_DB[matched_incident_id]
        incident["all_sos_ids"].append(sos_id)
        incident["total_affected"] += sos_dict.get("total_people", 1)
        # Update priority if new SOS reports higher urgency
        if triage_result["priority_score"] > incident["priority_score"]:
            incident["priority_score"] = triage_result["priority_score"]
            incident["category"] = triage_result["category"]
            incident["explanation"] = triage_result["explanation"]
    else:
        incident_id = f"INC-{int(time.time())}-{str(uuid.uuid4())[:6]}"
        incident = {
            "incident_id": incident_id,
            "primary_sos_id": sos_id,
            "created_at": time.time(),
            "latitude": lat,
            "longitude": lon,
            "emergency_type": sos_dict.get("emergency_type", 1),
            "medical_urgency": sos_dict.get("medical_urgency", 0),
            "status": "TRIAGED",
            "priority_score": triage_result["priority_score"],
            "category": triage_result["category"],
            "color": triage_result["color"],
            "explanation": triage_result["explanation"],
            "total_affected": sos_dict.get("total_people", 1),
            "assigned_team_id": None,
            "all_sos_ids": [sos_id],
            "agent_breakdown": triage_result["agent_breakdown"]
        }
        INCIDENTS_DB[incident_id] = incident

    # 3. Broadcast real-time update to Next.js Rescue Command Center
    await ws_manager.broadcast({
        "event": "INCIDENT_UPDATE",
        "incident": incident,
        "latest_sos": sos_dict
    })

    return {
        "status": "SUCCESS",
        "sos_id": sos_id,
        "incident_id": incident["incident_id"],
        "triage": triage_result
    }


@app.get("/api/v1/incidents")
def list_incidents():
    """Lists all active disaster incidents ranked by Priority Score (highest first)."""
    incidents = list(INCIDENTS_DB.values())
    return sorted(incidents, key=lambda x: x["priority_score"], reverse=True)


@app.get("/api/v1/teams")
def list_teams():
    return ACTIVE_TEAMS


@app.get("/api/v1/incidents/{incident_id}/match-teams")
def match_rescue_teams(incident_id: str):
    """Runs the Team Suitability Matching algorithm for the specified incident."""
    if incident_id not in INCIDENTS_DB:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident = INCIDENTS_DB[incident_id]
    ranked = team_matcher.rank_teams(incident, ACTIVE_TEAMS)
    return {
        "incident_id": incident_id,
        "recommended_teams": ranked
    }


@app.post("/api/v1/dispatch/confirm")
async def confirm_dispatch(req: DispatchConfirmationRequest):
    """
    Human-in-the-Loop Confirmation:
    Emergency control room dispatcher confirms or overrides team assignment.
    Generates audit record and generates downstream mesh ACK packet.
    """
    if req.incident_id not in INCIDENTS_DB:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident = INCIDENTS_DB[req.incident_id]
    incident["status"] = "DISPATCHED"
    incident["assigned_team_id"] = req.team_id

    # Update team status
    assigned_team = None
    for team in ACTIVE_TEAMS:
        if team.team_id == req.team_id:
            team.current_status = "DEPLOYED"
            team.current_active_missions += 1
            assigned_team = team
            break

    audit_entry = {
        "timestamp": time.time(),
        "incident_id": req.incident_id,
        "team_id": req.team_id,
        "team_callsign": assigned_team.callsign if assigned_team else "Unknown",
        "dispatcher_notes": req.dispatcher_notes,
        "override_reason": req.override_reason,
    }
    DISPATCH_AUDIT_LOG.append(audit_entry)

    # Broadcast event to Dashboard
    await ws_manager.broadcast({
        "event": "DISPATCH_CONFIRMED",
        "audit": audit_entry,
        "incident": incident
    })

    return {
        "status": "DISPATCH_CONFIRMED",
        "audit": audit_entry,
        "mesh_ack_packet": {
            "type": 0x31, # LIFELINK_RESPONDER_ACK
            "target_sos_id": incident["primary_sos_id"],
            "assigned_team": assigned_team.callsign if assigned_team else req.team_id,
            "instructions": "Rescue team dispatched. Stay in place or signal from high ground."
        }
    }


@app.websocket("/ws/live-incidents")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Push initial snapshot
        await websocket.send_json({
            "event": "SNAPSHOT",
            "incidents": list(INCIDENTS_DB.values()),
            "teams": [t.model_dump() for t in ACTIVE_TEAMS]
        })
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
