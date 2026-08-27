'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AppShell } from '@/components/layout/AppShell';
import { DispatchModal } from '@/components/dashboard/DispatchModal';

import { mockIncidents } from '@/lib/mockData/incidents';
import { mockResponders } from '@/lib/mockData/responders';
import { mockNetworkNodes } from '@/lib/mockData/network';
import { Incident } from '@/lib/types';

// Dynamically import Leaflet Tactical Map with SSR disabled for browser DOM compatibility
const RealTacticalLeafletMap = dynamic(
  () => import('@/components/map/RealTacticalLeafletMap').then((mod) => mod.RealTacticalLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-8.5rem)] bg-[#050607] border border-[#1D252C] rounded-xl flex items-center justify-center font-mono text-xs text-[#36C5F0] animate-pulse">
        ⚡ INITIALIZING CARTO TACTICAL GIS STAGE & LEAFLET MAP ENGINE...
      </div>
    ),
  }
);

export default function LiveEmergencyMapPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [responders, setResponders] = useState(mockResponders);
  const [dispatchTarget, setDispatchTarget] = useState<Incident | null>(null);

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
      <div className="space-y-4">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#F5F7F8] tracking-tight">02 — Live Emergency Map Intelligence</h1>
              <span className="px-2 py-0.5 rounded bg-[#32D583]/15 text-[#32D583] text-xs font-mono font-semibold border border-[#32D583]/30">
                100% FREE NO-CARD GIS ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Real-time CartoDB Dark GIS Map, OSRM turn-by-turn squad routing, Nominatim address geocoding, and live SOS pins.
            </p>
          </div>
        </div>

        {/* Dynamic Leaflet Map Component */}
        <RealTacticalLeafletMap
          incidents={incidents}
          responders={responders}
          networkNodes={mockNetworkNodes}
          onDispatchUnit={(inc) => setDispatchTarget(inc)}
        />

        {/* Dispatch Modal */}
        {dispatchTarget && (
          <DispatchModal
            incident={dispatchTarget}
            responders={responders}
            onClose={() => setDispatchTarget(null)}
            onConfirmDispatch={handleConfirmDispatch}
          />
        )}
      </div>
    </AppShell>
  );
}
