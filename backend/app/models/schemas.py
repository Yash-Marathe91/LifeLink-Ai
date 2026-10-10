"""
LifeLink AI — Pydantic Schemas for API & WebSocket Payloads
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import IntEnum


class EmergencyTypeEnum(IntEnum):
    UNKNOWN = 0
    MEDICAL = 1
    FLOOD_DROWNING = 2
    FIRE_SMOKE = 3
    EARTHQUAKE_TRAPPED = 4
    STRUCTURAL_COLLAPSE = 5
    LANDSLIDE = 6
    EVACUATION_NEEDED = 7


class MedicalUrgencyEnum(IntEnum):
    NONE = 0
    MINOR_INJURY = 1
    SEVERE_TRAUMA_BLEEDING = 2
    HYPOTHERMIA_SHOCK = 3
    CRITICAL_LIFE_SUPPORT = 4
    UNCONSCIOUS = 5


class HazardFlags(BaseModel):
    rising_water: bool = False
    electrical_hazard: bool = False
    gas_leak: bool = False
    fire_smoke: bool = False
    structural_collapse: bool = False
    road_blocked: bool = False


class SOSIngestRequest(BaseModel):
    sos_id: str
    sender_peer_id: Optional[str] = None
    timestamp: float
    latitude: float
    longitude: float
    accuracy_meters: float = 10.0
    battery_pct: int = 100
    emergency_type: EmergencyTypeEnum = EmergencyTypeEnum.MEDICAL
    medical_urgency: MedicalUrgencyEnum = MedicalUrgencyEnum.NONE
    total_people: int = 1
    elderly_count: int = 0
    children_count: int = 0
    vulnerable_count: int = 0
    hazards: HazardFlags = Field(default_factory=HazardFlags)
    note: Optional[str] = ""
    transport_source: str = "BLE_MESH" # "BLE_MESH", "NOSTR_RELAY", "DIRECT_HTTPS"


class IncidentResponse(BaseModel):
    incident_id: str
    primary_sos_id: str
    created_at: float
    latitude: float
    longitude: float
    status: str # "TRIAGED", "ASSIGNED", "DISPATCHED", "RESOLVED"
    priority_score: float
    category: str
    explanation: str
    total_affected: int
    assigned_team_id: Optional[str] = None
    all_sos_ids: List[str] = []


class RescueTeam(BaseModel):
    team_id: str
    callsign: str
    unit_type: str # "NDRF_WATER_RESCUE", "NDRF_COLLAPSE_USAR", "MEDICAL_PARAMEDIC", "GENERAL_EVAC"
    current_status: str # "AVAILABLE", "EN_ROUTE", "DEPLOYED"
    latitude: float
    longitude: float
    equipment: List[str] # ["INFLATABLE_MOTORBOAT", "LIFE_JACKETS", "AED", "HYDRAULIC_CUTTER", "OXYGEN"]
    capacity_victims: int = 8
    current_active_missions: int = 0


class DispatchConfirmationRequest(BaseModel):
    incident_id: str
    team_id: str
    dispatcher_notes: Optional[str] = None
    override_reason: Optional[str] = None
