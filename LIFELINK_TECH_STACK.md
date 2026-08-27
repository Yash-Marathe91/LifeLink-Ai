# LIFELINK — Detailed Technology Stack & System Requirements

## 1. Project Overview

LIFELINK is an AI-powered, offline-first emergency communication and rescue prioritization platform designed to remain useful when conventional connectivity becomes weak, intermittent, or unavailable.

Core principle:

> No Network ≠ No Help.

The system must support:
- Emergency SOS creation
- Offline-first SOS storage
- Automatic synchronization
- Graceful connectivity switching
- Low-bandwidth emergency packets
- Device-to-device relay architecture
- AI-based emergency prioritization
- AI emergency copilot
- Geospatial emergency visualization
- Rescue-team allocation
- Real-time emergency dashboard
- Secure communication
- Duplicate/replay protection
- Disaster-agnostic architecture
- High reliability under unstable connectivity

Initial prototype: Flood emergency response.

Future support: Earthquakes, landslides, cyclones, forest fires, major accidents, and urban disasters.

## 2. Recommended Overall Stack

| Layer | Technology | Purpose |
|---|---|---|
| Victim Mobile App | Flutter + Dart | Emergency application |
| Responder Mobile App | Flutter + Dart | Rescue-team application |
| Local Database | SQLite + Drift | Offline SOS queue |
| State Management | Riverpod | Predictable application state |
| Networking | Dio | REST communication |
| Connectivity | connectivity_plus | Network detection |
| Location | Geolocator | GPS/location |
| Secure Storage | flutter_secure_storage | Tokens/credentials |
| Backend | Python + FastAPI | Core APIs |
| Validation | Pydantic | API/data validation |
| ORM | SQLAlchemy 2 | Database access |
| Database | PostgreSQL | Primary data store |
| Geospatial | PostGIS | Location/geospatial queries |
| Cache/Queue | Redis | Fast temporary data + jobs |
| Background Jobs | Celery / ARQ | Async processing |
| AI/ML | Python + XGBoost | Emergency prioritization |
| ML Utilities | Scikit-learn | Preprocessing/evaluation |
| AI Agent | LLM + tool-calling | Emergency copilot |
| Vector Search | pgvector | Knowledge retrieval if required |
| Control Dashboard | Next.js + TypeScript | Emergency command centre |
| UI | Tailwind CSS + shadcn/ui | Dashboard interface |
| Maps | Leaflet + OpenStreetMap | Emergency map |
| Realtime | WebSockets | Live dashboard updates |
| Authentication | JWT + OAuth-compatible architecture | Secure access |
| API Documentation | OpenAPI/Swagger | API development/testing |
| Testing | Pytest + Flutter Test | Automated tests |
| API Testing | Postman | Manual API testing |
| Containerization | Docker | Consistent deployment |
| CI/CD | GitHub Actions | Automated testing/deployment |
| Monitoring | Sentry + structured logging | Reliability |
| Deployment | Cloud/VPS | Production infrastructure |

## 3. Frontend Architecture

LIFELINK should have two primary frontend applications:

### A. Victim / Citizen Mobile Application
Flutter + Dart

### B. Emergency Control Centre
Next.js + TypeScript

Optional:

### C. Rescue Team Mobile Application
Flutter + Dart

## 4. Victim Mobile Application

Core technology: Flutter.

Use Flutter for:
- Android application
- iOS application in future
- Shared UI
- Shared business logic

Primary target: Android.

## 5. Flutter Architecture

```text
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   ├── security/
│   ├── utils/
│   └── connectivity/
├── features/
│   ├── sos/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── location/
│   ├── communication/
│   ├── authentication/
│   ├── profile/
│   └── settings/
├── database/
├── services/
└── main.dart
```

Use a feature-first structure instead of putting every screen into one giant directory.

## 6. Flutter State Management

Recommended: Riverpod.

Important states:
- ConnectivityState
- SOSState
- LocationState
- SyncState
- BatteryState
- CommunicationState
- AuthenticationState

## 7. Local Database

Use SQLite + Drift.

