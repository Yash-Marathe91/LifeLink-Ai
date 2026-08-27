'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { KPICard } from '@/components/common/KPICard';

import {
  Wifi,
  WifiOff,
  Radio,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Layers,
  Terminal,
  Shield,
  Clock,
  Server,
  Download,
  Share2,
  Sliders,
  Cpu,
  RotateCcw
} from 'lucide-react';

export default function NetworkResiliencePage() {
  const [selectedNode, setSelectedNode] = useState<string>('N-07');
  const [nodes, setNodes] = useState([
    { id: 'G-01', name: 'Primary Satellite Gateway 01', status: 'ONLINE', rssi: '-52 dBm', battery: 100, hops: 1, type: 'GATEWAY' },
    { id: 'G-02', name: 'Secondary Satellite Gateway 02', status: 'ONLINE', rssi: '-58 dBm', battery: 94, hops: 1, type: 'GATEWAY' },
    { id: 'N-01', name: 'Sector 1 Relay Node', status: 'ONLINE', rssi: '-64 dBm', battery: 88, hops: 2, type: 'RELAY' },
    { id: 'N-07', name: 'Sector 4 Flash Flood Relay', status: 'DEGRADED', rssi: '-84 dBm', battery: 34, hops: 3, type: 'RELAY' },
    { id: 'N-09', name: 'Sector 4 East Perimeter Relay', status: 'OFFLINE', rssi: 'N/A', battery: 0, hops: 4, type: 'RELAY' },
    { id: 'N-12', name: 'Sector 2 Base Relay', status: 'ONLINE', rssi: '-60 dBm', battery: 92, hops: 2, type: 'RELAY' }
  ]);

  const currentNode = nodes.find(n => n.id === selectedNode) || nodes[0];

  const handlePingNode = (nodeId: string) => {
    alert(`Sending diagnostic ping to Node ${nodeId}... Pong received in 4ms.`);
  };

  const handleOptimizeTopology = () => {
    alert('AI Mesh Topology Optimization initiated: Re-routing traffic around Node N-09.');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Title Header Bar */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#36C5F0]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">08 — Network & BLE Mesh Resilience Center</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Monitor decentralized off-grid communication infrastructure, node health, signal propagation & packet sync queues.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleOptimizeTopology}
              className="px-3.5 py-1.5 rounded-lg bg-[#36C5F0] text-black font-bold hover:bg-[#36C5F0]/90 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(54,197,240,0.3)]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>OPTIMIZE TOPOLOGY</span>
            </button>
          </div>
        </div>

        {/* Top Network KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="TOTAL BLE NODES"
            value="42 NODES"
            subtitle="38 Online • 3 Degraded • 1 Offline"
            icon={<Radio className="w-5 h-5" />}
            accentColor="cyan"
          />
          <KPICard
            title="GATEWAY UPLINK"
            value="SATELLITE 12MS"
            subtitle="Zero Packet Loss"
            icon={<Wifi className="w-5 h-5" />}
            accentColor="green"
          />
          <KPICard
            title="NETWORK OPERATIONAL HEALTH"
            value="96.4%"
            subtitle="Cascading Failure Risk Mitigated"
            icon={<Shield className="w-5 h-5" />}
            accentColor="violet"
          />
          <KPICard
            title="THROUGHPUT RATE"
            value="42.8 KB/S"
            subtitle="142 Packets Queued"
            icon={<Activity className="w-5 h-5" />}
            accentColor="amber"
          />
        </div>

        {/* Main 2-Column Section: Node Inspector & Topology Grid (7 Cols) vs Weak Coverage Analysis & Logs (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Node Grid & Topology Inspector (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#36C5F0]" />
                <h3 className="text-sm font-bold text-[#F5F7F8]">BLE MESH TOPOLOGY & NODE INSPECTOR</h3>
              </div>
              <span className="text-xs font-mono text-[#32D583] font-bold">42 ACTIVE MESH HOPS</span>
            </div>

            {/* Nodes Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-3 rounded-xl border text-left transition-all font-mono text-xs ${
                    selectedNode === node.id
                      ? 'bg-[#36C5F0]/15 border-[#36C5F0] shadow-[0_0_10px_rgba(54,197,240,0.3)]'
                      : 'bg-[#050607] border-[#1D252C] hover:border-[#2c363e]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{node.id}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      node.status === 'ONLINE' ? 'bg-[#32D583]' :
                      node.status === 'DEGRADED' ? 'bg-[#FFB020] animate-pulse' : 'bg-[#FF3B30]'
                    }`} />
                  </div>
                  <span className="text-[11px] text-[#8f9194] block truncate">{node.name}</span>
                  <span className="text-[10px] text-[#36C5F0] block mt-1">{node.rssi}</span>
                </button>
              ))}
            </div>

            {/* Selected Node Detailed Inspector Card */}
            <div className="p-4 bg-[#050607] rounded-xl border border-[#1D252C] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
                <div>
                  <span className="text-xs font-mono text-[#36C5F0] font-bold">{currentNode.id} — DETAILED TELEMETRY</span>
                  <h4 className="text-base font-bold text-white">{currentNode.name}</h4>
                </div>
                <button
                  onClick={() => handlePingNode(currentNode.id)}
                  className="px-3 py-1.5 rounded bg-[#121d24] border border-[#1D252C] text-xs font-mono text-[#36C5F0] hover:bg-[#36C5F0]/10 font-bold"
                >
                  PING NODE
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-[#121d24] rounded border border-[#1D252C]">
                  <span className="text-[#8f9194] block">STATUS:</span>
                  <span className={`font-bold ${
                    currentNode.status === 'ONLINE' ? 'text-[#32D583]' :
                    currentNode.status === 'DEGRADED' ? 'text-[#FFB020]' : 'text-[#FF3B30]'
                  }`}>
                    {currentNode.status}
                  </span>
                </div>

                <div className="p-2.5 bg-[#121d24] rounded border border-[#1D252C]">
                  <span className="text-[#8f9194] block">SIGNAL (RSSI):</span>
                  <span className="text-[#36C5F0] font-bold">{currentNode.rssi}</span>
                </div>

                <div className="p-2.5 bg-[#121d24] rounded border border-[#1D252C]">
                  <span className="text-[#8f9194] block">BATTERY LEVEL:</span>
                  <span className={`font-bold ${currentNode.battery < 40 ? 'text-[#FF3B30]' : 'text-[#32D583]'}`}>
                    {currentNode.battery}%
                  </span>
                </div>

                <div className="p-2.5 bg-[#121d24] rounded border border-[#1D252C]">
                  <span className="text-[#8f9194] block">HOPS TO GATEWAY:</span>
                  <span className="text-white font-bold">{currentNode.hops} Hops</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weak Coverage Analysis & Event Timeline (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Weak Coverage Alert Box */}
            <div className="bg-[#0b0e11] border border-[#FFB020]/40 rounded-xl p-5 space-y-3 shadow-lg bg-[#FFB020]/5">
              <div className="flex items-center gap-2 pb-2 border-b border-[#FFB020]/20">
                <AlertTriangle className="w-5 h-5 text-[#FFB020]" />
                <h3 className="text-sm font-bold text-[#F5F7F8]">WEAK COVERAGE GAP ANALYSIS</h3>
              </div>

              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded bg-[#FFB020]/20 text-[#FFB020] font-mono text-xs font-bold inline-block">
                  400m² COVERAGE GAP IN ZONE C
                </span>
                <p className="text-xs text-[#c5c6ca] font-sans leading-relaxed">
                  AI topology engine detected a 400m² coverage gap forming in Sector 4 Zone C due to Node N-09 being offline and Node N-07 signal degradation.
                </p>
              </div>

              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] text-xs font-mono text-[#36C5F0] space-y-1">
                <span className="font-bold text-white block">RECOMMENDED AI ACTION:</span>
                <p>Deploy Mobile BLE Relay Drone M-02 to bridge Zone C, or increase transmit power on Gateway G-02 by +6 dBm.</p>
              </div>
            </div>

            {/* Network Event Audit Log Stream */}
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#8B7CFF]" />
                  <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                    NETWORK EVENT CHRONOLOGY LOG
                  </h3>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-56 pr-1 text-xs font-mono">
                <div className="pl-3 border-l-2 border-[#FFB020] space-y-0.5">
                  <span className="text-[#FFB020] font-bold block">15:24:10 UTC — Node N-07 Degraded</span>
                  <p className="text-[#c5c6ca] text-[11px]">RSSI dropped from -68 dBm to -84 dBm. High interference.</p>
                </div>

                <div className="pl-3 border-l-2 border-[#FF3B30] space-y-0.5">
                  <span className="text-[#FF3B30] font-bold block">15:20:00 UTC — Node N-09 Offline</span>
                  <p className="text-[#c5c6ca] text-[11px]">Battery depleted (0%). Transmitted shutdown beacon.</p>
                </div>

                <div className="pl-3 border-l-2 border-[#32D583] space-y-0.5">
                  <span className="text-[#32D583] font-bold block">15:18:45 UTC — Gateway G-01 Synced</span>
                  <p className="text-[#c5c6ca] text-[11px]">142 packet sync queue flushed to Satellite cloud.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
