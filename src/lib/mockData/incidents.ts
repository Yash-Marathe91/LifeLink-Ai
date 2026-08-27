import { Incident, CommandCenterKPIs } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2048',
    deviceId: 'DEV-88A9F',
    title: 'Flash Flood Trap - 6 Isolated Citizens (Medical Critical)',
    disasterType: 'FLOOD',
    severity: 'CRITICAL',
    riskScore: 94,
    peopleCount: 6,
    injuredCount: 2,
    vulnerableCount: 3,
    medicalStatus: 'Severe hypothermia & chest trauma reported via low-bandwidth telemetry.',
    location: {
      lat: 26.1445,
      lng: 91.7362,
      address: 'Rooftop 4B, Riverbank Colony, Sector 4',
      sector: 'Sector 4',
      isolationLevel: 'EXTREME',
    },
    status: 'RESPONDER_ASSIGNED',
    transport: 'BLE_MESH',
    batteryLevel: 18,
    timestamp: '14:32:05',
    waitingMinutes: 47,
    assignedResponderId: 'R-17',
    assignedResponderName: 'Unit R-17 (Amphibious Alpha)',
    aiExplanation: [
      'Extremely low battery remaining (18%) on victim device',
      'High isolation level with 2 injured elderly citizens',
      'Water rising rapidly (+15cm/hr estimated by sensor node N-07)',
      'Signal relayed across 3 hop nodes (N-07 -> N-09 -> G-02)'
    ],
    aiConfidence: 96
  },
  {
    id: 'INC-2049',
    deviceId: 'DEV-99B12',
    title: 'Structure Collapse Risk - Community Shelter B',
    disasterType: 'FLOOD',
    severity: 'CRITICAL',
    riskScore: 89,
    peopleCount: 14,
    injuredCount: 1,
    vulnerableCount: 5,
    medicalStatus: '1 limb fracture, non-life-threatening.',
    location: {
      lat: 26.1512,
      lng: 91.7420,
      address: 'East Wing Basement, Sector 4 High School',
      sector: 'Sector 4',
      isolationLevel: 'HIGH',
    },
    status: 'QUEUED',
    transport: 'SMS',
    batteryLevel: 42,
    timestamp: '14:40:12',
    waitingMinutes: 38,
    aiExplanation: [
      'High density of vulnerable occupants (5 children/elderly)',
      'Basement flooding reported near main electrical distribution panel',
      'Requires heavy water extraction pump unit'
    ],
    aiConfidence: 91
  },
  {
    id: 'INC-2050',
    deviceId: 'DEV-44C01',
    title: 'Landslide Debris Blockade - Medical Transport Stalled',
    disasterType: 'LANDSLIDE',
    severity: 'HIGH',
    riskScore: 78,
    peopleCount: 3,
    injuredCount: 1,
    vulnerableCount: 0,
    medicalStatus: 'Oxygen supply depleting for transport patient.',
    location: {
      lat: 26.1380,
      lng: 91.7289,
      address: 'Hillside Pass KM-12, Sector 2',
      sector: 'Sector 2',
      isolationLevel: 'HIGH',
    },
    status: 'QUEUED',
    transport: 'INTERNET',
    batteryLevel: 65,
    timestamp: '14:48:30',
    waitingMinutes: 30,
    aiExplanation: [
      'Critical medical time constraint: Oxygen capacity under 25 mins',
      'Roadway obstruction requires earthmoving team clearance'
    ],
    aiConfidence: 88
  },
  {
    id: 'INC-2051',
    deviceId: 'DEV-12D90',
    title: 'Power Station Submergence & Toxic Fuel Leak',
    disasterType: 'URBAN',
    severity: 'HIGH',
    riskScore: 72,
    peopleCount: 4,
    injuredCount: 0,
    vulnerableCount: 0,
    medicalStatus: 'No injuries. Chemical hazard warning.',
    location: {
      lat: 26.1601,
      lng: 91.7510,
      address: 'Substation 9, Industrial Zone C',
      sector: 'Sector 9',
      isolationLevel: 'MODERATE',
    },
    status: 'RESPONDER_ASSIGNED',
    transport: 'INTERNET',
    batteryLevel: 78,
    timestamp: '14:55:00',
    waitingMinutes: 23,
    assignedResponderId: 'R-08',
    assignedResponderName: 'Hazmat Unit R-08',
    aiExplanation: [
      'Environmental threat: Potential chemical contamination of water source',
      'Requires hazmat containment protocol before evacuation'
    ],
    aiConfidence: 85
  },
  {
    id: 'INC-2052',
    deviceId: 'DEV-77E55',
    title: 'Stranded Livestock & Farmer Family on Embankment',
    disasterType: 'FLOOD',
    severity: 'MEDIUM',
    riskScore: 54,
    peopleCount: 5,
    injuredCount: 0,
    vulnerableCount: 2,
    medicalStatus: 'Stable. Supply distress.',
    location: {
      lat: 26.1290,
      lng: 91.7190,
      address: 'North Embankment Ring 3, Sector 1',
      sector: 'Sector 1',
      isolationLevel: 'MODERATE',
    },
    status: 'QUEUED',
    transport: 'STORE_FORWARD',
    batteryLevel: 31,
    timestamp: '15:02:18',
    waitingMinutes: 16,
    aiExplanation: [
      'Safe from immediate rising water for next 6 hours',
      'Requires food & water supply drop rather than immediate air evacuation'
    ],
    aiConfidence: 82
  }
];

export const mockSystemKPIs: CommandCenterKPIs = {
  activeIncidentsTotal: 18,
  criticalIncidentsCount: 5,
  unassignedIncidentsCount: 7,
  activeRespondersCount: 12,
  avgResponseTimeMinutes: 11.4,
  networkResiliencePercent: 94.2,
  aiEngineConfidence: 93.8
};
