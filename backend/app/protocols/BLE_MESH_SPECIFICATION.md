# LifeLink AI — Bluetooth LE Mesh & Delay-Tolerant Network Specification

## 1. Overview
This specification defines the multi-hop Bluetooth Low Energy (BLE) mesh and Delay-Tolerant Networking (DTN) store-and-forward protocol adapted from **BitChat** for **LifeLink AI**.

In catastrophic disaster environments (floods, earthquakes, cyclones), cellular towers and terrestrial internet collapse. LifeLink AI utilizes a hybrid peer-to-peer transport to transmit life-critical SOS packets without infrastructure.

```
[Trapped Victim Device] 
         │ (BLE Hop 1, TTL=7)
         ▼
[Neighbor / Passing Phone] 
         │ (BLE Hop 2, TTL=6)
         ▼
[Community Shelter Node] 
         │ (BLE Hop 3, TTL=5)
         ▼
[NDRF Rescue Boat / Drone / Field Gateway] ──► (Satellite / Starlink / 4G) ──► [FastAPI Backend]
```

---

## 2. Node Roles & Concurrency Contract
Every mobile device running LifeLink AI operates simultaneously in two Bluetooth GATT modes:
1. **GATT Peripheral (Advertiser)**: Periodically broadcasts presence beacons and transmits outgoing SOS / ACK packets via BLE advertisement data or GATT characteristics.
2. **GATT Central (Scanner)**: Continuously/duty-cycled scans for nearby peer advertisements, connects to discovered peers, and receives incoming packet buffers.

### Energy-Conserving Duty Cycling
Disaster victims often face limited device battery. The mesh implements adaptive duty cycles:
* **High-Urgency Mode (Active SOS Sent / Battery > 50%)**:
  * Scan: 1.2s ON / 0.8s OFF (60% duty cycle)
  * Advertise Interval: 100ms
* **Standard Conservation Mode (Relay Node / Battery 20–50%)**:
  * Scan: 0.5s ON / 2.5s OFF (16% duty cycle)
  * Advertise Interval: 250ms
* **Ultra-Low Survival Mode (Battery < 20%)**:
  * Scan: 0.2s ON / 5.0s OFF (4% duty cycle)
  * Advertise Interval: 1000ms

---

## 3. Wire Framing & Header Format
All packets use BitChat v1 network byte order (big-endian):

```
Header (14 bytes fixed):
+---------+---------+-----+-----------+-------+---------------+
| Version | Type    | TTL | Timestamp | Flags | PayloadLength |
| 1 byte  | 1 byte  | 1B  | 8 bytes   | 1 B   | 2 bytes       |
+---------+---------+-----+-----------+-------+---------------+

Variable Sections:
+---------------+-----------------+-------------------+-------------------+
| Sender PeerID | Recipient PeerID| Encrypted Payload | Ed25519 Signature |
| 8 bytes       | 8 bytes (opt.)  | Variable (<469B)  | 64 bytes (opt.)   |
+---------------+-----------------+-------------------+-------------------+
```

### Packet Types:
* `0x30` (`LIFELINK_SOS_BROADCAST`): LifeLink Distress Packet (Broadcast, Directed or DTN).
* `0x31` (`LIFELINK_RESPONDER_ACK`): Rescue confirmation & instructions back to victim.
* `0x01` (`ANNOUNCE`): Presence beacon with short ephemeral Peer ID.
* `0x04` (`COURIER_ENVELOPE`): Encrypted store-and-forward sealed packet for physical carriage.

---

## 4. Flood Control & Relay Algorithm
To prevent radio saturation ("broadcast storm problem") across dense disaster camps:

1. **Hop Count / TTL**:
   * Packets originate with `TTL = 7`.
   * Each relay node decrements TTL by 1 (`TTL = TTL - 1`). If `TTL == 0`, packet is dropped.
   * If local connection degree is high ($\ge 6$ neighbors), TTL is clamped to 5.
2. **Deduplication LRU Seen-Set**:
   * Every node maintains an in-memory LRU cache of `(sender_peer_id, timestamp, sos_id)` tuples (capacity: 2000 entries, retention: 10 minutes).
   * If a packet arrives whose `sos_id` is already in the seen-set, it is immediately discarded.
3. **Randomized Relay Jitter**:
   * Relays do NOT retransmit immediately upon receipt.
   * A uniform random delay between **20 ms and 200 ms** is applied before broadcasting.
   * If a duplicate packet arrives from another neighbor during this jitter window, the scheduled transmission is cancelled (suppression).
4. **Split-Horizon Suppression**:
   * Packets are never retransmitted back onto the radio link from which they were just received.

---

## 5. Delay-Tolerant Opportunistic Courier ("Spray-and-Wait")
When no multi-hop route reaches a connected gateway (e.g. an isolated pocket of victims):
1. **Envelope Creation**: The SOS is sealed into an encrypted courier envelope.
2. **Spray Budget**:
   * The originating node assigns an initial copy budget $L = 4$.
   * When meeting a moving peer (another evacuee or volunteer), the device hands over $\lfloor L/2 \rfloor$ copies to that peer and retains $\lceil L/2 \rceil$.
   * As people move physically through flood waters or roads, they physically carry these envelopes ("data mules").
3. **Gateway Handover**:
   * When any phone running LifeLink AI comes into contact with an NDRF field vehicle, drone gateway, or satellite terminal, it automatically drains all carried courier envelopes over a high-speed direct BLE/Wi-Fi link.
   * The gateway forwards the packets upstream to the FastAPI backend with deduplication.

---

## 6. Two-Way Responder Communication
1. When control room dispatchers assign a team (e.g. "NDRF Team Bravo-3"), the Next.js Dashboard issues an ACK command.
2. If the gateway has direct or mesh connectivity to the victim's geohash, it injects a `LIFELINK_RESPONDER_ACK` packet (`Type 0x31`) into the mesh targeted to `target_sos_id`.
3. The victim's phone displays:
   > 🟢 **RESCUE DISPATCHED**: NDRF Team Bravo-3 (ETA ~15 mins).
   > *Instructions*: Move to terrace/higher ground, signal with flashlight.
