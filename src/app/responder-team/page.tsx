'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { KPICard } from '@/components/common/KPICard';

import {
  Users,
  Navigation,
  Activity,
  BatteryCharging,
  Radio,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Zap,
  Phone
} from 'lucide-react';

export default function ResponderTeamPage() {
  const [selectedUnitCategory, setSelectedUnitCategory] = useState<'ALL' | 'AMPHIBIOUS' | 'MEDICAL' | 'DRONE' | 'FIRE'>('ALL');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('R-17');

  const responderUnits = [
    {
      id: 'R-17',
      name: 'Amphibious Rescue Unit R-17',
      category: 'AMPHIBIOUS',
      commander: 'Capt. Vikram Singh',
      teamSize: 4,
      assignedIncident: 'INC-2048 (Sector 4 Rooftop 4B)',
      status: 'EN_ROUTE',
      batteryFuel: '84%',
      telemetryVitals: 'Heart Rate: 72 BPM • Normal',
      radioChannel: 'PTT CH-01'
    },
    {
      id: 'M-02',
      name: 'Mobile BLE Relay Drone Squad M-02',
      category: 'DRONE',
      commander: 'Automated Pilot System',
      teamSize: 1,
      assignedIncident: 'Sector 4 Network Mesh Patching',
      status: 'AIRBORNE',
      batteryFuel: '62%',
      telemetryVitals: 'Altitude: 45m • Signal: -58 dBm',
      radioChannel: 'PTT CH-04'
    },
    {
      id: 'A-04',
      name: 'Trauma Evacuation Ambulance A-04',
      category: 'MEDICAL',
      commander: 'Dr. Neha Kapoor',
      teamSize: 3,
      assignedIncident: 'Standby SevenHills Hospital',
      status: 'AVAILABLE',
      batteryFuel: '95%',
      telemetryVitals: 'Oxygen Tanks: 100% Full',
      radioChannel: 'PTT CH-02'
    },
    {
      id: 'F-09',
      name: 'Fire & Rescue Heavy Squad F-09',
      category: 'FIRE',
      commander: 'Cmdr. Suresh Nair',
      teamSize: 6,
      assignedIncident: 'INC-2045 (Structure Debris Clearance)',
      status: 'ON_SCENE',
      batteryFuel: '78%',
      telemetryVitals: 'Air Supply: 82% • Normal',
      radioChannel: 'PTT CH-03'
    }
  ];

  const filteredUnits = responderUnits.filter(unit => {
    if (selectedUnitCategory === 'ALL') return true;
    return unit.category === selectedUnitCategory;
  });

  const currentUnit = responderUnits.find(u => u.id === selectedUnitId) || responderUnits[0];

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FFB020]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Responder Operations & Team Management</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Real-time field unit telemetry, squad dispatch assignments, radio channel pairing & responder biometric health monitoring.
            </p>
          </div>

          <button
            onClick={() => alert('Initiating global squad recall order...')}
            className="px-3.5 py-1.5 rounded-lg bg-[#FFB020] text-black font-bold text-xs hover:bg-[#FFB020]/90 transition-all flex items-center gap-1 font-mono shadow-[0_0_12px_rgba(255,176,32,0.3)]"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>GLOBAL SQUAD TELEMETRY CHECK</span>
          </button>
        </div>

        {/* Top Fleet KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="TOTAL FIELD UNITS"
            value="28 UNITS"
            subtitle="18 Deployed • 8 Standby • 2 Maintenance"
            icon={<Users className="w-5 h-5" />}
            accentColor="amber"
          />
          <KPICard
            title="ACTIVE DEPLOYED"
            value="18 SQUADS"
            subtitle="Operational In Sector 1, 2, 4"
            icon={<Navigation className="w-5 h-5" />}
            accentColor="cyan"
          />
          <KPICard
            title="SQUAD HEALTH SCORE"
            value="100% STABLE"
            subtitle="Zero Biometric Anomalies"
            icon={<Activity className="w-5 h-5" />}
            accentColor="green"
          />
          <KPICard
            title="AVG FLEET BATTERY/FUEL"
            value="84%"
            subtitle="Power Reserves Optimal"
            icon={<BatteryCharging className="w-5 h-5" />}
            accentColor="violet"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 pb-2 border-b border-[#1D252C] font-mono text-xs overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Squads (28)' },
            { id: 'AMPHIBIOUS', label: 'Amphibious Rafts (6)' },
            { id: 'MEDICAL', label: 'Medical Evac (8)' },
            { id: 'DRONE', label: 'Drone Squads (4)' },
            { id: 'FIRE', label: 'Fire & Rescue (10)' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedUnitCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                selectedUnitCategory === cat.id
                  ? 'bg-[#121d24] text-white border border-[#2c363e] font-bold'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 2-Column Grid: Units Roster (7 Cols) & Inspector (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Units Roster List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
                className={`bg-[#0b0e11] border rounded-xl p-5 space-y-3 cursor-pointer transition-all shadow-lg ${
                  selectedUnitId === unit.id
                    ? 'border-[#FFB020] bg-[#FFB020]/5 ring-1 ring-[#FFB020]/40'
                    : 'border-[#1D252C] hover:border-[#2c363e]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#FFB020]">{unit.id}</span>
                    <h3 className="text-base font-bold text-white">{unit.name}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    unit.status === 'EN_ROUTE' ? 'bg-[#36C5F0]/20 text-[#36C5F0]' :
                    unit.status === 'ON_SCENE' ? 'bg-[#32D583]/20 text-[#32D583]' : 'bg-[#121d24] text-[#8f9194]'
                  }`}>
                    {unit.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[#8f9194] block">COMMANDER:</span>
                    <span className="text-white font-bold">{unit.commander}</span>
                  </div>
                  <div>
                    <span className="text-[#8f9194] block">ASSIGNED INCIDENT:</span>
                    <span className="text-[#36C5F0] font-bold">{unit.assignedIncident}</span>
                  </div>
                  <div>
                    <span className="text-[#8f9194] block">BATTERY / FUEL:</span>
                    <span className="text-[#32D583] font-bold">{unit.batteryFuel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Unit Inspector (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div>
                <span className="text-xs font-mono text-[#FFB020] font-bold">{currentUnit.id} SQUAD INSPECTOR</span>
                <h3 className="text-base font-bold text-white mt-0.5">{currentUnit.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FFB020]/20 text-[#FFB020] text-xs font-mono font-bold">
                {currentUnit.status}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">COMMANDER:</span>
                  <span className="text-white font-bold">{currentUnit.commander}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">TEAM SIZE:</span>
                  <span className="text-white font-bold">{currentUnit.teamSize} Officers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">RADIO CHANNEL:</span>
                  <span className="text-[#36C5F0] font-bold">{currentUnit.radioChannel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">BIOMETRIC TELEMETRY:</span>
                  <span className="text-[#32D583] font-bold">{currentUnit.telemetryVitals}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => alert(`Reassigning Unit ${currentUnit.id} to new incident...`)}
                  className="flex-1 py-2.5 rounded-lg bg-[#FFB020] text-black font-mono font-bold text-xs hover:bg-[#FFB020]/90 transition-all flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(255,176,32,0.3)]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>REASSIGN INCIDENT</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
