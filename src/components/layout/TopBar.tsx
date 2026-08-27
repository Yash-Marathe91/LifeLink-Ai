'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Search, AlertOctagon, Bell, Cpu, ShieldAlert } from 'lucide-react';

export const TopBar: React.FC = () => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-[#0f172a] border-b border-[#1e293b] px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Disaster Mode & Network Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-xs font-mono font-semibold animate-pulse-subtle">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>DISASTER MODE ACTIVE</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1e293b] border border-[#334155] text-[#0ea5e9] text-xs font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#0ea5e9]" />
          <span>BLE MESH: 42 RELAYS ACTIVE (94.2%)</span>
        </div>
      </div>

      {/* Right: Quick Tools & Telemetry Time */}
      <div className="flex items-center gap-3">
        {/* Telemetry Clock */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#090d14] border border-[#1e293b] font-mono text-xs text-[#cbd5e1]">
          <Cpu className="w-3.5 h-3.5 text-[#0ea5e9]" />
          <span>{timeString || '15:21:27 UTC'}</span>
        </div>

        {/* Global Search Shortcut */}
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
            window.dispatchEvent(event);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#334155] text-xs text-[#94a3b8] hover:text-[#f8fafc] hover:border-[#0ea5e9]/50 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-[#0ea5e9]" />
          <span className="hidden sm:inline">Search Incidents / Units...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#090d14] text-[10px] font-mono border border-[#334155]">Ctrl K</kbd>
        </button>

        {/* Emergency Broadcast Pill */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ef4444] text-white text-xs font-semibold hover:bg-[#ef4444]/90 transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)]">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">EMERGENCY BROADCAST</span>
        </button>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-lg bg-[#1e293b] border border-[#334155] text-[#cbd5e1] hover:text-white hover:border-[#0ea5e9]/50 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444] animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444]" />
        </button>
      </div>
    </header>
  );
};
