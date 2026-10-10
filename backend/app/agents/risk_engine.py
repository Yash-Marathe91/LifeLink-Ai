"""
LifeLink AI — Multi-Agent Emergency Intelligence Engine
Implements the 5 specialized evaluation agents and Coordinator Agent
with deterministic safety rules, weighted scoring (0-100), and explainable reasoning.
"""

from dataclasses import dataclass
from typing import Dict, Any, Tuple
import math
import time


@dataclass
class AgentScore:
    agent_name: str
    weight: float
    score: float # 0.0 to 100.0
    rationale: str


class SeverityAgent:
    """Agent 1 (Weight: 25%): Analyzes emergency type, affected count, time elapsed."""
    WEIGHT = 0.25

    EMERGENCY_BASE_SCORES = {
        1: 65.0, # Medical
        2: 85.0, # Flood / Drowning
        3: 80.0, # Fire / Smoke
        4: 90.0, # Earthquake / Trapped in Rubble
        5: 85.0, # Structural Collapse
        6: 75.0, # Landslide
        7: 50.0, # Evacuation Needed
    }

    def evaluate(self, sos: Dict[str, Any]) -> AgentScore:
        em_type = sos.get("emergency_type", 1)
        base = self.EMERGENCY_BASE_SCORES.get(em_type, 50.0)

        # Count modifier: each additional person increases urgency
        total_people = sos.get("total_people", 1)
        count_mod = min(20.0, math.log2(max(1, total_people)) * 6.0)

        # Elapsed time modifier (wait time escalation)
        created_at = sos.get("timestamp", time.time())
        elapsed_min = max(0, (time.time() - created_at) / 60.0)
        time_mod = min(15.0, (elapsed_min / 30.0) * 10.0) # Up to +15 pts after 45 mins

        raw_score = min(100.0, base + count_mod + time_mod)
        rationale = f"Emergency type base {base:.0f}pts, affected count ({total_people} ppl: +{count_mod:.1f}pts), elapsed wait {elapsed_min:.0f}m (+{time_mod:.1f}pts)"
        return AgentScore("Severity Agent", self.WEIGHT, raw_score, rationale)


class MedicalAgent:
    """Agent 2 (Weight: 25%): Analyzes medical urgency, acute injuries, life support needs."""
    WEIGHT = 0.25

    MEDICAL_URGENCY_SCORES = {
        0: 10.0, # None
        1: 40.0, # Minor Injury
        2: 80.0, # Severe Trauma / Uncontrolled Bleeding
        3: 85.0, # Hypothermia / Shock
        4: 95.0, # Critical Life Support / Oxygen / Insulin dependent
        5: 98.0, # Unconscious / Unresponsive
    }

    def evaluate(self, sos: Dict[str, Any]) -> AgentScore:
        med_urg = sos.get("medical_urgency", 0)
        score = self.MEDICAL_URGENCY_SCORES.get(med_urg, 20.0)
        
        labels = {
            0: "No acute medical condition reported",
            1: "Minor injuries needing field triage",
            2: "Severe trauma or severe blood loss",
            3: "Hypothermia / environmental shock",
            4: "Critical life support dependency (Oxygen/Insulin/Dialysis)",
            5: "Victim unconscious / unresponsive"
        }
        rationale = f"Medical status: {labels.get(med_urg, 'Unknown')} ({score:.0f}pts)"
        return AgentScore("Medical Agent", self.WEIGHT, score, rationale)


class VulnerabilityAgent:
    """Agent 3 (Weight: 20%): Evaluates presence of elderly, children, pregnant, disabled."""
    WEIGHT = 0.20

    def evaluate(self, sos: Dict[str, Any]) -> AgentScore:
        total = max(1, sos.get("total_people", 1))
        elderly = sos.get("elderly_count", 0)
        children = sos.get("children_count", 0)
        vulnerable = sos.get("vulnerable_count", 0)

        vulnerable_total = elderly + children + vulnerable
        if vulnerable_total == 0:
            return AgentScore("Vulnerability Agent", self.WEIGHT, 15.0, "All victims able-bodied adults (15pts)")

        ratio = min(1.0, vulnerable_total / total)
        # Base vulnerability score: proportion + raw volume
        score = min(100.0, (ratio * 60.0) + min(40.0, vulnerable_total * 12.0))

        details = []
        if elderly > 0: details.append(f"{elderly} elderly")
        if children > 0: details.append(f"{children} children/infants")
        if vulnerable > 0: details.append(f"{vulnerable} disabled/pregnant")

        rationale = f"High vulnerability group: {', '.join(details)} ({vulnerable_total}/{total} affected, {score:.0f}pts)"
        return AgentScore("Vulnerability Agent", self.WEIGHT, score, rationale)


class HazardAgent:
    """Agent 4 (Weight: 20%): Analyzes secondary environmental hazards (rising water, collapse, gas)."""
    WEIGHT = 0.20

    def evaluate(self, sos: Dict[str, Any]) -> AgentScore:
        hazards = sos.get("hazards", {})
        score = 15.0 # Baseline ambient disaster hazard
        active_hazards = []

        if hazards.get("rising_water"):
            score += 30.0
            active_hazards.append("rapidly rising floodwater")
        if hazards.get("structural_collapse"):
            score += 25.0
            active_hazards.append("structural collapse imminent")
        if hazards.get("fire_smoke"):
            score += 25.0
            active_hazards.append("dense smoke/fire spread")
        if hazards.get("electrical_hazard"):
            score += 15.0
            active_hazards.append("live electrical power lines")
        if hazards.get("gas_leak"):
            score += 20.0
            active_hazards.append("flammable/toxic gas leak")
        if hazards.get("road_blocked"):
            score += 10.0
            active_hazards.append("primary access road blocked")

        score = min(100.0, score)
        if not active_hazards:
            rationale = "No secondary environmental hazard flags reported (15pts)"
        else:
            rationale = f"Active hazards: {'; '.join(active_hazards)} ({score:.0f}pts)"
        return AgentScore("Hazard Agent", self.WEIGHT, score, rationale)


