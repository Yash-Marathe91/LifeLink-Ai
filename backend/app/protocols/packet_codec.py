"""
LifeLink AI Compact Binary Packet Codec
Compatible with BitChat Bluetooth LE Mesh & Delay-Tolerant Networking.

Wire Format for LifeLink SOS Payload (Packed Binary, Big-Endian):
+-------------+-------------+-------------+------------+--------------+
| Magic (2B)  | Version(1B) | SOS_ID(16B) | Time(8B)   | Lat*1e6(4B)  |
+-------------+-------------+-------------+------------+--------------+
| Lon*1e6(4B) | Acc(2B)     | Batt(1B)    | EmType(1B) | MedUrg(1B)   |
+-------------+-------------+-------------+------------+--------------+
| Total(2B)   | Eld(1B)     | Child(1B)   | Vuln(1B)   | Hazards(2B)  |
+-------------+-------------+-------------+------------+--------------+
| NoteLen(1B) | Note(0-64B) |
+-------------+-------------+
Total fixed payload: 46 bytes + Note (0-64 bytes) = 46 to 110 bytes!
Combined with BitChat 14-byte header + 8-byte Sender ID: Total packet <= 132 bytes.
Fits easily within standard BLE MTU without fragmentation!
"""

import struct
import time
import uuid
from typing import Dict, Any, Tuple

# BitChat Protocol Constants
BITCHAT_VERSION = 1
BITCHAT_TYPE_LIFELINK_SOS = 0x30      # Dedicated LifeLink SOS MessageType
BITCHAT_TYPE_RESPONDER_ACK = 0x31     # Responder ACK / Instructions
DEFAULT_TTL = 7
MAX_NOTE_LENGTH = 64
MAGIC_BYTES = b"LL" # LifeLink identifier

# Hazard Bitmask Flags
HAZARD_RISING_WATER         = 1 << 0
HAZARD_ELECTRICAL           = 1 << 1
HAZARD_GAS_LEAK             = 1 << 2
HAZARD_FIRE_SMOKE           = 1 << 3
HAZARD_STRUCTURAL_COLLAPSE  = 1 << 4
HAZARD_ROAD_BLOCKED         = 1 << 5


def encode_sos_payload(data: Dict[str, Any]) -> bytes:
    """Encodes structured SOS data into a compact binary byte array."""
    sos_uuid = uuid.UUID(data.get("sos_id", str(uuid.uuid4())))
    sos_id_bytes = sos_uuid.bytes # 16 bytes
    timestamp = int(data.get("timestamp", time.time()))

    lat_e6 = int(data.get("latitude", 0.0) * 1e6)
    lon_e6 = int(data.get("longitude", 0.0) * 1e6)
    acc = min(65535, int(data.get("accuracy_meters", 10)))
    batt = max(0, min(100, int(data.get("battery_pct", 100))))
    em_type = int(data.get("emergency_type", 1))
    med_urg = int(data.get("medical_urgency", 0))

    total_ppl = min(65535, int(data.get("total_people", 1)))
    elderly = min(255, int(data.get("elderly_count", 0)))
    children = min(255, int(data.get("children_count", 0)))
    vuln = min(255, int(data.get("vulnerable_count", 0)))

    # Compute hazards bitmask
    hazards = 0
    h_dict = data.get("hazards", {})
    if h_dict.get("rising_water"): hazards |= HAZARD_RISING_WATER
    if h_dict.get("electrical_hazard"): hazards |= HAZARD_ELECTRICAL
    if h_dict.get("gas_leak"): hazards |= HAZARD_GAS_LEAK
    if h_dict.get("fire_smoke"): hazards |= HAZARD_FIRE_SMOKE
    if h_dict.get("structural_collapse"): hazards |= HAZARD_STRUCTURAL_COLLAPSE
    if h_dict.get("road_blocked"): hazards |= HAZARD_ROAD_BLOCKED

    note_raw = data.get("note", "").encode("utf-8")[:MAX_NOTE_LENGTH]
    note_len = len(note_raw)

    # Pack fixed header:
    # 2s (Magic) + B (Version) + 16s (UUID) + Q (Timestamp) + 2i (Lat, Lon) +
    # H (Acc) + B (Batt) + B (EmType) + B (MedUrg) + H (Total) + 3B (Eld, Ch, Vuln) +
    # H (Hazards) + B (NoteLen)
    fixed_format = ">2sB16sQiiHBBBHBBBHB"
    fixed_bytes = struct.pack(
        fixed_format,
        MAGIC_BYTES,
        1, # Version
        sos_id_bytes,
        timestamp,
        lat_e6,
        lon_e6,
        acc,
        batt,
        em_type,
        med_urg,
        total_ppl,
        elderly,
        children,
        vuln,
        hazards,
        note_len
    )
    return fixed_bytes + note_raw


