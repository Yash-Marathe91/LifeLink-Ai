'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { KPICard } from '@/components/common/KPICard';

import {
  ShieldCheck,
  Lock,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Key,
  Terminal,
  Clock,
  UserCheck,
  Cpu,
  Fingerprint,
  RefreshCw
} from 'lucide-react';

export default function AuditLogsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'AI' | 'DISPATCH' | 'MESH' | 'AUTH'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogId, setSelectedLogId] = useState<string>('LOG-8902');

  const auditLogs = [
    {
      id: 'LOG-8902',
      timestamp: '2026-08-27 15:41:02 UTC',
      eventType: 'DECISION_PROTOCOL_APPROVED',
      category: 'AI',
      actor: 'Cmdr. Rajesh Sharma (ID: OP-402)',
      target: 'Incident INC-2048 (Sector 4)',
      details: 'Approved automated unit reallocation for Unit R-17 (Amphibious Raft) to Sector 4 Rooftop 4B.',
      hash: 'sha256:a8f9c14092b3e817d2e094bc12a0f81',
      status: 'VERIFIED'
    },
    {
      id: 'LOG-8901',
      timestamp: '2026-08-27 15:38:12 UTC',
      eventType: 'AI_ANOMALY_CORRELATION',
      category: 'AI',
      actor: 'Gemini 3.1 Pro Correlation Engine',
      target: 'BLE Relay Node N-07',
      details: 'Detected 94.2% probability of cascading node failure due to signal RSSI drop to -84 dBm.',
      hash: 'sha256:4b1e902187ccb901a4e219bf081a92d',
      status: 'VERIFIED'
    },
    {
      id: 'LOG-8900',
      timestamp: '2026-08-27 15:30:45 UTC',
      eventType: 'RESPONDER_DISPATCH_ISSUED',
      category: 'DISPATCH',
      actor: 'Cmdr. Rajesh Sharma (ID: OP-402)',
      target: 'Unit R-17 (Amphibious Rescue)',
      details: 'Dispatched Unit R-17 to high-priority victim SOS location at Sector 4 Waterway B.',
      hash: 'sha256:e7d23a1902bb84501a92e104f90d18e',
      status: 'VERIFIED'
    },
    {
      id: 'LOG-8899',
      timestamp: '2026-08-27 15:25:00 UTC',
      eventType: 'OFFLINE_PACKET_SYNC_FLUSH',
      category: 'MESH',
      actor: 'Primary Gateway G-01',
      target: 'Satellite Mesh Queue',
      details: 'Flushed 142 offline telemetry packets collected via BLE Mesh hop relay G-01 to G-08.',
      hash: 'sha256:f901b45209ac4819e09d1204e891b2c',
      status: 'VERIFIED'
    },
    {
      id: 'LOG-8898',
      timestamp: '2026-08-27 15:10:14 UTC',
      eventType: 'OPERATOR_AUTHENTICATED',
      category: 'AUTH',
      actor: 'Capt. Ananya Roy (ID: OP-104)',
      target: 'Command Console Station 02',
      details: 'Biometric MFA & Hardware Token verification successful. Session granted level 4 security scope.',
      hash: 'sha256:87ca91024b89cc1048a9201948bc100',
      status: 'VERIFIED'
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = selectedFilter === 'ALL' || log.category === selectedFilter;
    const matchesSearch = log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentLog = auditLogs.find(l => l.id === selectedLogId) || auditLogs[0];

  const handleExportAuditCSV = () => {
    alert('Exporting cryptographically signed Audit Log CSV report...');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#32D583]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Activity Audit & Compliance Center</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Cryptographically verifiable system audit trail, operator command logs, AI reasoning chain history & forensic oversight.
            </p>
          </div>

          <button
            onClick={handleExportAuditCSV}
            className="px-3.5 py-1.5 rounded-lg bg-[#36C5F0] text-black font-bold text-xs hover:bg-[#36C5F0]/90 transition-all flex items-center gap-1.5 font-mono shadow-[0_0_12px_rgba(54,197,240,0.3)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT SIGNED AUDIT REPORT</span>
          </button>
        </div>

        {/* Top Security & Audit KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="SYSTEM EVENTS TODAY"
            value="14,289"
            subtitle="100% Logged & Hash-Chained"
            icon={<FileText className="w-5 h-5" />}
            accentColor="cyan"
          />
          <KPICard
            title="ACTIVE OPERATORS"
            value="18 ACTIVE"
            subtitle="MFA Biometric Session Verified"
            icon={<UserCheck className="w-5 h-5" />}
            accentColor="green"
          />
          <KPICard
            title="HASH CHAIN INTEGRITY"
            value="IMMUTABLE"
            subtitle="SHA-256 Merkle Proof 100%"
            icon={<Lock className="w-5 h-5" />}
            accentColor="violet"
          />
          <KPICard
            title="SECURITY THREATS"
            value="0 ANOMALIES"
            subtitle="Zero Unauthorized Access"
            icon={<Fingerprint className="w-5 h-5" />}
            accentColor="blue"
          />
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Events (14,289)' },
              { id: 'AI', label: 'AI Decisions (4,120)' },
              { id: 'DISPATCH', label: 'Dispatch Commands (3,840)' },
              { id: 'MESH', label: 'Mesh Syncs (5,100)' },
              { id: 'AUTH', label: 'Security & Auth (1,229)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  selectedFilter === tab.id
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
              placeholder="Search logs or SHA-256 hash..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583]"
            />
          </div>
        </div>

        {/* Main 2-Column Grid: Forensic Log Table (7 Cols) & Cryptographic Verification Drawer (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Audit Log Stream (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#32D583]" />
                <h3 className="text-sm font-bold text-[#F5F7F8]">FORENSIC AUDIT CHRONOLOGY STREAM</h3>
              </div>
              <span className="text-xs font-mono text-[#32D583] font-bold">100% IMMUTABLE LOGS</span>
            </div>

            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLogId(log.id)}
                  className={`p-4 rounded-xl border space-y-2 cursor-pointer transition-all ${
                    selectedLogId === log.id
                      ? 'bg-[#32D583]/10 border-[#32D583] shadow-[0_0_10px_rgba(50,213,131,0.2)]'
                      : 'bg-[#050607] border-[#1D252C] hover:border-[#2c363e]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#32D583]">{log.id}</span>
                      <span className="px-2 py-0.5 rounded bg-[#121d24] text-white font-bold">
                        {log.eventType}
                      </span>
                    </div>
                    <span className="text-[#8f9194] text-[11px]">{log.timestamp}</span>
                  </div>

                  <p className="text-xs font-sans text-[#c5c6ca] font-semibold leading-relaxed">
                    {log.details}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#8f9194]">
                    <span>Actor: <strong className="text-white">{log.actor}</strong></span>
                    <span className="text-[#32D583] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Inspector Drawer (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b0e11] border border-[#32D583]/30 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#32D583]/20">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#32D583]" />
                <h3 className="text-sm font-bold text-[#F5F7F8]">CRYPTOGRAPHIC PROOF INSPECTOR</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#32D583]/20 text-[#32D583] text-xs font-mono font-bold">
                MERKLE PROOF VALID
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-2">
                <div>
                  <span className="text-[#8f9194] block">LOG ID & EVENT:</span>
                  <span className="text-white font-bold">{currentLog.id} • {currentLog.eventType}</span>
                </div>

                <div>
                  <span className="text-[#8f9194] block">TIMESTAMP:</span>
                  <span className="text-[#36C5F0] font-bold">{currentLog.timestamp}</span>
                </div>

                <div>
                  <span className="text-[#8f9194] block">INITIATING ACTOR:</span>
                  <span className="text-white font-bold">{currentLog.actor}</span>
                </div>

                <div>
                  <span className="text-[#8f9194] block">TARGET RESOURCE:</span>
                  <span className="text-[#8B7CFF] font-bold">{currentLog.target}</span>
                </div>
              </div>

              {/* SHA-256 Hash Display Box */}
              <div className="p-3 bg-[#050607] rounded-lg border border-[#32D583]/40 space-y-1">
                <span className="text-[#32D583] font-bold block text-[11px]">SHA-256 MERKLE HASH:</span>
                <p className="text-white text-[11px] break-all font-mono">
                  {currentLog.hash}
                </p>
              </div>

              {/* Verification Proof Steps */}
              <div className="space-y-2">
                <span className="text-[#8f9194] text-[11px] block">SECURITY VERIFICATION CHECKS:</span>
                <div className="p-2 bg-[#121d24] rounded border border-[#1D252C] flex items-center justify-between">
                  <span>Hardware Security Module (HSM) Signature</span>
                  <span className="text-[#32D583] font-bold">PASS</span>
                </div>
                <div className="p-2 bg-[#121d24] rounded border border-[#1D252C] flex items-center justify-between">
                  <span>Operator Biometric Key Match</span>
                  <span className="text-[#32D583] font-bold">PASS</span>
                </div>
                <div className="p-2 bg-[#121d24] rounded border border-[#1D252C] flex items-center justify-between">
                  <span>Blockchain Merkle Tree Sync</span>
                  <span className="text-[#32D583] font-bold">SYNCHRONIZED</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Copied SHA-256 hash (${currentLog.hash}) to clipboard.`)}
                className="w-full py-2.5 rounded-lg bg-[#32D583] text-black font-mono font-bold text-xs hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(50,213,131,0.3)]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>COPY HASH PROOF TO CLIPBOARD</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
