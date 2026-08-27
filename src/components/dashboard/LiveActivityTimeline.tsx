'use client';

import React from 'react';
import { ActivityTimelineItem } from '@/lib/types';
import { History, User, BrainCircuit, ShieldAlert, Cpu } from 'lucide-react';

interface LiveActivityTimelineProps {
  activities: ActivityTimelineItem[];
}

export const LiveActivityTimeline: React.FC<LiveActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#8B7CFF]" />
          <h3 className="text-base font-bold text-[#F5F7F8]">Live Activity Timeline</h3>
        </div>
        <span className="text-xs font-mono text-[#8f9194]">REAL-TIME AUDIT FEED</span>
      </div>

      {/* Timeline List */}
      <div className="space-y-3 mt-3 overflow-y-auto max-h-72 pr-1">
        {activities.map((item) => {
          let roleIcon = <User className="w-3.5 h-3.5 text-[#36C5F0]" />;
          let roleColor = 'text-[#36C5F0]';

          if (item.actorRole === 'AI_RISK_ENGINE') {
            roleIcon = <BrainCircuit className="w-3.5 h-3.5 text-[#8B7CFF]" />;
            roleColor = 'text-[#8B7CFF]';
          } else if (item.actorRole === 'OPERATOR') {
            roleIcon = <User className="w-3.5 h-3.5 text-[#32D583]" />;
            roleColor = 'text-[#32D583]';
          } else if (item.actorRole === 'RESPONDER') {
            roleIcon = <ShieldAlert className="w-3.5 h-3.5 text-[#FFB020]" />;
            roleColor = 'text-[#FFB020]';
          } else {
            roleIcon = <Cpu className="w-3.5 h-3.5 text-[#8f9194]" />;
            roleColor = 'text-[#8f9194]';
          }

          return (
            <div key={item.id} className="relative pl-5 border-l border-[#1D252C] pb-2 last:pb-0">
              {/* Dot */}
              <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-[#050607] border border-[#2c363e] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#36C5F0]" />
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className={`font-semibold ${roleColor} flex items-center gap-1 font-mono`}>
                  {roleIcon}
                  {item.actor}
                </span>
                <span className="font-mono text-[11px] text-[#8f9194]">{item.timestamp}</span>
              </div>

              <p className="text-xs text-[#c5c6ca] mt-1 leading-snug font-sans">
                {item.action}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
