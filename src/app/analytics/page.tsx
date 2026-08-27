'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { KPICard } from '@/components/common/KPICard';

import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  ShieldCheck,
  Download,
  Calendar,
  Filter,
  Layers,
  MapPin,
  Sparkles,
  Zap,
  ChevronDown
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D' | 'SEASON'>('24H');

  const sectorData = [
    { name: 'Sector 4 (Flood Basin)', incidents: 142, pct: 64, severity: 'CRITICAL', color: '#FF3B30' },
    { name: 'Sector 2 (Central Market)', incidents: 48, pct: 22, severity: 'HIGH', color: '#FFB020' },
    { name: 'Sector 1 (North Residential)', incidents: 20, pct: 9, severity: 'MEDIUM', color: '#36C5F0' },
    { name: 'Sector 3 (Industrial Zone)', incidents: 11, pct: 5, severity: 'LOW', color: '#32D583' },
  ];

  const hourlyTrends = [
    { hour: '08:00', count: 12, height: '25%' },
    { hour: '10:00', count: 28, height: '50%' },
    { hour: '12:00', count: 45, height: '80%' },
    { hour: '14:00', count: 62, height: '100%' },
    { hour: '16:00', count: 38, height: '65%' },
    { hour: '18:00', count: 24, height: '40%' },
  ];

  const handleExportPDF = () => {
    alert('Generating & downloading PDF Analytics & Emergency Intelligence Briefing...');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#8B7CFF]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Analytics & Emergency Intelligence</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Post-event incident performance metrics, SLA breakdown, spatial hotspot density & AI predictive resource forecasts.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 bg-[#050607] border border-[#1D252C] rounded-lg p-1">
              {[
                { id: '24H', label: '24 Hours' },
                { id: '7D', label: '7 Days' },
                { id: '30D', label: '30 Days' },
                { id: 'SEASON', label: 'Monsoon 2026' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as any)}
                  className={`px-2.5 py-1 rounded transition-all ${
                    timeRange === range.id
                      ? 'bg-[#121d24] text-white font-bold border border-[#2c363e]'
                      : 'text-[#8f9194] hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportPDF}
              className="px-3.5 py-1.5 rounded-lg bg-[#8B7CFF] text-white font-bold hover:bg-[#8B7CFF]/90 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(139,124,255,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT BRIEFING PDF</span>
            </button>
          </div>
        </div>

        {/* Analytics Top KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="INCIDENT RESOLUTION RATE"
            value="94.2%"
            subtitle="+4.8% vs Historical Average"
            icon={<ShieldCheck className="w-5 h-5" />}
            accentColor="violet"
          />
          <KPICard
            title="AVG RESCUE DISPATCH TIME"
            value="4.2 MINS"
            subtitle="-38% Faster via BLE Mesh SOS"
            icon={<Clock className="w-5 h-5" />}
            accentColor="green"
          />
          <KPICard
            title="CITIZENS RESCUED TODAY"
            value="1,482 LIVES"
            subtitle="221 Critical Evacuations"
            icon={<Users className="w-5 h-5" />}
            accentColor="cyan"
          />
          <KPICard
            title="PREDICTIVE SLA ACCURACY"
            value="98.1%"
            subtitle="Gemini 3.1 Pro Correlation Model"
            icon={<Sparkles className="w-5 h-5" />}
            accentColor="amber"
          />
        </div>

        {/* Main 2-Column Grid: Incident Volume Bar Chart & Sector Density Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Incident Volume Bar Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div>
                <span className="text-xs font-mono text-[#8B7CFF] font-bold">HOURLY INCIDENT DENSITY</span>
                <h3 className="text-base font-bold text-white">Emergency SOS Signal Activation Rate</h3>
              </div>
              <span className="text-xs font-mono text-[#32D583]">PEAK AT 14:00 UTC</span>
            </div>

            {/* Visual CSS Bar Graph */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-[#050607] rounded-xl border border-[#1D252C]">
              {hourlyTrends.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-mono font-bold text-[#36C5F0]">{item.count}</span>
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-[#8B7CFF]/40 to-[#8B7CFF] transition-all hover:brightness-125"
                  />
                  <span className="text-[10px] font-mono text-[#8f9194]">{item.hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Hotspot Breakdown (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div>
                <span className="text-xs font-mono text-[#FF3B30] font-bold">SPATIAL DENSITY ANALYSIS</span>
                <h3 className="text-base font-bold text-white">Incident Breakdown by Sector</h3>
              </div>
              <MapPin className="w-4 h-4 text-[#FF3B30]" />
            </div>

            <div className="space-y-4">
              {sectorData.map((sec, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-white font-bold">{sec.name}</span>
                    <span className="text-[#8f9194]">{sec.incidents} Incidents ({sec.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#121d24] overflow-hidden">
                    <div
                      style={{ width: `${sec.pct}%`, backgroundColor: sec.color }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
