'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { InteractiveTacticalMap } from '@/components/map/InteractiveTacticalMap';
import { DispatchModal } from '@/components/dashboard/DispatchModal';

import { mockIncidents } from '@/lib/mockData/incidents';
import { mockResponders } from '@/lib/mockData/responders';
import { mockNetworkNodes } from '@/lib/mockData/network';
import { Incident } from '@/lib/types';

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
              <span className="px-2 py-0.5 rounded bg-[#4C8DFF]/15 text-[#4C8DFF] text-xs font-mono font-semibold border border-[#4C8DFF]/30">
                OFFLINE VECTOR TILES READY
              </span>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Geospatial tactical view, live BLE mesh spatial node mapping, flood inundation vector boundaries & SOS pins.
            </p>
          </div>
        </div>

        {/* Map Stage Component */}
        <InteractiveTacticalMap
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
