import json
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["Real-Time WebSockets"])

class ConnectionManager:
    def __init__(self):
        # Maps agency_id -> List of active WebSocket connections
        self.active_agencies: Dict[str, List[WebSocket]] = {}
        # Maps user_id -> WebSocket connection
        self.active_citizens: Dict[str, WebSocket] = {}

    async def connect_agency(self, websocket: WebSocket, agency_id: str):
        await websocket.accept()
        if agency_id not in self.active_agencies:
            self.active_agencies[agency_id] = []
        self.active_agencies[agency_id].append(websocket)

    def disconnect_agency(self, websocket: WebSocket, agency_id: str):
        if agency_id in self.active_agencies:
            if websocket in self.active_agencies[agency_id]:
                self.active_agencies[agency_id].remove(websocket)

    async def connect_citizen(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_citizens[user_id] = websocket

    def disconnect_citizen(self, user_id: str):
        if user_id in self.active_citizens:
            del self.active_citizens[user_id]

    async def broadcast_to_agency(self, agency_id: str, message: dict):
        if agency_id in self.active_agencies:
            dead_sockets = []
            for connection in self.active_agencies[agency_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    dead_sockets.append(connection)
            for dead in dead_sockets:
                self.disconnect_agency(dead, agency_id)

    async def send_to_citizen(self, user_id: str, message: dict):
        if user_id in self.active_citizens:
            try:
                await self.active_citizens[user_id].send_text(json.dumps(message))
            except Exception:
                self.disconnect_citizen(user_id)

manager = ConnectionManager()

@router.websocket("/dispatch/{agency_id}")
async def agency_dispatch_socket(websocket: WebSocket, agency_id: str):
    await manager.connect_agency(websocket, agency_id)
    try:
        # Send initial connection status message
        await websocket.send_text(json.dumps({
            "event": "DISPATCH_CHANNEL_CONNECTED",
            "agency_id": agency_id,
            "status": "TELEMETRY_LINK_ESTABLISHED"
        }))
        
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            # Echo or broadcast squad location updates
            if payload.get("event") == "SQUAD_LOCATION_UPDATE":
                await manager.broadcast_to_agency(agency_id, {
                    "event": "SQUAD_POSITION",
                    "squad_id": payload.get("squad_id"),
                    "lat": payload.get("lat"),
                    "lng": payload.get("lng"),
                    "battery": payload.get("battery")
                })
    except WebSocketDisconnect:
        manager.disconnect_agency(websocket, agency_id)

@router.websocket("/citizen/{user_id}")
async def citizen_sos_socket(websocket: WebSocket, user_id: str):
    await manager.connect_citizen(websocket, user_id)
    try:
        await websocket.send_text(json.dumps({
            "event": "CITIZEN_SOS_CHANNEL_ESTABLISHED",
            "user_id": user_id,
            "status": "LINK_ACTIVE"
        }))
        while True:
            data = await websocket.receive_text()
            # Receive client ping or beacon telemetry
    except WebSocketDisconnect:
        manager.disconnect_citizen(user_id)
