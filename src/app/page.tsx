'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { KPICard } from '@/components/common/KPICard';
import { PriorityIncidentsPanel } from '@/components/dashboard/PriorityIncidentsPanel';
import { ResponderOperationsPanel } from '@/components/dashboard/ResponderOperationsPanel';
import { NetworkHealthPanel } from '@/components/dashboard/NetworkHealthPanel';
import { LiveActivityTimeline } from '@/components/dashboard/LiveActivityTimeline';
import { MapPreviewPanel } from '@/components/dashboard/MapPreviewPanel';
import { DispatchModal } from '@/components/dashboard/DispatchModal';

import { mockIncidents as initialIncidents, mockSystemKPIs } from '@/lib/mockData/incidents';
import { mockResponders as initialResponders } from '@/lib/mockData/responders';
import { mockNetworkNodes } from '@/lib/mockData/network';
import { mockActivityTimeline as initialActivity } from '@/lib/mockData/network';
import { Incident, ResponderTeam, ActivityTimelineItem } from '@/lib/types';

import { 
  AlertTriangle, 
  Clock, 
  Truck, 
  Radio, 
  BrainCircuit, 
  RefreshCw, 
  Download, 
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

export default function CommandOverviewDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [responders, setResponders] = useState<ResponderTeam[]>(initialResponders);
  const [activity, setActivity] = useState<ActivityTimelineItem[]>(initialActivity);
  const [dispatchIncident, setDispatchIncident] = useState<Incident | null>(null);
  const [selectedIncidentDetail, setSelectedIncidentDetail] = useState<Incident | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleConfirmDispatch = (incidentId: string, responderId: string, responderName: string) => {
    // Update incident status
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'RESPONDER_ASSIGNED',
          assignedResponderId: responderId,
          assignedResponderName: responderName
        };
      }
      return inc;
    }));

    // Update responder status
    setResponders(prev => prev.map(resp => {
      if (resp.id === responderId) {
        return {
          ...resp,
          status: 'EN_ROUTE',
          currentIncidentId: incidentId,
          etaMinutes: 6
        };
      }
      return resp;
    }));

    // Append to live activity log
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: ActivityTimelineItem = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      actor: 'Operator P. Kumar',
      actorRole: 'OPERATOR',
      action: `Assigned unit ${responderName} (${responderId}) to ${incidentId}.`,
      incidentId: incidentId,
      severity: 'HIGH'
    };

    setActivity(prev => [newLog, ...prev]);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#F5F7F8] tracking-tight">01 — Command Overview Dashboard</h1>
              <span className="px-2 py-0.5 rounded bg-[#36C5F0]/15 text-[#36C5F0] text-xs font-mono font-semibold border border-[#36C5F0]/30">
                LIVE OPERATIONAL STAGE
              </span>
            </div>
            <p className="text-xs text-[#8f9194] mt-1 font-sans">
              Real-time emergency coordination, AI risk prioritization, responder dispatch & mesh network telemetry.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg bg-[#121d24] border border-[#1D252C] text-[#c5c6ca] hover:text-white hover:border-[#2c363e] transition-all flex items-center gap-1.5 text-xs font-mono ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh Telemetry Stream"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={() => alert('Exporting Mission Briefing PDF/JSON...')}
              className="p-2 rounded-lg bg-[#121d24] border border-[#1D252C] text-[#c5c6ca] hover:text-white hover:border-[#2c363e] transition-all flex items-center gap-1.5 text-xs font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Briefing</span>
            </button>
          </div>
        </div>

        {/* Top Mission Control KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="Active Emergency SOS"
            value={mockSystemKPIs.activeIncidentsTotal}
            subtitle={`${mockSystemKPIs.criticalIncidentsCount} Critical Escalations`}
            icon={<AlertTriangle className="w-5 h-5" />}
            accentColor="red"
            isCritical={true}
          />
          <KPICard
            title="Unassigned Queue"
            value={mockSystemKPIs.unassignedIncidentsCount}
            subtitle="Requires dispatch action"
            icon={<Clock className="w-5 h-5" />}
            accentColor="amber"
          />
          <KPICard
            title="Active Rescue Teams"
            value={mockSystemKPIs.activeRespondersCount}
            subtitle={`Avg ETA: ${mockSystemKPIs.avgResponseTimeMinutes}m`}
            icon={<Truck className="w-5 h-5" />}
            accentColor="green"
          />
          <KPICard
            title="BLE Mesh Health"
            value={`${mockSystemKPIs.networkResiliencePercent}%`}
            subtitle="42 Active Relay Nodes"
            icon={<Radio className="w-5 h-5" />}
            accentColor="cyan"
          />
          <KPICard
            title="AI Engine Confidence"
            value={`${mockSystemKPIs.aiEngineConfidence}%`}
            subtitle="XGBoost Prioritization"
            icon={<BrainCircuit className="w-5 h-5" />}
            accentColor="violet"
          />
        </div>

        {/* Main 2-Column Command Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Priority Incidents Queue (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <PriorityIncidentsPanel
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncidentDetail(inc)}
              onDispatchUnit={(inc) => setDispatchIncident(inc)}
            />

            {/* Tactical Spatial Map Preview Panel */}
            <MapPreviewPanel
              incidents={incidents}
              responders={responders}
            />
          </div>

          {/* Right Column: Responder Ops + Network + Activity Feed (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ResponderOperationsPanel responders={responders} />
            <NetworkHealthPanel nodes={mockNetworkNodes} />
            <LiveActivityTimeline activities={activity} />
          </div>
        </div>

        {/* Dispatch Modal Trigger */}
        {dispatchIncident && (
          <DispatchModal
            incident={dispatchIncident}
            responders={responders}
            onClose={() => setDispatchIncident(null)}
            onConfirmDispatch={handleConfirmDispatch}
          />
        )}

        {/* Incident Detail Drawer / Workspace Preview Modal */}
        {selectedIncidentDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-[#1D252C] flex items-center justify-between bg-[#121d24]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#36C5F0]/20 text-[#36C5F0] font-mono text-xs font-bold">
                    {selectedIncidentDetail.id}
                  </span>
                  <h3 className="text-sm font-bold text-[#F5F7F8]">{selectedIncidentDetail.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedIncidentDetail(null)}
                  className="px-2.5 py-1 rounded bg-[#050607] text-xs font-mono text-[#8f9194] hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4 p-3 bg-[#050607] rounded-lg border border-[#1D252C]">
                  <div>
                    <span className="text-[#8f9194] block">DISASTER TYPE:</span>
                    <span className="text-white font-bold">{selectedIncidentDetail.disasterType}</span>
                  </div>
                  <div>
                    <span className="text-[#8f9194] block">RISK SCORE:</span>
                    <span className="text-[#FF3B30] font-bold">{selectedIncidentDetail.riskScore} / 100</span>
                  </div>
                  <div>
                    <span className="text-[#8f9194] block">CITIZENS AFFECTED:</span>
                    <span className="text-white font-bold">{selectedIncidentDetail.peopleCount} ({selectedIncidentDetail.injuredCount} Injured)</span>
                  </div>
                  <div>
                    <span className="text-[#8f9194] block">BATTERY & TRANSPORT:</span>
                    <span className="text-[#32D583] font-bold">{selectedIncidentDetail.batteryLevel}% ({selectedIncidentDetail.transport})</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#8f9194] block mb-1">MEDICAL CONDITION:</span>
                  <p className="text-white font-sans bg-[#121d24] p-3 rounded-lg border border-[#1D252C]">
                    {selectedIncidentDetail.medicalStatus}
                  </p>
                </div>

                <div>
                  <span className="text-[#8B7CFF] block font-bold mb-1">AI PRIORITIZATION REASONING:</span>
                  <ul className="space-y-1 bg-[#8B7CFF]/10 p-3 rounded-lg border border-[#8B7CFF]/20 text-[#c5c6ca] font-sans">
                    {selectedIncidentDetail.aiExplanation.map((exp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#8B7CFF] font-mono">•</span>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#1D252C] flex items-center justify-between">
                  <a
                    href="/incident-workspace"
                    className="px-4 py-2 rounded-lg bg-[#36C5F0] text-black font-bold hover:bg-[#36C5F0]/90 transition-all font-sans"
                  >
                    Open Full Incident Workspace (Page 03) →
                  </a>
                  <button
                    onClick={() => {
                      const inc = selectedIncidentDetail;
                      setSelectedIncidentDetail(null);
                      setDispatchIncident(inc);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#FF3B30] text-white font-bold hover:bg-[#FF3B30]/90 transition-all font-sans"
                  >
                    Dispatch Unit Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