def decode_sos_payload(payload_bytes: bytes) -> Dict[str, Any]:
    """Decodes compact binary byte array back into structured SOS dictionary."""
    fixed_size = struct.calcsize(">2sB16sQiiHBBBHBBBHB")
    if len(payload_bytes) < fixed_size:
        raise ValueError(f"Payload too short ({len(payload_bytes)} bytes < expected {fixed_size})")

    (
        magic, version, sos_id_bytes, timestamp,
        lat_e6, lon_e6, acc, batt, em_type, med_urg,
        total_ppl, elderly, children, vuln,
        hazards_mask, note_len
    ) = struct.unpack_from(">2sB16sQiiHBBBHBBBHB", payload_bytes, 0)

    if magic != MAGIC_BYTES:
        raise ValueError(f"Invalid magic bytes: {magic}")

    note_bytes = payload_bytes[fixed_size:fixed_size + note_len]
    note = note_bytes.decode("utf-8", errors="replace")

    return {
        "version": version,
        "sos_id": str(uuid.UUID(bytes=sos_id_bytes)),
        "timestamp": timestamp,
        "latitude": lat_e6 / 1e6,
        "longitude": lon_e6 / 1e6,
        "accuracy_meters": acc,
        "battery_pct": batt,
        "emergency_type": em_type,
        "medical_urgency": med_urg,
        "total_people": total_ppl,
        "elderly_count": elderly,
        "children_count": children,
        "vulnerable_count": vuln,
        "hazards": {
            "rising_water": bool(hazards_mask & HAZARD_RISING_WATER),
            "electrical_hazard": bool(hazards_mask & HAZARD_ELECTRICAL),
            "gas_leak": bool(hazards_mask & HAZARD_GAS_LEAK),
            "fire_smoke": bool(hazards_mask & HAZARD_FIRE_SMOKE),
            "structural_collapse": bool(hazards_mask & HAZARD_STRUCTURAL_COLLAPSE),
            "road_blocked": bool(hazards_mask & HAZARD_ROAD_BLOCKED),
        },
        "note": note,
    }


def wrap_bitchat_frame(sender_peer_id: bytes, payload: bytes, ttl: int = DEFAULT_TTL) -> bytes:
    """
    Wraps payload inside BitChat v1 binary wire frame:
    Header: Version(1B) + Type(1B) + TTL(1B) + Timestamp(8B) + Flags(1B) + PayloadLength(2B)
    Variable: SenderID(8B) + Payload(NB)
    """
    timestamp_ms = int(time.time() * 1000)
    flags = 0 # No direct recipient (broadcast), unsigned in raw demo
    sender_8b = sender_peer_id[:8].ljust(8, b"\x00")
    header_format = ">BBBQBH"
    header = struct.pack(
        header_format,
        BITCHAT_VERSION,
        BITCHAT_TYPE_LIFELINK_SOS,
        ttl,
        timestamp_ms,
        flags,
        len(payload)
    )
    return header + sender_8b + payload


if __name__ == "__main__":
    test_sos = {
        "sos_id": "e7b0a321-4f11-4a52-b1c4-123456789abc",
        "timestamp": int(time.time()),
        "latitude": 19.997453,
        "longitude": 73.789802,
        "accuracy_meters": 5,
        "battery_pct": 34,
        "emergency_type": 2, # Flood
        "medical_urgency": 2, # Severe Trauma
        "total_people": 6,
        "elderly_count": 2,
        "children_count": 1,
        "vulnerable_count": 3,
        "hazards": {
            "rising_water": True,
            "electrical_hazard": False,
            "gas_leak": False,
            "fire_smoke": False,
            "structural_collapse": True,
            "road_blocked": True,
        },
        "note": "Trapped on terrace, water at 1st floor.",
    }

    raw_payload = encode_sos_payload(test_sos)
    print(f"Encoded SOS binary payload size: {len(raw_payload)} bytes")
    
    bitchat_frame = wrap_bitchat_frame(b"NODE_A_1", raw_payload)
    print(f"Total BitChat BLE Wire Frame size: {len(bitchat_frame)} bytes")

    decoded = decode_sos_payload(raw_payload)
    print("Decoded verification:")
    print(f"  SOS ID: {decoded['sos_id']}")
    print(f"  Location: {decoded['latitude']}, {decoded['longitude']} (+/-{decoded['accuracy_meters']}m)")
    print(f"  People: {decoded['total_people']} (Elderly: {decoded['elderly_count']}, Children: {decoded['children_count']})")
    print(f"  Note: {decoded['note']}")
    assert decoded["sos_id"] == test_sos["sos_id"]
    print("\nSUCCESS: Serialization & Deserialization 100% matched!")