Why:
- Reactive queries
- Type-safe database access
- SQLite underneath
- Good Flutter integration
- Suitable for offline-first architecture

Important local tables:
- local_sos
- sync_queue
- communication_attempts
- relay_records
- device_identity
- cached_configuration

## 8. Offline SOS Table

```text
SOS
--------------------------------
id
device_id
created_at
updated_at
latitude
longitude
location_accuracy
location_timestamp
people_count
medical_status
medical_severity
disaster_type
hazard_severity
vulnerability
isolation_level
battery_level
message
sync_status
retry_count
last_sync_attempt
ttl
signature
```

## 9. SOS Synchronization States

```text
LOCAL_ONLY
     ↓
SYNC_PENDING
     ↓
SYNCING
     ↓
SYNCED
```

Failure:

```text
SYNCING
   ↓
SYNC_FAILED
   ↓
SYNC_PENDING
```

## 10. Networking Layer

Use Dio.

Responsibilities:
- REST requests
- timeout management
- retry policies
- interceptors
- authentication headers
- request IDs
- error handling

## 11. Connectivity Detection

Use connectivity_plus.

Do not assume Wi-Fi or mobile network automatically means internet access.

Use two levels:

### Network interface
- Wi-Fi
- Mobile
- None

### Actual reachability
- Reachable
- Unreachable
- Intermittent

## 12. Location

Use Geolocator.

Collect:
- latitude
- longitude
- accuracy
- timestamp

Never send coordinates without their timestamp and accuracy.

If GPS fails, the SOS must still be allowed to proceed.

## 13. Battery Awareness

Store:
- battery_percentage
- charging_status

Use this for SOS metadata and synchronization strategy.

If battery is very low, reduce retry frequency to preserve power.

## 14. Communication Abstraction Layer

Create a CommunicationManager instead of hard-coding one communication method.

```text
CommunicationManager
        │
        ├── InternetTransport
        ├── SMSTransport
        ├── BluetoothRelayTransport
        ├── WiFiDirectTransport
        └── LocalStoreTransport
```

This allows future communication technologies to be added without changing the SOS system.

## 15. Communication Priority

Initial prototype:
1. Internet
2. Local Store-and-Forward

Extended prototype:
1. Internet
2. SMS
3. Nearby Device Relay
4. Local Store-and-Forward

Future:
- Internet
- SMS
- Bluetooth
- Wi-Fi Direct
- LoRa
- Satellite

The Communication Manager selects the highest-priority viable route.

## 16. Device-to-Device Relay Architecture

For advanced implementation:

```text
Victim Device
      ↓
BLE / Wi-Fi Direct
      ↓
Relay Device
      ↓
BLE / Wi-Fi Direct
      ↓
Gateway Device
      ↓
Internet
      ↓
LIFELINK Server
```

Important mechanisms:

### Unique SOS ID
Prevents duplicate records.

### TTL
Prevents unlimited propagation.

Example:
TTL = 5

Each relay decreases it:
5 → 4 → 3 → 2 → 1 → 0

### Seen Cache
Prevents the same SOS from being repeatedly forwarded.

### Packet Integrity
Use cryptographic verification so relay devices cannot silently modify SOS information.

## 17. Backend

Primary backend: Python + FastAPI.

FastAPI acts as the central API gateway.

Responsibilities:
- Authentication
- SOS ingestion
- SOS synchronization
- SOS validation
- Priority processing
- Rescue management
- Location queries
- Communication records
- AI tool APIs
- Dashboard APIs

## 18. Backend Architecture

```text
backend/
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   ├── sos.py
│   │   ├── rescue.py
│   │   ├── teams.py
│   │   ├── locations.py
│   │   └── ai.py
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── ai/
│   ├── communication/
│   ├── security/
│   ├── database/
│   └── main.py
├── tests/
└── requirements.txt
```

## 19. Pydantic

Use Pydantic for strict API validation.

Validate:
- people_count >= 1
- battery = 0–100
- latitude = -90–90
- longitude = -180–180
- medical_severity = allowed enum
- disaster_type = allowed enum

