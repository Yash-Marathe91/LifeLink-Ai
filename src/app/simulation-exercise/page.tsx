'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Radio,
  AlertTriangle,
  Users,
  Clock,
  Activity,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export default function SimulationExercisePage() {
  const [isRunning, setIsRunning] = useState(true);
  const [simTime, setSimTime] = useState('00:42:15');
  const [activeInjects, setActiveInjects] = useState<string[]>([
    'Grid Power Outage (Sector 4)',
    'BLE Mesh Node N-07 Signal Degraded'
  ]);

  const handleTriggerInject = (injectName: string) => {
    if (!activeInjects.includes(injectName)) {
      setActiveInjects(prev => [...prev, injectName]);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="bg-[#0b0e11] border border-[#FFB020]/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg bg-[#FFB020]/5">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#FFB020] animate-pulse" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Live Simulation Exercise (Controller View)</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Real-time controller console for injecting disaster stress events, monitoring response SLAs & drill execution.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-[#050607] border border-[#1D252C] text-[#FFB020] font-bold">
              ELAPSED: {simTime}
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                isRunning ? 'bg-[#FF3B30] text-white' : 'bg-[#32D583] text-black'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'PAUSE DRILL' : 'RESUME DRILL'}</span>
            </button>
          </div>
        </div>

        {/* Drill Controls & Inject Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inject Buttons (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white font-mono">EXERCISE STRESS INJECT CONTROL</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <button
                onClick={() => handleTriggerInject('Flash Flood Surge +1.5m (Sector 4)')}
                className="p-3 bg-[#050607] border border-[#FF3B30]/30 hover:border-[#FF3B30] text-left rounded-xl space-y-1 transition-all"
              >
                <div className="flex items-center justify-between text-[#FF3B30] font-bold">
                  <span>INJECT: WATER SURGE</span>
                  <Zap className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-[#8f9194] font-sans">Simulate rapid water rise in Sector 4 basin</p>
              </button>

              <button
                onClick={() => handleTriggerInject('Cell Tower Power Failure')}
                className="p-3 bg-[#050607] border border-[#FFB020]/30 hover:border-[#FFB020] text-left rounded-xl space-y-1 transition-all"
              >
                <div className="flex items-center justify-between text-[#FFB020] font-bold">
                  <span>INJECT: CELLULAR DROP</span>
                  <Radio className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-[#8f9194] font-sans">Disable 4G/5G towers to force BLE mesh fallback</p>
              </button>
            </div>

            {/* Active Injects Stream */}
            <div className="pt-3 border-t border-[#1D252C] space-y-2">
              <span className="text-xs font-mono text-[#8f9194]">ACTIVE EXERCISE INJECTS:</span>
              <div className="space-y-1.5">
                {activeInjects.map((inj, idx) => (
                  <div key={idx} className="p-2 bg-[#121d24] rounded border border-[#2c363e] text-xs font-mono text-[#36C5F0] flex items-center justify-between">
                    <span>{inj}</span>
                    <span className="text-[10px] text-[#32D583] font-bold">ACTIVE INJECT</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drill Telemetry HUD (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono">RESPONDER SLA HUD</h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] flex justify-between">
                <span className="text-[#8f9194]">AVG DISPATCH SLA:</span>
                <span className="text-[#32D583] font-bold">2.8 MINS (TARGET: &lt; 5 MINS)</span>
              </div>
              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] flex justify-between">
                <span className="text-[#8f9194]">MESH RECOVERABILITY:</span>
                <span className="text-[#36C5F0] font-bold">100% RECOVERED</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
