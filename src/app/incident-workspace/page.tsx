'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DispatchModal } from '@/components/dashboard/DispatchModal';

import { mockIncidents } from '@/lib/mockData/incidents';
import { mockResponders } from '@/lib/mockData/responders';
import { Incident, ResponderTeam } from '@/lib/types';

import {
  FileText,
  User,
  Heart,
  Battery,
  MapPin,
  Clock,
  Radio,
  BrainCircuit,
  Truck,
  MessageSquare,
  History,
  Phone,
  Shield,
  Send,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  Download,
  Share2,
  Lock
} from 'lucide-react';

export default function IncidentWorkspacePage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [responders, setResponders] = useState<ResponderTeam[]>(mockResponders);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-2048');
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false);

  // Chat message feed state
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'CITIZEN', text: 'SOS! We are stuck on rooftop 4B of Sector 4. Water is rising fast!', time: '15:20:12', type: 'SMS_MESH' },
    { id: '2', sender: 'AI_COPILOT', text: 'AI Risk Engine: Prioritized Critical. Inundation depth +1.4m. Dispatching Unit R-17 recommendation.', time: '15:20:15', type: 'SYSTEM' },
    { id: '3', sender: 'OPERATOR', text: 'Operator P. Kumar: Unit R-17 (Amphibious Alpha) has been dispatched to your location. ETA 4 minutes. Stay calm on higher ground.', time: '15:21:04', type: 'OPERATOR_TEXT' },
    { id: '4', sender: 'RESPONDER', text: 'Unit R-17 Commander: We have passed Gateway G-02, entering Sector 4 channel now. We see rooftop 4B.', time: '15:23:40', type: 'RADIO_TRANSCRIPT' }
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];
  const assignedResponder = responders.find(r => r.id === currentIncident.assignedResponderId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const msg = {
      id: Date.now().toString(),
      sender: 'OPERATOR',
      text: `Operator P. Kumar: ${newMsgText}`,
      time: timeStr,
      type: 'OPERATOR_TEXT'
    };

    setChatMessages(prev => [...prev, msg]);
    setNewMsgText('');
  };

  const handleConfirmDispatch = (incidentId: string, responderId: string, responderName: string) => {
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
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Workspace Selector Bar Header */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#36C5F0]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">03 — Incident Tactical Workspace</h1>
            </div>

            {/* Selector Dropdown */}
            <div className="flex items-center gap-2 bg-[#050607] px-3 py-1.5 rounded-lg border border-[#1D252C] font-mono text-xs">
              <span className="text-[#8f9194]">SELECT INCIDENT:</span>
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="bg-transparent text-[#36C5F0] font-bold focus:outline-none cursor-pointer"
              >
                {incidents.map(i => (
                  <option key={i.id} value={i.id} className="bg-[#0b0e11] text-white">
                    {i.id} — {i.title} ({i.severity})
                  </option>
                ))}
              </select>
            </div>

            <StatusBadge type="severity" value={currentIncident.severity} />
            <StatusBadge type="transport" value={currentIncident.transport} />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setDispatchModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#FF3B30] text-white font-bold hover:bg-[#FF3B30]/90 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,59,48,0.3)]"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{currentIncident.assignedResponderId ? 'RE-ASSIGN UNIT' : 'DISPATCH UNIT'}</span>
            </button>

            <button
              onClick={() => alert(`Exporting complete dossier for ${currentIncident.id}...`)}
              className="px-3 py-1.5 rounded-lg bg-[#121d24] border border-[#1D252C] text-[#c5c6ca] hover:text-white hover:border-[#2c363e] transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Case File</span>
            </button>
          </div>
        </div>

        {/* 3-Column Tactical Command Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: Citizen Profile & Emergency Contacts (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Subject Summary Card */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
                <h3 className="text-xs font-mono font-bold text-[#8f9194] uppercase tracking-wider">
                  INCIDENT PROFILE
                </h3>
                <span className="text-xs font-mono font-bold text-[#FF3B30]">
                  RISK {currentIncident.riskScore}/100
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{currentIncident.title}</h4>
                <p className="text-xs text-[#c5c6ca] mt-1 leading-snug">{currentIncident.medicalStatus}</p>
              </div>

              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">DISASTER TYPE:</span>
                  <span className="text-white font-bold">{currentIncident.disasterType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">LOCATION:</span>
                  <span className="text-[#32D583] truncate font-bold">{currentIncident.location.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">WAIT TIME:</span>
                  <span className="text-[#FFB020] font-bold">{currentIncident.waitingMinutes} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">SIGNAL ROUTE:</span>
                  <span className="text-[#36C5F0] font-bold">{currentIncident.transport}</span>
                </div>
              </div>
            </div>

            {/* Affected Citizen Details */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#1D252C]">
                <User className="w-4 h-4 text-[#4C8DFF]" />
                <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                  AFFECTED CITIZEN VITAL TELEMETRY
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Priya Sharma</span>
                  <span className="px-2 py-0.5 rounded bg-[#4C8DFF]/15 text-[#4C8DFF] text-xs font-mono">Age 42</span>
                </div>

                <div className="p-2.5 bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg text-xs">
                  <span className="font-mono font-bold text-[#FF3B30] block mb-0.5">MEDICAL DIAGNOSIS:</span>
                  <p className="text-white leading-tight font-sans">{currentIncident.medicalStatus}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2 bg-[#050607] rounded border border-[#1D252C]">
                    <span className="text-[#8f9194] block">HEART RATE:</span>
                    <span className="text-[#FF3B30] font-bold">118 BPM</span>
                  </div>
                  <div className="p-2 bg-[#050607] rounded border border-[#1D252C]">
                    <span className="text-[#8f9194] block">BLOOD O2 (SpO2):</span>
                    <span className="text-[#32D583] font-bold">95%</span>
                  </div>
                  <div className="p-2 bg-[#050607] rounded border border-[#1D252C]">
                    <span className="text-[#8f9194] block">PHONE BATTERY:</span>
                    <span className="text-[#FF3B30] font-bold">{currentIncident.batteryLevel}%</span>
                  </div>
                  <div className="p-2 bg-[#050607] rounded border border-[#1D252C]">
                    <span className="text-[#8f9194] block">FLOOD DEPTH:</span>
                    <span className="text-[#36C5F0] font-bold">1.4 Meters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts Network */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#1D252C]">
                <Shield className="w-4 h-4 text-[#32D583]" />
                <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                  EMERGENCY CONTACTS NETWORK
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-[#121d24] rounded-lg border border-[#1D252C] flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Rahul Sharma (Spouse)</span>
                    <span className="text-[#8f9194]">+91-98200-11223</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#32D583]/15 text-[#32D583] text-[10px]">
                    SMS NOTIFIED
                  </span>
                </div>

                <div className="p-2.5 bg-[#121d24] rounded-lg border border-[#1D252C] flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Sector 4 Community Ward</span>
                    <span className="text-[#8f9194]">Ref: Ward-42</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#36C5F0]/15 text-[#36C5F0] text-[10px]">
                    ALERTED
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN 2: AI Intelligence, Live Spatial Map & Comms Stream (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* AI Intelligence Protocol Box */}
            <div className="bg-[#0b0e11] border border-[#8B7CFF]/30 rounded-xl p-4 space-y-3 shadow-[0_0_15px_rgba(139,124,255,0.1)]">
              <div className="flex items-center justify-between pb-2 border-b border-[#8B7CFF]/20">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-[#8B7CFF]" />
                  <h3 className="text-sm font-bold text-[#F5F7F8]">AI COPILOT RECOMMENDATION & PROTOCOL</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#8B7CFF]/20 text-[#8B7CFF] text-xs font-mono font-bold">
                  {currentIncident.aiConfidence}% CONFIDENCE
                </span>
              </div>

              <div className="p-3 bg-[#8B7CFF]/10 rounded-lg border border-[#8B7CFF]/20 text-xs space-y-2">
                <span className="font-mono font-bold text-[#8B7CFF] block">RECOMMENDED DISPATCH PROTOCOL:</span>
                <p className="text-white font-sans font-semibold">
                  Deploy Amphibious Rescue Unit equipped with hypothermia medical kit & thermal insulation blankets.
                </p>
                <div className="space-y-1 text-[#c5c6ca] font-sans pt-1 border-t border-[#8B7CFF]/20">
                  {currentIncident.aiExplanation.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#8B7CFF] font-mono">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-time Communications & Voice Stream */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col h-[400px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#36C5F0]" />
                  <h3 className="text-sm font-bold text-[#F5F7F8]">UNIFIED INCIDENT COMMUNICATOR</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#32D583]">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>BLE MESH VOICE CHANNEL LIVE</span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl border text-xs ${
                      msg.sender === 'CITIZEN'
                        ? 'bg-[#FF3B30]/10 border-[#FF3B30]/30 ml-0 mr-6'
                        : msg.sender === 'AI_COPILOT'
                        ? 'bg-[#8B7CFF]/10 border-[#8B7CFF]/30 mx-4'
                        : msg.sender === 'RESPONDER'
                        ? 'bg-[#32D583]/10 border-[#32D583]/30 ml-6 mr-0'
                        : 'bg-[#121d24] border-[#1D252C] ml-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className={`font-bold ${
                        msg.sender === 'CITIZEN' ? 'text-[#FF3B30]' :
                        msg.sender === 'AI_COPILOT' ? 'text-[#8B7CFF]' :
                        msg.sender === 'RESPONDER' ? 'text-[#32D583]' : 'text-[#36C5F0]'
                      }`}>
                        {msg.sender}
                      </span>
                      <span className="text-[#8f9194]">{msg.time} ({msg.type})</span>
                    </div>
                    <p className="text-white leading-relaxed font-sans">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-[#1D252C]">
                <input
                  type="text"
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder="Type operator dispatch instruction or message..."
                  className="flex-1 px-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#36C5F0] text-black font-bold text-xs hover:bg-[#36C5F0]/90 transition-all flex items-center gap-1 font-mono"
                >
                  <span>SEND</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

          {/* COLUMN 3: Responder Mission Control & Audit Log (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Assigned Responder Unit Panel */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#32D583]" />
                  <h3 className="text-sm font-bold text-[#F5F7F8]">ASSIGNED RESCUE UNIT</h3>
                </div>
                {assignedResponder ? (
                  <span className="px-2 py-0.5 rounded bg-[#32D583]/15 text-[#32D583] text-xs font-mono font-bold animate-pulse">
                    EN ROUTE ({assignedResponder.etaMinutes}m ETA)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#FFB020]/15 text-[#FFB020] text-xs font-mono font-bold">
                    UNASSIGNED
                  </span>
                )}
              </div>

              {assignedResponder ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#32D583]">{assignedResponder.id}</span>
                      <span className="text-xs text-[#8f9194] font-mono">{assignedResponder.type.replace('_', ' ')}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-0.5">{assignedResponder.name}</h4>
                  </div>

                  <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#8f9194]">CREW SIZE:</span>
                      <span className="text-white">{assignedResponder.personnelCount} Trained Responders</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8f9194]">DISTANCE:</span>
                      <span className="text-[#4C8DFF] font-bold">{assignedResponder.distanceKm} km to target</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8f9194]">BATTERY LEVEL:</span>
                      <span className="text-[#32D583] font-bold">{assignedResponder.batteryPercent}%</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-[#8f9194] block mb-1">EQUIPMENT LOADOUT:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {assignedResponder.equipment.map((eq, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#121d24] border border-[#1D252C] text-[11px] font-mono text-[#c5c6ca]">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-[#FFB020]/10 border border-[#FFB020]/20 text-center space-y-2">
                  <p className="text-xs text-[#FFB020] font-mono font-bold">No responder team assigned yet.</p>
                  <button
                    onClick={() => setDispatchModalOpen(true)}
                    className="w-full py-2 rounded-lg bg-[#FF3B30] text-white text-xs font-bold hover:bg-[#FF3B30]/90 transition-all font-mono"
                  >
                    DISPATCH RESCUE TEAM NOW
                  </button>
                </div>
              )}
            </div>

            {/* Audit Trail Timeline */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#8B7CFF]" />
                  <h3 className="text-sm font-bold text-[#F5F7F8]">INCIDENT EVENT CHRONOLOGY</h3>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-64 pr-1 text-xs">
                <div className="pl-4 border-l border-[#36C5F0] space-y-0.5">
                  <div className="flex justify-between font-mono text-[#36C5F0]">
                    <span className="font-bold">15:20:12 UTC</span>
                    <span>BLE MESH HOPS</span>
                  </div>
                  <p className="text-[#c5c6ca]">SOS activation received via Node G-02 (3 hops).</p>
                </div>

                <div className="pl-4 border-l border-[#8B7CFF] space-y-0.5">
                  <div className="flex justify-between font-mono text-[#8B7CFF]">
                    <span className="font-bold">15:20:15 UTC</span>
                    <span>AI RISK ENGINE</span>
                  </div>
                  <p className="text-[#c5c6ca]">Calculated Risk Score 94/100 (Hypothermia + Rising Inundation).</p>
                </div>

                <div className="pl-4 border-l border-[#32D583] space-y-0.5">
                  <div className="flex justify-between font-mono text-[#32D583]">
                    <span className="font-bold">15:21:04 UTC</span>
                    <span>OPERATOR ACTION</span>
                  </div>
                  <p className="text-[#c5c6ca]">Operator P. Kumar assigned Unit R-17 (Amphibious Alpha).</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Dispatch Modal */}
        {dispatchModalOpen && (
          <DispatchModal
            incident={currentIncident}
            responders={responders}
            onClose={() => setDispatchModalOpen(false)}
            onConfirmDispatch={handleConfirmDispatch}
          />
        )}
      </div>
    </AppShell>
  );
}
