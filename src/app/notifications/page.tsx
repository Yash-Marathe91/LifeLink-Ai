'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  Bell,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Check,
  VolumeX,
  Filter,
  Shield,
  Zap,
  Info
} from 'lucide-react';

export default function NotificationsPage() {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'CRITICAL SOS ACTIVATED: PRIYA SHARMA',
      category: 'CRITICAL',
      time: '2 MINS AGO',
      description: 'Sector 4 Rooftop 4B SOS signal hold verified. Hypothermia + leg fracture flagged.',
      read: false
    },
    {
      id: 2,
      title: 'BLE MESH RELAY SIGNAL DEGRADATION',
      category: 'WARNING',
      time: '14 MINS AGO',
      description: 'Relay Node N-07 RSSI dropped to -84 dBm. High risk of Sector 4 packet isolation.',
      read: false
    },
    {
      id: 3,
      title: 'SATELLITE GATEWAY G-01 SYNC COMPLETE',
      category: 'INFO',
      time: '25 MINS AGO',
      description: '142 offline telemetry packets synchronized to cloud database successfully.',
      read: true
    },
    {
      id: 4,
      title: 'SEVENHILLS ICU BED CAPACITY AT 70%',
      category: 'WARNING',
      time: '45 MINS AGO',
      description: '12 available beds remaining in Trauma Unit B.',
      read: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterSeverity === 'ALL') return true;
    return n.category === filterSeverity;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FF3B30]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Notifications & Alert Center</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Real-time emergency broadcast notifications, mesh node alerts & automated priority triggers.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-1.5 rounded-lg bg-[#121d24] border border-[#1D252C] text-[#32D583] hover:bg-[#32D583]/10 font-bold transition-all flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>MARK ALL AS READ</span>
            </button>
          </div>
        </div>

        {/* Severity Filter Navigation */}
        <div className="flex items-center gap-2 pb-2 border-b border-[#1D252C] font-mono text-xs overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Alerts (48)' },
            { id: 'CRITICAL', label: 'Critical SOS (12)' },
            { id: 'WARNING', label: 'Warnings (18)' },
            { id: 'INFO', label: 'System Notices (18)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSeverity(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                filterSeverity === tab.id
                  ? 'bg-[#121d24] text-white border border-[#2c363e] font-bold'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications Stream List */}
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`bg-[#0b0e11] border rounded-xl p-4 space-y-2 transition-all shadow-lg ${
                item.category === 'CRITICAL'
                  ? 'border-[#FF3B30]/40 bg-[#FF3B30]/5'
                  : item.category === 'WARNING'
                  ? 'border-[#FFB020]/40 bg-[#FFB020]/5'
                  : 'border-[#1D252C]'
              } ${!item.read ? 'ring-1 ring-[#36C5F0]/40' : 'opacity-80'}`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    item.category === 'CRITICAL' ? 'bg-[#FF3B30] text-white' :
                    item.category === 'WARNING' ? 'bg-[#FFB020] text-black' : 'bg-[#36C5F0]/20 text-[#36C5F0]'
                  }`}>
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                </div>
                <span className="text-[#8f9194] text-[11px]">{item.time}</span>
              </div>

              <p className="text-xs font-sans text-[#c5c6ca] leading-relaxed pl-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
