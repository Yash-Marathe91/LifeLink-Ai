"""
LifeLink AI — Team Suitability Matching Engine
Matches available rescue units (NDRF, SDRF, Quick Response Teams)
based on:
- Capability Match (35%)
- Equipment Match (25%)
- Availability Status (20%)
- Proximity / Distance (10%)
- Current Workload (10%)
"""

import math
from typing import List, Dict, Any
from app.models.schemas import RescueTeam, IncidentResponse


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two points in kilometers."""
    R = 6371.0 # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


class TeamMatcher:
    """Evaluates suitability score (0-100) of rescue teams for a given incident."""

    W_CAPABILITY = 0.35
    W_EQUIPMENT = 0.25
    W_AVAILABILITY = 0.20
    W_PROXIMITY = 0.10
    W_WORKLOAD = 0.10

    # Required equipment per emergency type
    REQUIRED_EQUIPMENT = {
        2: {"INFLATABLE_MOTORBOAT", "LIFE_JACKETS"}, # Flood
        3: {"THERMAL_IMAGING", "BREATHING_APPARATUS"}, # Fire
        4: {"HYDRAULIC_CUTTER", "SEARCH_CAMERAS", "CANINE_UNIT"}, # USAR / Rubble
        5: {"HYDRAULIC_SPREADER", "SHORING_EQUIPMENT"}, # Structural Collapse
    }

    def evaluate_team(self, incident: Dict[str, Any], team: RescueTeam) -> Dict[str, Any]:
        em_type = incident.get("emergency_type", 1)

        # 1. Capability Match (35%)
        capability_score = 40.0
        if em_type == 2 and "WATER" in team.unit_type: # Flood
            capability_score = 100.0
        elif em_type in [4, 5] and "COLLAPSE" in team.unit_type: # Earthquake / Collapse
            capability_score = 100.0
        elif incident.get("medical_urgency", 0) >= 2 and "MEDICAL" in team.unit_type:
            capability_score = 100.0
        elif team.unit_type == "GENERAL_EVAC":
            capability_score = 70.0

        # 2. Equipment Match (25%)
        needed_items = self.REQUIRED_EQUIPMENT.get(em_type, set())
        team_equip = set(team.equipment)
        if not needed_items:
            equip_score = 80.0
        else:
            matched = len(needed_items.intersection(team_equip))
            equip_score = (matched / len(needed_items)) * 100.0

        # 3. Availability (20%)
        if team.current_status == "AVAILABLE":
            avail_score = 100.0
        elif team.current_status == "EN_ROUTE":
            avail_score = 50.0
        else: # DEPLOYED
            avail_score = 10.0

        # 4. Proximity (10%)
        dist_km = haversine_km(incident["latitude"], incident["longitude"], team.latitude, team.longitude)
        # Closer than 2 km = 100 pts, decays to 0 pts at 30 km
        prox_score = max(0.0, min(100.0, (1.0 - (dist_km / 30.0)) * 100.0))

        # 5. Workload (10%)
        # 0 active missions = 100 pts, each active mission drops by 30 pts
        workload_score = max(0.0, 100.0 - (team.current_active_missions * 30.0))

        # Total Weighted Suitability Score
        suitability_score = (
            capability_score * self.W_CAPABILITY +
            equip_score * self.W_EQUIPMENT +
            avail_score * self.W_AVAILABILITY +
            prox_score * self.W_PROXIMITY +
            workload_score * self.W_WORKLOAD
        )

        return {
            "team_id": team.team_id,
            "callsign": team.callsign,
            "unit_type": team.unit_type,
            "suitability_score": round(suitability_score, 1),
            "distance_km": round(dist_km, 2),
            "eta_minutes": max(4, round((dist_km / 25.0) * 60)), # Assuming avg speed 25 km/h in disaster conditions
            "breakdown": {
                "capability": capability_score,
                "equipment": equip_score,
                "availability": avail_score,
                "proximity": prox_score,
                "workload": workload_score
            }
        }

    def rank_teams(self, incident: Dict[str, Any], teams: List[RescueTeam]) -> List[Dict[str, Any]]:
        scored = [self.evaluate_team(incident, t) for t in teams]
        return sorted(scored, key=lambda x: x["suitability_score"], reverse=True)
