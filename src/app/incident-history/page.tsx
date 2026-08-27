'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  FileText,
  User,
  MapPin,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function IncidentHistoryPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'RESOLVED' | 'ARCHIVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('INC-2048');

  const incidents = [
    {
      id: 'INC-2048',
      victim: 'Priya Sharma',
      location: 'Sector 4 Rooftop 4B',
      severity: 'CRITICAL',
      status: 'ACTIVE',
      time: '15:42 UTC',
      assignedUnit: 'Unit R-17 (Amphibious)',
      triage: 'Hypothermia + Suspected Leg Fracture',
      notes: 'Water level +1.4m. Victim isolated on rooftop with child.'
    },
    {
      id: 'INC-2047',
      victim: 'Ramesh Patel',
      location: 'Sector 2 Central Market',
      severity: 'URGENT',
      status: 'RESOLVED',
      time: '14:15 UTC',
      assignedUnit: 'Unit A-04 (Medical Evac)',
      triage: 'Acute Respiratory Distress',
      notes: 'Successfully transported to SevenHills ICU. Condition stable.'
    },
    {
      id: 'INC-2045',
      victim: 'Multiple Citizens (5)',
      location: 'Sector 4 North Wall',
      severity: 'CRITICAL',
      status: 'RESOLVED',
      time: '11:30 UTC',
      assignedUnit: 'Fire Squad F-09',
      triage: 'Structural Debris Entrapment',
      notes: 'Debris cleared using heavy equipment. All 5 citizens rescued.'
    },
    {
      id: 'INC-2040',
      victim: 'Amit Kumar',
      location: 'Sector 1 Residential',
      severity: 'STANDARD',
      status: 'ARCHIVED',
      time: '08:10 UTC',
      assignedUnit: 'Unit R-02',
      triage: 'Minor Laceration',
      notes: 'Treated on scene by responder medic. No hospital transport required.'
    }
  ];

  const filteredIncidents = incidents.filter(inc => {
    const matchesTab = activeTab === 'ALL' || inc.status === activeTab;
    const matchesSearch = inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.victim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const currentCase = incidents.find(i => i.id === selectedCaseId) || incidents[0];

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#36C5F0]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Incident History & Case Management</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Archived emergency case files, post-rescue reports, victim triage history & dispatch audit records.
            </p>
          </div>

          <button
            onClick={() => alert('Exporting complete incident log archive...')}
            className="px-3.5 py-1.5 rounded-lg bg-[#36C5F0] text-black font-bold text-xs hover:bg-[#36C5F0]/90 transition-all flex items-center gap-1 font-mono shadow-[0_0_12px_rgba(54,197,240,0.3)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT INCIDENT ARCHIVE</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Incidents (1,842)' },
              { id: 'ACTIVE', label: 'Active Dispatch (1)' },
              { id: 'RESOLVED', label: 'Resolved Cases (1,820)' },
              { id: 'ARCHIVED', label: 'Archived (21)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#121d24] text-white border border-[#2c363e] font-bold'
                    : 'text-[#8f9194] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8f9194]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case ID or victim name..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0]"
            />
          </div>
        </div>

        {/* 2-Column Grid: Incident List (7 Cols) & Case Inspector Drawer (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Incident List Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            {filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedCaseId(inc.id)}
                className={`p-4 rounded-xl border space-y-2 cursor-pointer transition-all shadow-lg ${
                  selectedCaseId === inc.id
                    ? 'bg-[#36C5F0]/10 border-[#36C5F0] shadow-[0_0_10px_rgba(54,197,240,0.2)]'
                    : 'bg-[#0b0e11] border-[#1D252C] hover:border-[#2c363e]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#36C5F0]">{inc.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'CRITICAL' ? 'bg-[#FF3B30] text-white' :
                      inc.severity === 'URGENT' ? 'bg-[#FFB020] text-black' : 'bg-[#121d24] text-[#8f9194]'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <span className="text-[#8f9194] text-[11px]">{inc.time}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{inc.victim}</h3>
                  <p className="text-xs text-[#8f9194] font-mono mt-0.5">{inc.location}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#8f9194]">
                  <span>Unit: <strong className="text-white">{inc.assignedUnit}</strong></span>
                  <span className={`font-bold ${inc.status === 'ACTIVE' ? 'text-[#FF3B30] animate-pulse' : 'text-[#32D583]'}`}>
                    {inc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Case Inspector Drawer (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div>
                <span className="text-xs font-mono text-[#36C5F0] font-bold">{currentCase.id} CASE FILE</span>
                <h3 className="text-base font-bold text-white mt-0.5">{currentCase.victim}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                currentCase.status === 'ACTIVE' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' : 'bg-[#32D583]/20 text-[#32D583]'
              }`}>
                {currentCase.status}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">LOCATION:</span>
                  <span className="text-white font-bold">{currentCase.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">TRIAGE DIAGNOSIS:</span>
                  <span className="text-[#FF3B30] font-bold">{currentCase.triage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">ASSIGNED UNIT:</span>
                  <span className="text-[#36C5F0] font-bold">{currentCase.assignedUnit}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#8f9194] block mb-1">DISPATCHER NOTES:</span>
                <p className="p-3 bg-[#121d24] rounded border border-[#1D252C] text-xs font-sans text-[#c5c6ca] leading-relaxed">
                  {currentCase.notes}
                </p>
              </div>

              <button
                onClick={() => alert(`Downloading case report for ${currentCase.id}...`)}
                className="w-full py-2.5 rounded-lg bg-[#36C5F0] text-black font-mono font-bold text-xs hover:bg-[#36C5F0]/90 transition-all flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(54,197,240,0.3)]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD CASE SUMMARY PDF</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
