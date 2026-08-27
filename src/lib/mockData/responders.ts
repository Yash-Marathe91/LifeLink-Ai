import { ResponderTeam } from '../types';

export const mockResponders: ResponderTeam[] = [
  {
    id: 'R-17',
    name: 'Unit R-17 (Amphibious Alpha)',
    type: 'AMPHIBIOUS_RESCUE',
    status: 'EN_ROUTE',
    personnelCount: 6,
    currentIncidentId: 'INC-2048',
    location: {
      lat: 26.1420,
      lng: 91.7340,
      sector: 'Sector 4'
    },
    equipment: ['Rigid Inflatable Boat x2', 'Biometric Monitors', 'Hypothermia Kits'],
    batteryPercent: 88,
    distanceKm: 0.4,
    etaMinutes: 4
  },
  {
    id: 'R-08',
    name: 'Hazmat Unit R-08',
    type: 'HAZMAT',
    status: 'EN_ROUTE',
    personnelCount: 4,
    currentIncidentId: 'INC-2051',
    location: {
      lat: 26.1580,
      lng: 91.7480,
      sector: 'Sector 9'
    },
    equipment: ['Decontamination Suits', 'Fuel Neutralizer', 'Gas Detectors'],
    batteryPercent: 92,
    distanceKm: 1.2,
    etaMinutes: 8
  },
  {
    id: 'R-23',
    name: 'Medical Fast Response R-23',
    type: 'MEDICAL_RESPONSE',
    status: 'AVAILABLE',
    personnelCount: 5,
    location: {
      lat: 26.1490,
      lng: 91.7400,
      sector: 'Sector 4'
    },
    equipment: ['Portable Ventilators', 'Defibrillator', 'Trauma Supplies'],
    batteryPercent: 95,
    distanceKm: 0.8,
    etaMinutes: 0
  },
  {
    id: 'R-04',
    name: 'Air Rescue Chopper R-04',
    type: 'AIR_SUPPORT',
    status: 'AVAILABLE',
    personnelCount: 4,
    location: {
      lat: 26.1100,
      lng: 91.7000,
      sector: 'Base Helipad'
    },
    equipment: ['Winch System', 'Thermal Imaging', 'Floodlights'],
    batteryPercent: 78,
    distanceKm: 4.5,
    etaMinutes: 0
  }
];
