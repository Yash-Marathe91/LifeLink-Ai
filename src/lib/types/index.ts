export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type DisasterType = 'FLOOD' | 'EARTHQUAKE' | 'LANDSLIDE' | 'CYCLONE' | 'FIRE' | 'URBAN';

export type IncidentStatus = 
  | 'LOCAL_ONLY'
  | 'SYNC_PENDING'
  | 'QUEUED'
  | 'VERIFIED'
  | 'RESPONDER_ASSIGNED'
  | 'EN_ROUTE'
  | 'ON_SCENE'
  | 'RESOLVED';

export type ConnectivityTransport = 'INTERNET' | 'SMS' | 'BLE_MESH' | 'WIFI_DIRECT' | 'STORE_FORWARD';

export interface Incident {
  id: string;
  deviceId: string;
  title: string;
  disasterType: DisasterType;
  severity: SeverityLevel;
  riskScore: number; // 0-100
  peopleCount: number;
  injuredCount: number;
  vulnerableCount: number;
  medicalStatus: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    sector: string;
    isolationLevel: 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW';
  };
  status: IncidentStatus;
  transport: ConnectivityTransport;
  batteryLevel: number;
  timestamp: string;
  waitingMinutes: number;
  assignedResponderId?: string;
  assignedResponderName?: string;
  aiExplanation: string[];
  aiConfidence: number;
}

export interface ResponderTeam {
  id: string;
  name: string;
  type: 'AMPHIBIOUS_RESCUE' | 'MEDICAL_RESPONSE' | 'HAZMAT' | 'AIR_SUPPORT' | 'SEARCH_RESCUE';
  status: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'OFFLINE';
  personnelCount: number;
  currentIncidentId?: string;
  location: {
    lat: number;
    lng: number;
    sector: string;
  };
  equipment: string[];
  batteryPercent: number;
  distanceKm: number;
  etaMinutes: number;
}

export interface NetworkRelayNode {
  id: string;
  name: string;
  type: 'GATEWAY' | 'REPEAT_RELAY' | 'MOBILE_AP' | 'SATELLITE_LINK';
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' | 'OFFLINE';
  batteryPercent: number;
  activeRelays: number;
  bandwidthKbps: number;
  sector: string;
}

export interface ActivityTimelineItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'OPERATOR' | 'AI_RISK_ENGINE' | 'RESPONDER' | 'SYSTEM';
  action: string;
  incidentId?: string;
  severity?: SeverityLevel;
}

export interface CommandCenterKPIs {
  activeIncidentsTotal: number;
  criticalIncidentsCount: number;
  unassignedIncidentsCount: number;
  activeRespondersCount: number;
  avgResponseTimeMinutes: number;
  networkResiliencePercent: number;
  aiEngineConfidence: number;
}