## 20. Database

Use PostgreSQL as the primary database.

Why:
- Reliable
- Mature
- Open source
- Strong transaction support
- Excellent indexing
- Excellent Python support

## 21. PostGIS

Use PostGIS for geospatial functionality.

Enables:
- nearest rescue team queries
- distance calculations
- affected-area queries
- disaster-zone detection
- shelter proximity
- hospital proximity

## 22. Redis

Use Redis for fast temporary operations:
- caching
- rate limiting
- temporary state
- live dashboard state
- job queues

Do not use Redis as the permanent SOS database. PostgreSQL remains the source of truth.

## 23. Background Processing

Use Celery + Redis or ARQ + Redis.

Tasks:
- AI priority calculation
- notification processing
- synchronization jobs
- analytics
- escalation
- cleanup
- periodic checks

Keep the API responsive by moving heavy work to background workers.

## 24. API Design

Use REST APIs initially.

```text
POST   /api/v1/sos
GET    /api/v1/sos
GET    /api/v1/sos/{id}
PATCH  /api/v1/sos/{id}
POST   /api/v1/sos/{id}/sync
POST   /api/v1/sos/{id}/assign
GET    /api/v1/sos/critical
GET    /api/v1/rescue-teams
POST   /api/v1/rescue-teams/{id}/assign
GET    /api/v1/map/emergencies
```

Use API versioning with /api/v1/.

## 25. Idempotency

Every SOS has a unique sos_id.

If the same SOS reaches the server multiple times, the backend must create only one emergency record.

Use a unique database constraint on sos_id plus server-side idempotency logic.

## 26. Real-Time Dashboard

Use WebSockets for real-time updates.

```text
Victim
   ↓
FastAPI
   ↓
PostgreSQL
   ↓
WebSocket
   ↓
Control Dashboard
```

When a new Critical SOS arrives, the dashboard should update without manual refresh.

## 27. Dashboard Frontend

Use Next.js + TypeScript.

Use:
- Tailwind CSS
- shadcn/ui
- Leaflet
- WebSocket client

## 28. Dashboard Main Views

### Emergency Overview
- Total active SOS
- Critical SOS
- High priority
- Unassigned
- Active rescue teams
- Average response time

### Live Map
- SOS
- Rescue teams
- Shelters
- Hospitals
- Disaster zones

### SOS Queue
Sort by:
- Priority
- Risk Score
- Waiting Time

### SOS Detail
- Location
- People
- Medical condition
- Disaster
- Battery
- Risk score
- AI explanation
- Communication history
- Synchronization history
- Rescue assignment

### Rescue Management
- Available
- Assigned
- En Route
- On Scene
- Completed

## 29. Maps

Use Leaflet + OpenStreetMap.

PostGIS handles geographic calculations.

Leaflet handles visualization.

The SOS workflow must not depend on live map tiles.

## 30. AI Architecture

Do not create one giant AI system.

Use two components:

### A. Risk Engine
Machine learning model.

### B. AI Emergency Copilot
LLM-based agent.

```text
             LIFELINK AI
                  │
        ┌─────────┴─────────┐
        │                   │
   Risk Engine          AI Copilot
        │                   │
    XGBoost             LLM Agent
        │                   │
    Risk Score          Tool Calling
        │                   │
        └─────────┬─────────┘
                  ↓
          Emergency Database
```

## 31. AI Risk Engine

Recommended: XGBoost.

Why:
- Excellent for tabular data
- Fast inference
- Works well with small/medium datasets
- More explainable than many deep-learning approaches
- Suitable for structured emergency factors

Use Scikit-learn for preprocessing, evaluation, metrics and train/test splitting.

## 32. AI Input Features

### Human Factors
- people_count
- injured_count
- medical_severity
- vulnerable_people_count

### Disaster Factors
- disaster_type
- hazard_severity
- flood_depth
- fire_proximity
- earthquake_intensity

### Location Factors
- isolation_level
- distance_to_shelter
- distance_to_hospital
- distance_to_rescue_team

