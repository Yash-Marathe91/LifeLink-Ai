'use client';

import React, { useState } from 'react';
import { Incident, ResponderTeam } from '@/lib/types';
import { MapPin, Layers, Radio, ShieldAlert, Truck, Maximize2, Compass } from 'lucide-react';

interface MapPreviewPanelProps {
  incidents: Incident[];
  responders: ResponderTeam[];
}

export const MapPreviewPanel: React.FC<MapPreviewPanelProps> = ({ incidents, responders }) => {
  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    responders: true,
    mesh: true,
    floodZone: true
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#4C8DFF]" />
          <div>
            <h3 className="text-base font-bold text-[#F5F7F8]">Sector 4 Spatial Tactical Map</h3>
            <p className="text-[11px] font-mono text-[#8f9194]">LAT: 26.1445° N | LON: 91.7362° E • MESH GRID ALIGNED</p>
          </div>
        </div>

        {/* Map Layer Controls */}
        <div className="flex items-center gap-1.5 bg-[#050607] p-1 rounded-lg border border-[#1D252C] text-[11px] font-mono">
          <button
            onClick={() => toggleLayer('incidents')}
            className={`px-2 py-0.5 rounded transition-all ${activeLayers.incidents ? 'bg-[#FF3B30]/20 text-[#FF3B30] font-bold' : 'text-[#8f9194]'}`}
          >
            SOS ({incidents.length})
          </button>
          <button
            onClick={() => toggleLayer('responders')}
            className={`px-2 py-0.5 rounded transition-all ${activeLayers.responders ? 'bg-[#32D583]/20 text-[#32D583] font-bold' : 'text-[#8f9194]'}`}
          >
            UNITS ({responders.length})
          </button>
          <button
            onClick={() => toggleLayer('mesh')}
            className={`px-2 py-0.5 rounded transition-all ${activeLayers.mesh ? 'bg-[#36C5F0]/20 text-[#36C5F0] font-bold' : 'text-[#8f9194]'}`}
          >
            MESH
          </button>
        </div>
      </div>

      {/* Tactical Canvas Box */}
      <div className="relative mt-3 flex-1 min-h-[300px] rounded-lg border border-[#1D252C] bg-[#050607] overflow-hidden flex flex-col justify-between p-4 bg-[radial-gradient(#1D252C_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Flood Risk Polygon Overlay (CSS backdrop effect) */}
        {activeLayers.floodZone && (
          <div className="absolute inset-x-8 top-10 bottom-12 rounded-3xl bg-[#FF3B30]/5 border border-[#FF3B30]/20 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-[#FF3B30]/40 tracking-widest uppercase">
              HIGH WATER INUNDATION ZONE — SECTOR 4
            </span>
          </div>
        )}

        {/* HUD Top Left */}
        <div className="relative z-10 flex items-center gap-2 text-[11px] font-mono bg-[#0b0e11]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#1D252C] w-fit">
          <Compass className="w-3.5 h-3.5 text-[#36C5F0] animate-spin" style={{ animationDuration: '10s' }} />
          <span>GRID S-4 • SCALE: 1:5000</span>
        </div>

        {/* Simulated Map Markers */}
        <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 gap-6 px-4">
          {/* Incident 1 Marker */}
          {activeLayers.incidents && (
            <div className="relative group p-2.5 rounded-lg bg-[#FF3B30]/15 border border-[#FF3B30] shadow-[0_0_15px_rgba(255,59,48,0.3)] animate-pulse-subtle">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF3B30]">
                <ShieldAlert className="w-4 h-4" />
                <span>INC-2048</span>
              </div>
              <p className="text-[10px] text-white mt-1 font-sans">Rooftop 4B (6 Citizens)</p>
              <span className="text-[9px] font-mono text-[#FF3B30] font-bold">CRITICAL • 18% Batt</span>
            </div>
          )}

          {/* Incident 2 Marker */}
          {activeLayers.incidents && (
            <div className="relative group p-2.5 rounded-lg bg-[#FFB020]/15 border border-[#FFB020] shadow-[0_0_15px_rgba(255,176,32,0.2)]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFB020]">
                <ShieldAlert className="w-4 h-4" />
                <span>INC-2049</span>
              </div>
              <p className="text-[10px] text-white mt-1 font-sans">Shelter B Basement</p>
              <span className="text-[9px] font-mono text-[#FFB020] font-bold">HIGH • 14 Citizens</span>
            </div>
          )}

          {/* Responder Unit Marker */}
          {activeLayers.responders && (
            <div className="relative group p-2.5 rounded-lg bg-[#32D583]/15 border border-[#32D583] shadow-[0_0_15px_rgba(50,213,131,0.2)]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#32D583]">
                <Truck className="w-4 h-4" />
                <span>UNIT R-17</span>
              </div>
              <p className="text-[10px] text-white mt-1 font-sans">En Route INC-2048</p>
              <span className="text-[9px] font-mono text-[#32D583] font-bold">ETA 4 MINS</span>
            </div>
          )}

          {/* Mesh Gateway Marker */}
          {activeLayers.mesh && (
            <div className="relative group p-2.5 rounded-lg bg-[#36C5F0]/15 border border-[#36C5F0]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#36C5F0]">
                <Radio className="w-4 h-4" />
                <span>NODE G-02</span>
              </div>
              <p className="text-[10px] text-white mt-1 font-sans">Satellite Gateway</p>
              <span className="text-[9px] font-mono text-[#36C5F0]">42 Hops Connected</span>
            </div>
          )}
        </div>

        {/* HUD Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#8f9194] bg-[#0b0e11]/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#1D252C]">
          <span>LIVE TELEMETRY: 5 INCIDENTS • 4 UNITS • 42 MESH HOPS</span>
          <a
            href="/map"
            className="flex items-center gap-1 text-[#36C5F0] hover:underline font-semibold"
          >
            <span>Expand Full Interactive Map (Page 02)</span>
            <Maximize2 className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
