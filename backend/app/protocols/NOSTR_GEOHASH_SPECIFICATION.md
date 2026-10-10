# LifeLink AI — Nostr Geohash Sync & Fallback Transport Specification

## 1. Overview
In disaster scenarios, central cloud infrastructure (AWS/GCP/local government servers) may face partial internet routing failures, DNS outages, or severe bandwidth choking.

To guarantee zero single-point-of-failure, LifeLink AI adopts **BitChat's Nostr Relay transport** as an internet-level fallback and decentralized synchronization backbone.

---

## 2. Spatial Indexing via Geohash Channels
Rather than flooding global relays with unorganized SOS messages, LifeLink AI maps distress traffic to geographic cells using **Geohashes**:

| Precision | Cell Dimensions | LifeLink Topic Name | Operational Scope |
| :--- | :--- | :--- | :--- |
| **Length 7** | ~150 m $\times$ 150 m | `block#<geohash7>` | Building / City block level |
| **Length 6** | ~1.2 km $\times$ 0.6 km | `neighborhood#<geohash6>` | Ward / Neighborhood emergency |
| **Length 5** | ~4.9 km $\times$ 4.9 km | `city#<geohash5>` | City / Taluka level coordination |
| **Length 4** | ~39 km $\times$ 19.5 km | `district#<geohash4>` | District / SDRF Command level |

### Example:
For Nashik coordinates `(19.9975, 73.7898)`:
* Geohash-5 = `tekh8` -> Channel: `city#tekh8`
* Geohash-6 = `tekh8z` -> Channel: `neighborhood#tekh8z`

When an emergency happens, the mobile client or mesh gateway publishes to both `neighborhood#<geohash6>` and `district#<geohash4>`.

---

## 3. Nostr Event Schemas

### A. Public Emergency Beacon Event (Kind: 20008 - Ephemeral Disaster Alert)
```json
{
  "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "pubkey": "d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a",
  "created_at": 1727602800,
  "kind": 20008,
  "tags": [
    ["g", "tekh8z", "geohash"],
    ["g", "tekh8", "geohash_city"],
    ["emergency", "FLOOD_DROWNING"],
    ["urgency", "CRITICAL"],
    ["sos_id", "e7b0a321-4f11-4a52-b1c4-123456789abc"]
  ],
  "content": "{\"latitude\":19.997453,\"longitude\":73.789802,\"accuracy\":5,\"affected\":6,\"elderly\":2,\"children\":1,\"battery\":34,\"note\":\"Trapped on terrace, water rising rapidly.\"}",
  "sig": "30450221008d..."
}
```

### B. Encrypted Private Envelope (Kind: 1059 - Responder Direct Contact)
For confidential victim details (medical conditions, identity, private phone numbers):
* Wrapped using BitChat's authenticated envelope format with XChaCha20-Poly1305.
* Sealed to the control room / NDRF public key so intermediary Nostr relay operators cannot view victim identities.

---

## 4. Relay Selection & Edge Node Deployment
1. **Public Relay Mesh**: Pre-configured list of fast, zero-auth public Nostr relays (e.g. `wss://relay.damus.io`, `wss://nos.lol`, `wss://relay.snort.social`).
2. **Local Edge Relays**:
   * NDRF Disaster Command vehicles carry a low-power single-board computer (Raspberry Pi 5 / mini-PC) running a local embedded Nostr relay (`nostr-rs-relay` or `strfry`).
   * Broadcasts a local Wi-Fi hotspot `LifeLink-Emergency-Relay`.
   * Responders within 300 meters automatically sync without requiring external internet.