### Time Factors
- waiting_time
- sos_age
- last_update_time

### Communication Factors
- connectivity_status
- battery_level
- location_accuracy
- last_sync_time

## 33. AI Output

Model should produce:
- risk_score
- priority_level
- confidence

Example:

```text
Risk Score: 91
Priority: CRITICAL
Confidence: 0.91
```

Generate an explanation using contributing features.

Example:
- Severe medical emergency
- 6 people affected
- High flood severity
- High isolation
- Long waiting time

## 34. AI Dataset

For the prototype, use synthetic emergency scenarios.

Do not represent them as real emergency records.

Generate realistic scenarios containing:
- People
- Medical severity
- Hazard severity
- Vulnerability
- Isolation
- Waiting time
- Location
- Battery
- Distance to help

Target:
Priority = Critical / High / Medium / Low

Development path:

```text
Synthetic Dataset
       ↓
Prototype Model
       ↓
Validated Real-World Dataset
       ↓
Production Model
```

## 35. AI Emergency Copilot

The AI Copilot should not have unrestricted database access.

Use controlled tools:

```text
get_critical_sos()
get_sos_details(sos_id)
get_low_battery_cases()
get_unassigned_cases()
get_nearby_rescue_teams(location)
get_affected_area()
get_active_incidents()
calculate_priority(sos_id)
get_rescue_team_status(team_id)
```

Potential future tools:
- assign_rescue_team()
- escalate_incident()
- update_incident_status()

Sensitive actions should require explicit human confirmation.

## 36. AI Agent Example

Operator:

> Which critical SOS has been waiting the longest?

AI:

```text
SOS-8A71F

Risk: 91/100
Priority: Critical
People: 6
Medical emergency: Yes
Waiting: 47 minutes
Battery: 18%

Recommended action:
Review for immediate rescue assignment.
```

Responses must be generated from live database information.

## 37. Human-in-the-Loop

AI should:
- analyze
- summarize
- prioritize
- recommend

AI should not independently:
- cancel an SOS
- deny emergency assistance
- abandon a case
- make irreversible rescue decisions

For high-impact actions:

```text
AI Recommendation
      ↓
Operator Review
      ↓
Confirm
      ↓
Action
```

## 38. Authentication

Use JWT.

Roles:
- ADMIN
- CONTROL_OPERATOR
- RESCUE_TEAM

Victim devices can use a lightweight device identity model for the prototype.

## 39. Security

Because LIFELINK handles sensitive emergency information, security must be designed from the beginning.

Use:
- HTTPS
- JWT
- secure token storage
- input validation
- rate limiting
- audit logs
- unique SOS IDs
- packet integrity
- encryption
- role-based authorization

Never expose medical information unnecessarily on public maps.

## 40. Rate Limiting

Use Redis-based rate limiting.

Protect against:
- fake SOS spam
- API abuse
- repeated requests
- automated attacks

Emergency SOS limits must be carefully designed so legitimate emergencies are not blocked.

## 41. Performance Strategy

### Mobile
- Offline-first
- Minimal network payloads
- Avoid unnecessary GPS polling
- Local database first
- Batch non-critical synchronization

### Backend
- Async FastAPI
- Database indexes
- Redis caching
- Background jobs
- Connection pooling

### Database
Index:
- sos_id
- priority
- status
- created_at
- location

Use PostGIS spatial indexes.

### Dashboard
- WebSockets
- Pagination
- Server-side filtering
- Lazy loading
- Map clustering

## 42. SOS Packet Optimization

Emergency packets must remain small.

Example:

```json
{
  "id": "SOS-8A71F",
  "ts": 1787674800,
  "lat": 20.0115,
  "lon": 73.7900,
  "acc": 18,
  "p": 6,
  "med": 1,
  "sev": 5,
  "haz": 5,
  "bat": 18,
  "type": "FLOOD"
}
```

Avoid sending images, videos or large attachments during initial emergency transmission.

## 43. Communication States

Every SOS should track:

```text
LOCAL_ONLY
SYNC_PENDING
TRANSMITTING
RELAYING
SYNCED
SYNC_FAILED
```

