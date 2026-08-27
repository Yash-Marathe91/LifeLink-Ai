'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  Navigation,
  ShieldAlert,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  MapPin,
  LifeBuoy
} from 'lucide-react';

export default function ActiveSOSPage() {
  const [sosStatus, setSosStatus] = useState<'EN_ROUTE' | 'ON_SCENE' | 'RESOLVED'>('EN_ROUTE');

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Active Emergency Banner */}
        <div className="bg-[#FF3B30]/10 border border-[#FF3B30] rounded-xl p-5 space-y-3 shadow-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#FF3B30] animate-bounce" />
            <h1 className="text-xl font-extrabold text-white font-mono">ACTIVE EMERGENCY SOS DISPATCHED</h1>
          </div>
          
          <div className="py-2 bg-[#050607] rounded-xl border border-[#FF3B30]/30 space-y-1">
            <span className="text-xs font-mono text-[#8f9194]">RESCUE UNIT ESTIMATED ARRIVAL:</span>
            <div className="text-3xl font-extrabold font-mono text-[#FF3B30]">4 MINUTES</div>
            <span className="text-xs font-mono text-[#32D583]">Unit R-17 (Amphibious Raft) • Distance: 350 meters</span>
          </div>
        </div>

        {/* Live Stepper Progress */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-lg">
          <h3 className="text-xs font-mono text-[#36C5F0] font-bold">RESCUE DISPATCH PROGRESS</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#32D583] text-black font-bold flex items-center justify-center font-mono text-xs">✓</div>
              <div>
                <h4 className="text-sm font-bold text-white">SOS Signal Verified by AI Engine</h4>
                <p className="text-xs text-[#8f9194]">Location confirmed via BLE Mesh Node N-07</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#32D583] text-black font-bold flex items-center justify-center font-mono text-xs">✓</div>
              <div>
                <h4 className="text-sm font-bold text-white">Unit R-17 Dispatched</h4>
                <p className="text-xs text-[#8f9194]">Commander Capt. Vikram Singh assigned to Sector 4</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#36C5F0] text-black font-bold flex items-center justify-center font-mono text-xs animate-pulse">3</div>
              <div>
                <h4 className="text-sm font-bold text-[#36C5F0]">Amphibious Raft In Transit (Navigating Flood Water)</h4>
                <p className="text-xs text-[#8f9194]">Approaching Rooftop 4B from Waterway B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Citizen Emergency Instructions */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-[#FFB020]" />
            <h3 className="text-sm font-bold text-white font-mono">EMERGENCY CITIZEN INSTRUCTIONS</h3>
          </div>

          <ul className="space-y-2 text-xs font-sans text-[#c5c6ca] list-disc list-inside">
            <li>Stay elevated on the highest dry rooftop area.</li>
            <li>Wave a bright cloth or flash your phone flashlight towards the approaching raft.</li>
            <li>Keep your mobile phone on Low Power Mode. Do not close this app.</li>
          </ul>
        </div>

        {/* Direct One-Tap Call to Rescue Unit */}
        <a
          href="tel:+91-98200-99000"
          className="w-full py-4 rounded-xl bg-[#32D583] text-black font-mono font-bold text-sm hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,213,131,0.4)] min-h-[56px]"
        >
          <PhoneCall className="w-5 h-5" />
          <span>CALL RESCUE OFFICER CAPT. VIKRAM SINGH DIRECTLY</span>
        </a>

      </div>
    </AppShell>
  );
}
