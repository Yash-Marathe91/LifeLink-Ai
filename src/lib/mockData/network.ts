import { NetworkRelayNode, ActivityTimelineItem } from '../types';

export const mockNetworkNodes: NetworkRelayNode[] = [
  {
    id: 'G-02',
    name: 'Sector 4 Main Gateway (Satellite Relay)',
    type: 'GATEWAY',
    status: 'OPTIMAL',
    batteryPercent: 94,
    activeRelays: 42,
    bandwidthKbps: 256,
    sector: 'Sector 4'
  },
  {
    id: 'N-07',
    name: 'Mesh Node N-07 (High Water Tower)',
    type: 'REPEAT_RELAY',
    status: 'DEGRADED',
    batteryPercent: 24,
    activeRelays: 18,
    bandwidthKbps: 64,
    sector: 'Sector 4'
  },
  {
    id: 'N-09',
    name: 'Mesh Node N-09 (Hospital Roof)',
    type: 'REPEAT_RELAY',
    status: 'OPTIMAL',
    batteryPercent: 88,
    activeRelays: 31,
    bandwidthKbps: 128,
    sector: 'Sector 4'
  },
  {
    id: 'G-04',
    name: 'Mobile Command Van Gateway G-04',
    type: 'MOBILE_AP',
    status: 'OPTIMAL',
    batteryPercent: 100,
    activeRelays: 15,
    bandwidthKbps: 512,
    sector: 'Sector 2'
  }
];

export const mockActivityTimeline: ActivityTimelineItem[] = [
  {
    id: 'ACT-101',
    timestamp: '15:18:02',
    actor: 'Operator Priya K.',
    actorRole: 'OPERATOR',
    action: 'Dispatched Amphibious Unit R-17 to INC-2048 (Sector 4 Rooftop)',
    incidentId: 'INC-2048',
    severity: 'CRITICAL'
  },
  {
    id: 'ACT-102',
    timestamp: '15:14:45',
    actor: 'AI Risk Engine',
    actorRole: 'AI_RISK_ENGINE',
    action: 'Escalated INC-2048 to CRITICAL priority (Risk Score: 94). Telemetry verified via BLE Mesh.',
    incidentId: 'INC-2048',
    severity: 'CRITICAL'
  },
  {
    id: 'ACT-103',
    timestamp: '15:10:12',
    actor: 'System Auto-Sync',
    actorRole: 'SYSTEM',
    action: 'Node N-07 battery dropped to 24%. Traffic re-routed through Gateway G-02.',
    severity: 'HIGH'
  },
  {
    id: 'ACT-104',
    timestamp: '15:02:50',
    actor: 'Responder Unit R-08',
    actorRole: 'RESPONDER',
    action: 'En route to Substation 9 (INC-2051). ETA 8 minutes.',
    incidentId: 'INC-2051',
    severity: 'HIGH'
  },
  {
    id: 'ACT-105',
    timestamp: '14:58:19',
    actor: 'AI Copilot',
    actorRole: 'AI_RISK_ENGINE',
    action: 'Suggested fast medical dispatch for INC-2049 due to rising basement water levels.',
    incidentId: 'INC-2049',
    severity: 'CRITICAL'
  }
];
