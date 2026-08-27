'use client';

import React from 'react';
import { ResponderTeam } from '@/lib/types';
import { Truck, ShieldCheck, Navigation, Battery, Users, ArrowUpRight } from 'lucide-react';

interface ResponderOperationsPanelProps {
  responders: ResponderTeam[];
}

export const ResponderOperationsPanel: React.FC<ResponderOperationsPanelProps> = ({ responders }) => {
  return (
    <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#32D583]" />
          <h3 className="text-base font-bold text-[#F5F7F8]">Responder Operations</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#32D583]/15 text-[#32D583] text-xs font-mono font-bold">
          {responders.filter(r => r.status === 'EN_ROUTE' || r.status === 'ON_SCENE').length} Active
        </span>
      </div>

      {/* Responders List */}
      <div className="space-y-3 mt-3">
        {responders.map((responder) => {
          const isEnRoute = responder.status === 'EN_ROUTE';
          const isAvailable = responder.status === 'AVAILABLE';

          return (
            <div
              key={responder.id}
              className="bg-[#121d24] border border-[#1D252C] rounded-lg p-3 hover:border-[#2c363e] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#32D583]">{responder.id}</span>
                    <h4 className="text-xs font-bold text-[#F5F7F8]">{responder.name}</h4>
                  </div>
                  <p className="text-[11px] text-[#8f9194] mt-0.5 font-mono">
                    {responder.type.replace('_', ' ')} • {responder.personnelCount} Crew
                  </p>
                </div>

                {isEnRoute ? (
                  <span className="px-2 py-0.5 rounded bg-[#FF3B30]/15 text-[#FF3B30] text-[10px] font-mono font-bold border border-[#FF3B30]/30 animate-pulse">
                    EN ROUTE ({responder.etaMinutes}m ETA)
                  </span>
                ) : isAvailable ? (
                  <span className="px-2 py-0.5 rounded bg-[#32D583]/15 text-[#32D583] text-[10px] font-mono font-bold border border-[#32D583]/30">
                    READY
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#FFB020]/15 text-[#FFB020] text-[10px] font-mono font-bold border border-[#FFB020]/30">
                    BUSY
                  </span>
                )}
              </div>

              {/* Telemetry info */}
              <div className="mt-2 pt-2 border-t border-[#1D252C] flex items-center justify-between text-[11px] font-mono text-[#c5c6ca]">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#4C8DFF]" />
                  {responder.location.sector} ({responder.distanceKm} km away)
                </span>
                <span className="flex items-center gap-1">
                  <Battery className="w-3 h-3 text-[#32D583]" />
                  {responder.batteryPercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