Dashboard examples:
- OFFLINE QUEUED
- RELAYED
- SYNCED
- LAST SEEN

## 44. Rescue Allocation

Rescue allocation should combine:

```text
Risk
+
Distance
+
Team capability
+
Availability
+
Current workload
```

Example:

```text
Critical SOS
      ↓
Find available teams
      ↓
Filter by capability
      ↓
Calculate distance
      ↓
Check workload
      ↓
Recommend team
      ↓
Human confirms
```

Initially use rule-based allocation. Later it can become an optimization problem.

## 45. Recommended Development Phases

### Phase 1 — Foundation
Build:
- Flutter application
- FastAPI backend
- PostgreSQL
- Basic authentication
- API communication

Goal:

```text
Flutter → FastAPI → PostgreSQL
```

### Phase 2 — SOS
Implement:
- SOS button
- emergency form
- GPS
- battery
- local database
- SOS packet

Goal: Create SOS offline.

### Phase 3 — Offline Synchronization
Implement:
- sync queue
- retry logic
- connectivity detection
- idempotency
- sync states

Goal:

```text
Offline SOS
      ↓
Network returns
      ↓
Automatic synchronization
```

This is the most important milestone.

### Phase 4 — Dashboard
Build:
- live map
- SOS queue
- SOS details
- filters
- communication status

Goal:

```text
Mobile → Backend → Dashboard
```

### Phase 5 — AI
Build:
- synthetic dataset
- feature engineering
- XGBoost model
- priority classification
- explanations

Goal:

```text
SOS → Risk Score → Priority
```

### Phase 6 — Rescue Management
Implement:
- rescue teams
- availability
- assignment
- dispatch
- status tracking

Goal:

```text
SOS → AI Priority → Rescue Team → Resolution
```

### Phase 7 — AI Copilot
Implement:
- LLM
- tool calling
- live database queries
- emergency summaries
- operator recommendations

Goal:

```text
Operator → AI → Tools → Database → Answer
```

### Phase 8 — Advanced Communication
Only after the core system is stable:
- SMS fallback
- Bluetooth relay
- Wi-Fi Direct
- multi-hop relay
- TTL
- duplicate detection
- packet signatures

## 46. Testing Strategy

Test failure conditions, not just normal conditions.

### Test 1
Internet available.
Expected: SOS → Server immediately.

### Test 2
Internet disabled.
Expected: SOS → Local SQLite.

### Test 3
Internet restored.
Expected: SQLite → Server.

### Test 4
Internet drops during upload.
Expected: Safe retry with no duplicate SOS.

### Test 5
GPS unavailable.
Expected: SOS still created.

### Test 6
Battery <10%.
Expected: Emergency remains functional; retry frequency reduced.

### Test 7
Duplicate SOS packet.
Expected: Server ignores duplicate.

### Test 8
500 simulated SOS requests.
Expected: Dashboard remains responsive and AI processes queue.

## 47. Monitoring

Use Sentry for:
- Flutter crashes
- frontend errors
- backend exceptions

Track:
- SOS received
- SOS synced
- SOS failed
- Average sync time
- AI processing time
- API latency
- Database latency
- Active emergencies

## 48. Deployment

### Prototype

Mobile:
APK

Backend:
Docker + FastAPI + PostgreSQL + Redis

Dashboard:
Next.js

### Production Architecture

```text
Users
   ↓
CDN / Load Balancer
   ↓
FastAPI instances
   ↓
Redis
   ↓
PostgreSQL + PostGIS
   ↓
Background Workers
```

Use managed PostgreSQL where possible.

## 49. Recommended Development Environment

### Frontend
- VS Code
- Flutter SDK
- Android Studio
- Dart
- Flutter DevTools

### Backend
- VS Code
- Python 3.x
- FastAPI
- Poetry or uv
- Pytest

### Database
- PostgreSQL
- PostGIS
- pgAdmin / DBeaver

### AI
- Python
- Jupyter
- Scikit-learn
- XGBoost
- Pandas
- NumPy

