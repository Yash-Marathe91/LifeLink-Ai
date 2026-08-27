'use client';

import React from 'react';
import { NetworkRelayNode } from '@/lib/types';
import { Radio, Signal, Battery, Activity, AlertTriangle } from 'lucide-react';

interface NetworkHealthPanelProps {
  nodes: NetworkRelayNode[];
}

export const NetworkHealthPanel: React.FC<NetworkHealthPanelProps> = ({ nodes }) => {
  return (
    <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#36C5F0]" />
          <h3 className="text-base font-bold text-[#F5F7F8]">Resilient Network Health</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#36C5F0]/15 text-[#36C5F0] text-xs font-mono font-bold">
          94.2% MESH
        </span>
      </div>

      {/* Nodes list */}
      <div className="space-y-2.5 mt-3">
        {nodes.map((node) => {
          const isDegraded = node.status === 'DEGRADED';
          return (
            <div
              key={node.id}
              className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                isDegraded
                  ? 'bg-[#FFB020]/5 border-[#FFB020]/30'
                  : 'bg-[#121d24] border-[#1D252C]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#36C5F0]">{node.id}</span>
                  <span className="text-[#F5F7F8] truncate max-w-[170px]">{node.name}</span>
                </div>
                {isDegraded ? (
                  <span className="flex items-center gap-1 text-[#FFB020] font-bold text-[10px]">
                    <AlertTriangle className="w-3 h-3" />
                    DEGRADED
                  </span>
                ) : (
                  <span className="text-[#32D583] font-bold text-[10px]">OPTIMAL</span>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#1D252C] text-[11px] text-[#8f9194]">
                <span>{node.activeRelays} Active Relays</span>
                <span>{node.bandwidthKbps} Kbps</span>
                <span className={`flex items-center gap-1 ${node.batteryPercent < 30 ? 'text-[#FF3B30] font-bold' : 'text-[#32D583]'}`}>
                  <Battery className="w-3 h-3" />
                  {node.batteryPercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
