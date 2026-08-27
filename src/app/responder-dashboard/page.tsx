'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';

import {
  Truck,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Battery,
  Radio,
  MapPin,
  Shield,
  Phone,
  MessageSquare,
  Mic,
  Package,
  Building,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Compass
} from 'lucide-react';

export default function ResponderDashboardPage() {
  const [missionStatus, setMissionStatus] = useState<'EN_ROUTE' | 'ON_SCENE' | 'PATIENT_SECURED' | 'RETURN_BASE'>('EN_ROUTE');
  const [radioActive, setRadioActive] = useState(false);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#32D583]" />
              <h1 className="text-xl font-bold text-[#F5F7F8] tracking-tight">05 — Responder Mission Control Dashboard</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Tactical navigation, active rescue mission telemetry, crew loadout & dispatch radio stream for Unit R-17.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#32D583]/15 border border-[#32D583]/30 text-[#32D583] font-mono text-xs font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>UNIT R-17 ALPHA • ONLINE</span>
            </span>
          </div>
        </div>

        {/* Unit Status Switcher Bar */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#32D583]/20 border border-[#32D583]/40 flex items-center justify-center font-mono font-bold text-[#32D583]">
              R17
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Amphibious Rescue Unit Alpha</h2>
              <p className="text-xs font-mono text-[#8f9194]">Commander Capt. V. Rao • 4 Personnel</p>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="flex items-center gap-1 bg-[#050607] p-1 rounded-lg border border-[#1D252C] text-xs font-mono">
            {[
              { id: 'EN_ROUTE', label: 'EN ROUTE' },
              { id: 'ON_SCENE', label: 'ON SCENE' },
              { id: 'PATIENT_SECURED', label: 'PATIENT SECURED' },
              { id: 'RETURN_BASE', label: 'RETURN BASE' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setMissionStatus(st.id as any)}
                className={`px-3 py-1.5 rounded transition-all font-bold ${
                  missionStatus === st.id
                    ? 'bg-[#32D583] text-black shadow-md'
                    : 'text-[#8f9194] hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Mission Overview Card */}
        <div className="bg-[#0b0e11] border-2 border-[#FF3B30]/40 rounded-xl p-6 relative overflow-hidden shadow-2xl bg-[#FF3B30]/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#1D252C]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-[#FF3B30] text-white font-mono text-xs font-bold">
                  INC-2048
                </span>
                <StatusBadge type="severity" value="CRITICAL" />
                <span className="text-xs font-mono text-[#36C5F0] font-bold">RISK SCORE: 94/100</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Rooftop 4B Flash Flood Rescue (6 Citizens Trapped)
              </h2>
              <p className="text-xs text-[#c5c6ca] mt-1 font-mono">
                Target: Sector 4 Rooftop 4B (26.1445° N, 91.7362° E) • Water level rising +1.4m
              </p>
            </div>

            <div className="flex flex-col items-end text-right font-mono">
              <span className="text-xs text-[#8f9194]">ESTIMATED ARRIVAL</span>
              <span className="text-2xl font-bold text-[#32D583] animate-pulse">4 MINS</span>
              <span className="text-[11px] text-[#36C5F0]">Distance: 1.2 km</span>
            </div>
          </div>

          {/* Victim Medical Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="p-3 bg-[#050607]/80 rounded-lg border border-[#1D252C]">
              <span className="text-[11px] font-mono text-[#8f9194] block">PRIMARY VICTIM:</span>
              <span className="text-sm font-bold text-white block mt-0.5">Priya Sharma (Age 42)</span>
              <span className="text-xs text-[#FF3B30] font-mono block mt-1">Diagnosis: Hypothermia + Fractured Leg</span>
            </div>

            <div className="p-3 bg-[#050607]/80 rounded-lg border border-[#1D252C]">
              <span className="text-[11px] font-mono text-[#8f9194] block">COMMUNICATIONS:</span>
              <span className="text-sm font-bold text-[#36C5F0] block mt-0.5">BLE Mesh 3-Hop Signal</span>
              <span className="text-xs text-[#32D583] font-mono block mt-1">Victim Battery: 18% Remaining</span>
            </div>

            <div className="p-3 bg-[#050607]/80 rounded-lg border border-[#1D252C]">
              <span className="text-[11px] font-mono text-[#8f9194] block">NEAREST TRAUMA FACILITY:</span>
              <span className="text-sm font-bold text-[#4C8DFF] block mt-0.5">SevenHills Hospital (2.4km)</span>
              <span className="text-xs text-[#32D583] font-mono block mt-1">ICU Capacity Available</span>
            </div>
          </div>

          {/* Quick Mission Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1D252C]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c5c6ca]">
              <Shield className="w-4 h-4 text-[#32D583]" />
              <span>Assigned by Operator P. Kumar (15:21 UTC)</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setMissionStatus('ON_SCENE')}
                className="px-4 py-2 rounded-lg bg-[#32D583] text-black font-bold hover:bg-[#32D583]/90 transition-all shadow-[0_0_12px_rgba(50,213,131,0.3)]"
              >
                CONFIRM ON SCENE
              </button>
              <button
                onClick={() => alert('Requesting emergency air evacuation support...')}
                className="px-3 py-2 rounded-lg bg-[#121d24] border border-[#1D252C] text-[#FFB020] font-bold hover:bg-[#FFB020]/10 transition-all"
              >
                REQUEST AIRLIFT SUPPORT
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Tactical Turn-by-Turn Navigation & Crew Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Navigation Stage (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#36C5F0]" />
                <h3 className="text-sm font-bold text-[#F5F7F8]">OFFLINE VECTOR TACTICAL NAVIGATION</h3>
              </div>
              <span className="text-xs font-mono text-[#32D583] font-bold">GPS LOCKED • ACCURACY 2M</span>
            </div>

            {/* Turn-by-Turn Instruction Steps */}
            <div className="space-y-3">
              <div className="p-3 bg-[#36C5F0]/10 border border-[#36C5F0]/30 rounded-lg flex items-start gap-3">
                <div className="p-2 rounded bg-[#36C5F0] text-black font-bold font-mono">
                  <Navigation className="w-5 h-5 rotate-45" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#36C5F0] font-bold block">NEXT MANEUVER (IN 300M):</span>
                  <p className="text-sm font-bold text-white font-sans mt-0.5">
                    Turn Right onto Sector 4 Main Flood Canal. Maintain speed under 30 km/h due to debris.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#050607] border border-[#1D252C] rounded-lg space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#8f9194]">
                  <span>1. Head East from Gateway G-02</span>
                  <span className="text-white font-bold">400m (Passed)</span>
                </div>
                <div className="flex justify-between text-white font-bold">
                  <span>2. Sector 4 Flood Access Canal</span>
                  <span className="text-[#32D583]">300m (Current)</span>
                </div>
                <div className="flex justify-between text-[#8f9194]">
                  <span>3. Rooftop 4B Access Ramp</span>
                  <span className="text-white">500m (Ahead)</span>
                </div>
              </div>
            </div>

            {/* Compass HUD */}
            <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#36C5F0]">
                <Compass className="w-4 h-4" />
                BEARING: 074° ENE
              </span>
              <span className="text-[#8f9194]">SPEED: 24 KM/H</span>
              <span className="text-[#32D583]">ALT: +18.4M</span>
            </div>
          </div>

          {/* Crew Readiness & PTT Radio (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Equipment Checklist */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#1D252C]">
                <Package className="w-4 h-4 text-[#32D583]" />
                <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                  CREW EQUIPMENT LOADOUT
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {[
                  { name: 'Amphibious Rescue Raft (2)', status: 'DEPLOYED' },
                  { name: 'Hypothermia Blanket Kits (6)', status: 'READY' },
                  { name: 'Medical Trauma Kit Alpha', status: 'READY' },
                  { name: 'BLE Transponder Beacon', status: 'ACTIVE' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#121d24] rounded-lg border border-[#1D252C] flex items-center justify-between">
                    <span className="text-white">{item.name}</span>
                    <span className="px-2 py-0.5 rounded bg-[#32D583]/15 text-[#32D583] font-bold text-[10px]">
                      ✓ {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Radio Simulator */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#FF3B30]" />
                  <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                    TACTICAL PTT RADIO SIMULATOR
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#32D583]">CH 04-ALPHA</span>
              </div>

              <button
                onMouseDown={() => setRadioActive(true)}
                onMouseUp={() => setRadioActive(false)}
                className={`w-full py-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  radioActive
                    ? 'bg-[#FF3B30] text-white ring-4 ring-[#FF3B30]/40'
                    : 'bg-[#121d24] border border-[#1D252C] text-[#c5c6ca] hover:text-white hover:border-[#2c363e]'
                }`}
              >
                <Mic className={`w-5 h-5 ${radioActive ? 'animate-bounce' : 'text-[#FF3B30]'}`} />
                <span>{radioActive ? 'TRANSMITTING VOICE TO DISPATCH...' : 'PUSH TO TALK RADIO'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