### API
- Postman
- Swagger/OpenAPI

### DevOps
- Git
- GitHub
- Docker
- GitHub Actions

## 50. Recommended Repository

```text
LIFELINK/
├── mobile/
│   └── lifelink_app/
├── dashboard/
│   └── lifelink_control/
├── backend/
│   └── lifelink_api/
├── ai/
│   ├── datasets/
│   ├── notebooks/
│   ├── training/
│   └── models/
├── communication/
│   ├── protocol/
│   ├── internet/
│   ├── sms/
│   ├── bluetooth/
│   └── wifi_direct/
├── infrastructure/
│   ├── docker/
│   └── deployment/
├── docs/
│   ├── architecture/
│   ├── api/
│   └── security/
└── README.md
```

## 51. Final Recommended Stack

### FRONTEND

Citizen App:
Flutter + Dart
- Riverpod
- Drift / SQLite
- Dio
- Geolocator
- connectivity_plus
- flutter_secure_storage

Rescue Team App:
Flutter + Dart

Emergency Control Centre:
Next.js + TypeScript
- Tailwind CSS
- shadcn/ui
- Leaflet
- WebSocket client

### BACKEND

Python + FastAPI
- Pydantic
- SQLAlchemy 2
- Alembic
- PostgreSQL
- PostGIS
- Redis
- Celery/ARQ
- WebSockets
- JWT

### AI

Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost

AI Risk Engine:

```text
Structured SOS Data
        ↓
Feature Engineering
        ↓
XGBoost
        ↓
Risk Score
        ↓
Priority
```

AI Copilot:

```text
Operator
   ↓
LLM
   ↓
Tool Calling
   ↓
FastAPI
   ↓
PostgreSQL/PostGIS
   ↓
Verified Data
   ↓
AI Response
```

### COMMUNICATION

Initial:
Internet + Offline Store-and-Forward

Next:
SMS + Bluetooth/Wi-Fi Direct Relay

Future:
LoRa + Satellite Gateway

Architecture:

```text
CommunicationManager
        ↓
Best Available Channel
        ↓
Transmit / Relay / Store
```

### DATA

Primary:
PostgreSQL + PostGIS

Local:
SQLite + Drift

Cache:
Redis

Optional semantic knowledge:
pgvector

### MAPS

OpenStreetMap + Leaflet

### DEVOPS

GitHub + Docker + GitHub Actions

Monitoring:
Sentry + structured logging

## 52. What NOT to Use Initially

Avoid unnecessary complexity.

Do NOT start with:
- Kubernetes
- Microservices
- Kafka
- GraphQL
- Multiple databases
- Deep learning
- Computer vision
- LLM-based risk prediction
- Satellite APIs
- Full mesh networking

These can make the project slower to build and harder to demonstrate.

Start with a modular monolith:

```text
FastAPI
+
PostgreSQL
+
Redis
+
AI Worker
```

## 53. MVP Architecture

```text
FLUTTER
  ↓
SQLite / Drift
  ↓
Connectivity Manager
  ↓
Dio
  ↓
FASTAPI
  ↓
PostgreSQL + PostGIS
  ↓
XGBoost
  ↓
NEXT.JS DASHBOARD
  ↓
AI COPILOT
```

Core communication:

```text
ONLINE
SOS → FastAPI → Database

OFFLINE
SOS → SQLite → Queue

NETWORK RETURNS
SQLite → FastAPI → Database

ADVANCED
SOS → Nearby Relay → Gateway → FastAPI
```

## 54. Final Engineering Principle

The entire system should be designed around one rule:

> Every critical operation must be offline-safe, retryable, idempotent, observable, and recoverable.

For LIFELINK, reliability is more important than adding dozens of features.

Development order:

**SOS → Offline Storage → Reliable Synchronization → Dashboard → AI Prioritization → Rescue Allocation → AI Copilot → Device Relay → Advanced Communication**

This gives LIFELINK a fast, reliable and scalable foundation while keeping the architecture ready for advanced emergency communication technologies.