class LocationAgent:
    """Agent 5 (Weight: 10%): Evaluates battery reserves, location accuracy, accessibility."""
    WEIGHT = 0.10

    def evaluate(self, sos: Dict[str, Any]) -> AgentScore:
        batt = sos.get("battery_pct", 100)
        acc = sos.get("accuracy_meters", 10)

        # Low battery escalates priority (phone might die soon, losing victim's beacon!)
        batt_urgency = max(0.0, (100.0 - batt) * 0.7) # Up to 70 pts if battery near 0%
        acc_penalty = 15.0 if acc > 50 else 0.0 # High uncertainty penalty

        score = min(100.0, 20.0 + batt_urgency + acc_penalty)
        rationale = f"Device battery at {batt}% (urgency +{batt_urgency:.0f}pts), GPS confidence +/-{acc}m"
        return AgentScore("Location Agent", self.WEIGHT, score, rationale)


class CoordinatorAgent:
    """
    Central AI Coordinator:
    Combines agent outputs into weighted priority score (0-100),
    applies deterministic safety overrides, and formats plain-language explainability.
    """

    def __init__(self):
        self.severity_agent = SeverityAgent()
        self.medical_agent = MedicalAgent()
        self.vulnerability_agent = VulnerabilityAgent()
        self.hazard_agent = HazardAgent()
        self.location_agent = LocationAgent()

    def evaluate_sos(self, sos: Dict[str, Any]) -> Dict[str, Any]:
        s_score = self.severity_agent.evaluate(sos)
        m_score = self.medical_agent.evaluate(sos)
        v_score = self.vulnerability_agent.evaluate(sos)
        h_score = self.hazard_agent.evaluate(sos)
        l_score = self.location_agent.evaluate(sos)

        # Calculate weighted base score
        weighted_score = (
            s_score.score * s_score.weight +
            m_score.score * m_score.weight +
            v_score.score * v_score.weight +
            h_score.score * h_score.weight +
            l_score.score * l_score.weight
        )

        # Deterministic Safety Rules (Human-Centric Safety Guardrails):
        overridden = False
        override_reason = ""

        # Rule 1: Unconscious victim or critical oxygen dependency + rising water -> Mandatory CRITICAL >= 92
        med_urg = sos.get("medical_urgency", 0)
        hazards = sos.get("hazards", {})
        if (med_urg in [4, 5]) and hazards.get("rising_water"):
            if weighted_score < 92.0:
                weighted_score = 92.0
                overridden = True
                override_reason = "Safety Override: Unconscious or oxygen-dependent victim in rising floodwaters."

        # Rule 2: Trapped children/infants with structural collapse -> Mandatory CRITICAL >= 88
        if sos.get("children_count", 0) > 0 and hazards.get("structural_collapse"):
            if weighted_score < 88.0:
                weighted_score = 88.0
                overridden = True
                override_reason = "Safety Override: Children trapped under structural collapse risk."

        final_score = round(min(100.0, max(0.0, weighted_score)), 1)

        # Tier Categorization
        if final_score >= 80.0:
            category = "CRITICAL"
            color = "#EF4444" # Red
        elif final_score >= 60.0:
            category = "HIGH"
            color = "#F97316" # Orange
        elif final_score >= 40.0:
            category = "MEDIUM"
            color = "#EAB308" # Yellow
        else:
            category = "LOW"
            color = "#22C55E" # Green

        # Synthesize Explainable Text Summary
        explanation_parts = [
            f"Overall Priority: {final_score}/100 [{category}].",
            s_score.rationale + ".",
            m_score.rationale + ".",
            v_score.rationale + ".",
            h_score.rationale + ".",
            l_score.rationale + "."
        ]
        if overridden:
            explanation_parts.insert(1, f"🚨 {override_reason}")

        return {
            "sos_id": sos.get("sos_id"),
            "priority_score": final_score,
            "category": category,
            "color": color,
            "safety_overridden": overridden,
            "override_reason": override_reason,
            "explanation": " ".join(explanation_parts),
            "agent_breakdown": {
                "severity": {"weight": s_score.weight, "score": round(s_score.score, 1), "rationale": s_score.rationale},
                "medical": {"weight": m_score.weight, "score": round(m_score.score, 1), "rationale": m_score.rationale},
                "vulnerability": {"weight": v_score.weight, "score": round(v_score.score, 1), "rationale": v_score.rationale},
                "hazard": {"weight": h_score.weight, "score": round(h_score.score, 1), "rationale": h_score.rationale},
                "location": {"weight": l_score.weight, "score": round(l_score.score, 1), "rationale": l_score.rationale},
            }
        }


if __name__ == "__main__":
    coordinator = CoordinatorAgent()
    sample_sos = {
        "sos_id": "test-sos-101",
        "timestamp": time.time() - (24 * 60), # 24 minutes ago
        "emergency_type": 2, # Flood
        "medical_urgency": 2, # Severe Trauma
        "total_people": 6,
        "elderly_count": 2,
        "children_count": 1,
        "vulnerable_count": 3,
        "battery_pct": 28,
        "accuracy_meters": 8,
        "hazards": {
            "rising_water": True,
            "structural_collapse": False,
            "electrical_hazard": True
        }
    }
    result = coordinator.evaluate_sos(sample_sos)
    print("Multi-Agent AI Triage Result:")
    print(f"  Score: {result['priority_score']} [{result['category']}]")
    print(f"  Explanation: {result['explanation']}")
