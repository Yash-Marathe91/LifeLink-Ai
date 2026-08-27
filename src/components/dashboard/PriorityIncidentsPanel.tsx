'use client';

import React, { useState } from 'react';
import { Incident } from '@/lib/types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Users, 
  Battery, 
  Clock, 
  MapPin, 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface PriorityIncidentsPanelProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onDispatchUnit: (incident: Incident) => void;
}

export const PriorityIncidentsPanel: React.FC<PriorityIncidentsPanelProps> = ({
  incidents,
  onSelectIncident,
  onDispatchUnit
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'UNASSIGNED'>('ALL');
  const [expandedAiId, setExpandedAiId] = useState<string | null>('INC-2048');

  const filteredIncidents = incidents.filter(item => {
    if (filter === 'CRITICAL') return item.severity === 'CRITICAL';
    if (filter === 'UNASSIGNED') return !item.assignedResponderId;
    return true;
  });

  const toggleAiExpanded = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAiId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1D252C]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FF3B30]" />
            <h2 className="text-base font-bold text-[#F5F7F8]">Priority Emergency Queue</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] text-xs font-mono font-bold">
              {filteredIncidents.length} Active
            </span>
          </div>
          <p className="text-xs text-[#8f9194] mt-0.5">
            5 incidents show elevated spatial priority clustering around <span className="text-[#36C5F0] font-mono">Sector 4</span>.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#050607] p-1 rounded-lg border border-[#1D252C] text-xs font-mono">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-md transition-all ${filter === 'ALL' ? 'bg-[#121d24] text-white font-semibold' : 'text-[#8f9194] hover:text-white'}`}
          >
            ALL ({incidents.length})
          </button>
          <button
            onClick={() => setFilter('CRITICAL')}
            className={`px-2.5 py-1 rounded-md transition-all ${filter === 'CRITICAL' ? 'bg-[#FF3B30]/20 text-[#FF3B30] font-semibold' : 'text-[#8f9194] hover:text-[#FF3B30]'}`}
          >
            CRITICAL ({incidents.filter(i => i.severity === 'CRITICAL').length})
          </button>
          <button
            onClick={() => setFilter('UNASSIGNED')}
            className={`px-2.5 py-1 rounded-md transition-all ${filter === 'UNASSIGNED' ? 'bg-[#FFB020]/20 text-[#FFB020] font-semibold' : 'text-[#8f9194] hover:text-[#FFB020]'}`}
          >
            UNASSIGNED ({incidents.filter(i => !i.assignedResponderId).length})
          </button>
        </div>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto space-y-3 mt-4 pr-1">
        {filteredIncidents.map((incident) => {
          const isAiExpanded = expandedAiId === incident.id;
          const isCritical = incident.severity === 'CRITICAL';

          return (
            <div
              key={incident.id}
              onClick={() => onSelectIncident(incident)}
              className={`group relative bg-[#121d24] border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:border-[#36C5F0]/50 ${
                isCritical 
                  ? 'border-[#FF3B30]/40 bg-[#FF3B30]/5 hover:bg-[#FF3B30]/10' 
                  : 'border-[#1D252C] hover:bg-[#162128]'
              }`}
            >
              {/* Top Meta Line */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#36C5F0] bg-[#36C5F0]/10 px-2 py-0.5 rounded border border-[#36C5F0]/20">
                    {incident.id}
                  </span>
                  <StatusBadge type="severity" value={incident.severity} />
                  <StatusBadge type="transport" value={incident.transport} />
                </div>

                {/* Risk Score Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#050607] border border-[#1D252C]">
                  <BrainCircuit className="w-3.5 h-3.5 text-[#8B7CFF]" />
                  <span className="text-xs font-mono font-bold text-[#F5F7F8]">
                    RISK SCORE: <span className={incident.riskScore > 85 ? 'text-[#FF3B30]' : 'text-[#FFB020]'}>{incident.riskScore}</span>/100
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[#F5F7F8] group-hover:text-[#36C5F0] transition-colors leading-snug">
                {incident.title}
              </h3>

              {/* Medical / Telemetry Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 p-2.5 rounded-lg bg-[#050607]/80 border border-[#1D252C] text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#c5c6ca]">
                  <Users className="w-3.5 h-3.5 text-[#4C8DFF]" />
                  <span>{incident.peopleCount} Citizens ({incident.injuredCount} Injured)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#c5c6ca]">
                  <MapPin className="w-3.5 h-3.5 text-[#32D583]" />
                  <span className="truncate">{incident.location.sector} ({incident.location.isolationLevel})</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#c5c6ca]">
                  <Clock className="w-3.5 h-3.5 text-[#FFB020]" />
                  <span>Wait: {incident.waitingMinutes}m</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#c5c6ca]">
                  <Battery className={`w-3.5 h-3.5 ${incident.batteryLevel < 25 ? 'text-[#FF3B30] animate-pulse' : 'text-[#32D583]'}`} />
                  <span>Batt: {incident.batteryLevel}%</span>
                </div>
              </div>

              {/* AI Explanation Accordion Box */}
              <div className="mt-2 rounded-lg bg-[#8B7CFF]/5 border border-[#8B7CFF]/20 overflow-hidden">
                <button
                  onClick={(e) => toggleAiExpanded(incident.id, e)}
                  className="w-full px-3 py-1.5 flex items-center justify-between text-xs font-mono text-[#8B7CFF] hover:bg-[#8B7CFF]/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>AI RISK ANALYSIS & EXPLANATION ({incident.aiConfidence}% CONFIDENCE)</span>
                  </div>
                  {isAiExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isAiExpanded && (
                  <div className="p-3 border-t border-[#8B7CFF]/15 text-xs text-[#c5c6ca] space-y-1.5 bg-[#050607]/40">
                    {incident.aiExplanation.map((explanation, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#8B7CFF] font-mono">•</span>
                        <span>{explanation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1D252C]">
                <div className="text-xs text-[#8f9194] flex items-center gap-1.5">
                  {incident.assignedResponderName ? (
                    <span className="inline-flex items-center gap-1 text-[#32D583] font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Assigned: {incident.assignedResponderName}
                    </span>
                  ) : (
                    <span className="text-[#FFB020] font-mono">
                      ⚠️ Awaiting Responder Unit
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!incident.assignedResponderId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDispatchUnit(incident);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#FF3B30] text-white text-xs font-semibold hover:bg-[#FF3B30]/90 transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(255,59,48,0.3)]"
                    >
                      <span>DISPATCH TEAM</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectIncident(incident);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#050607] border border-[#1D252C] text-[#c5c6ca] text-xs hover:text-white hover:border-[#2c363e] transition-all"
                  >
                    View Workspace
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
