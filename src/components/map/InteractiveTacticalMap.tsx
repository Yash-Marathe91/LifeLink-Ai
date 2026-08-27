'use client';

import React, { useState } from 'react';
import { Incident, ResponderTeam, NetworkRelayNode } from '@/lib/types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, 
  Layers, 
  Radio, 
  ShieldAlert, 
  Truck, 
  Building, 
  Compass, 
  Crosshair, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  Battery, 
  Users, 
  X, 
  ArrowUpRight,
  Wifi,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

interface EmergencyFacility {
  id: string;
  name: string;
  type: 'SHELTER' | 'HOSPITAL' | 'SUPPLY_DEPOT';
  capacityUsed: number;
  capacityTotal: number;
  location: { lat: number; lng: number; sector: string };
  medicalSupplies: 'HIGH' | 'ADEQUATE' | 'CRITICAL_LOW';
  generatorPower: string;
}

const mockFacilities: EmergencyFacility[] = [
  {
    id: 'FAC-01',
    name: 'Sector 4 Community High School Shelter',
    type: 'SHELTER',
    capacityUsed: 124,
    capacityTotal: 150,
    location: { lat: 26.1510, lng: 91.7415, sector: 'Sector 4' },
    medicalSupplies: 'ADEQUATE',
    generatorPower: '88% (Diesel 48h)'
  },
  {
    id: 'FAC-02',
    name: 'Central Emergency Trauma Hospital',
    type: 'HOSPITAL',
    capacityUsed: 42,
    capacityTotal: 60,
    location: { lat: 26.1480, lng: 91.7450, sector: 'Sector 4' },
    medicalSupplies: 'HIGH',
    generatorPower: '100% (Grid + Backup)'
  }
];

interface InteractiveTacticalMapProps {
  incidents: Incident[];
  responders: ResponderTeam[];
  networkNodes: NetworkRelayNode[];
  onDispatchUnit?: (incident: Incident) => void;
}

export const InteractiveTacticalMap: React.FC<InteractiveTacticalMapProps> = ({
  incidents,
  responders,
  networkNodes,
  onDispatchUnit
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [mapMode, setMapMode] = useState<'TACTICAL' | 'SATELLITE' | 'MESH_TOPOLOGY' | 'FLOOD_HEATMAP'>('TACTICAL');
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'INCIDENT' | 'RESPONDER' | 'NODE' | 'FACILITY';
    data: any;
  } | null>({ type: 'INCIDENT', data: incidents[0] });

  const [visibleLayers, setVisibleLayers] = useState({
    incidents: true,
    responders: true,
    network: true,
    facilities: true,
    floodPolygons: true
  });

  const toggleLayer = (layerKey: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const filteredIncidents = incidents.filter(i => selectedSector === 'ALL' || i.location.sector === selectedSector);
  const filteredResponders = responders.filter(r => selectedSector === 'ALL' || r.location.sector === selectedSector);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)]">
      {/* Main Map Viewport */}
      <div className="flex-1 bg-[#050607] border border-[#1D252C] rounded-xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Map Header Toolbar */}
        <div className="p-3 bg-[#0b0e11]/90 backdrop-blur-md border-b border-[#1D252C] z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#4C8DFF]/15 text-[#4C8DFF] border border-[#4C8DFF]/30">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F7F8]">GEOSPATIAL MISSION TACTICAL STAGE</h2>
              <p className="text-[11px] font-mono text-[#8f9194]">SECTOR 4 GRID • POSTGIS SPATIAL ENGINE • TACTICAL VECTOR LAYER</p>
            </div>
          </div>

          {/* Sector Selector & Map View Modes */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#050607] p-1 rounded-lg border border-[#1D252C] text-xs font-mono">
              <span className="text-[#8f9194] px-1.5">SECTOR:</span>
              {['ALL', 'Sector 4', 'Sector 2', 'Sector 9'].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    selectedSector === sec ? 'bg-[#36C5F0] text-black font-bold' : 'text-[#8f9194] hover:text-white'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Mode Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-[#050607] p-1 rounded-lg border border-[#1D252C] text-xs font-mono">
              {(['TACTICAL', 'SATELLITE', 'MESH_TOPOLOGY', 'FLOOD_HEATMAP'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setMapMode(mode)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    mapMode === mode ? 'bg-[#121d24] text-white border border-[#2c363e] font-semibold' : 'text-[#8f9194] hover:text-white'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tactical Canvas Stage */}
        <div className={`flex-1 relative overflow-hidden transition-all duration-300 ${
          mapMode === 'SATELLITE' 
            ? 'bg-[#03060a] bg-[radial-gradient(#162128_1px,transparent_1px)] [background-size:24px_24px]'
            : mapMode === 'MESH_TOPOLOGY'
            ? 'bg-[#050607] bg-[radial-gradient(#36C5F0_1px,transparent_1px)] [background-size:32px_32px]'
            : 'bg-[#050607] bg-[radial-gradient(#1D252C_1px,transparent_1px)] [background-size:16px_16px]'
        }`}>
          
          {/* Simulated Flood Hazard Layer Polygon */}
          {visibleLayers.floodPolygons && (
            <div className="absolute inset-[15%] rounded-[40px] bg-[#FF3B30]/5 border-2 border-dashed border-[#FF3B30]/30 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
              <div className="text-center p-3 rounded-xl bg-[#0b0e11]/80 border border-[#FF3B30]/30 shadow-lg">
                <span className="text-xs font-mono font-bold text-[#FF3B30] tracking-wider block">
                  ⚠️ INUNDATION ZONE DELTA (WATER LEVEL: +1.8M)
                </span>
                <span className="text-[10px] font-mono text-[#8f9194]">Updated 2 mins ago via Sensor Mesh Node N-07</span>
              </div>
            </div>
          )}

          {/* Simulated BLE Mesh Vector Connectivity Lines */}
          {visibleLayers.network && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#36C5F0]/30 stroke-dasharray-4">
              <line x1="25%" y1="35%" x2="50%" y2="50%" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="70%" y2="40%" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="60%" y2="70%" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          )}

          {/* MAP ENTITY MARKERS DISPLAY */}
          <div className="absolute inset-0 p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-auto items-center justify-items-center">
            
            {/* INCIDENTS MARKERS */}
            {visibleLayers.incidents && filteredIncidents.map((incident, idx) => {
              const isSelected = selectedEntity?.type === 'INCIDENT' && selectedEntity.data.id === incident.id;
              const isCritical = incident.severity === 'CRITICAL';

              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedEntity({ type: 'INCIDENT', data: incident })}
                  className={`cursor-pointer transition-all duration-200 transform hover:scale-110 z-10 ${
                    isSelected ? 'ring-2 ring-[#36C5F0] ring-offset-2 ring-offset-[#050607]' : ''
                  }`}
                >
                  <div className={`p-3 rounded-xl border flex flex-col gap-1 shadow-2xl backdrop-blur-md min-w-[170px] ${
                    isCritical
                      ? 'bg-[#FF3B30]/15 border-[#FF3B30] shadow-[0_0_20px_rgba(255,59,48,0.4)] animate-pulse-subtle'
                      : 'bg-[#FFB020]/15 border-[#FFB020] shadow-[0_0_15px_rgba(255,176,32,0.3)]'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#F5F7F8] flex items-center gap-1">
                        <ShieldAlert className={`w-3.5 h-3.5 ${isCritical ? 'text-[#FF3B30]' : 'text-[#FFB020]'}`} />
                        {incident.id}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#050607] font-bold text-[10px] text-white">
                        {incident.riskScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#F5F7F8] line-clamp-1">{incident.title}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#c5c6ca] pt-1 border-t border-white/10">
                      <span>{incident.peopleCount} People</span>
                      <span>{incident.location.sector}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* RESPONDER MARKERS */}
            {visibleLayers.responders && filteredResponders.map((responder) => {
              const isSelected = selectedEntity?.type === 'RESPONDER' && selectedEntity.data.id === responder.id;
              return (
                <div
                  key={responder.id}
                  onClick={() => setSelectedEntity({ type: 'RESPONDER', data: responder })}
                  className={`cursor-pointer transition-all duration-200 transform hover:scale-110 z-10 ${
                    isSelected ? 'ring-2 ring-[#32D583] ring-offset-2 ring-offset-[#050607]' : ''
                  }`}
                >
                  <div className="p-3 rounded-xl bg-[#32D583]/15 border border-[#32D583] shadow-[0_0_15px_rgba(50,213,131,0.3)] backdrop-blur-md min-w-[160px]">
                    <div className="flex items-center justify-between text-xs font-mono text-[#32D583] font-bold">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        {responder.id}
                      </span>
                      <span className="text-[10px] px-1 rounded bg-[#050607] text-[#32D583]">
                        {responder.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-white mt-1">{responder.name}</p>
                    <p className="text-[10px] font-mono text-[#c5c6ca] mt-0.5">ETA: {responder.etaMinutes}m</p>
                  </div>
                </div>
              );
            })}

            {/* NETWORK NODE MARKERS */}
            {visibleLayers.network && networkNodes.map((node) => {
              const isSelected = selectedEntity?.type === 'NODE' && selectedEntity.data.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedEntity({ type: 'NODE', data: node })}
                  className={`cursor-pointer transition-all duration-200 transform hover:scale-110 z-10 ${
                    isSelected ? 'ring-2 ring-[#36C5F0] ring-offset-2 ring-offset-[#050607]' : ''
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-[#36C5F0]/10 border border-[#36C5F0] shadow-lg backdrop-blur-md min-w-[150px]">
                    <div className="flex items-center justify-between text-xs font-mono text-[#36C5F0] font-bold">
                      <span className="flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5" />
                        {node.id}
                      </span>
                      <span className="text-[10px]">{node.batteryPercent}%</span>
                    </div>
                    <p className="text-[10px] text-white line-clamp-1 mt-1 font-mono">{node.name}</p>
                  </div>
                </div>
              );
            })}

            {/* FACILITY MARKERS */}
            {visibleLayers.facilities && mockFacilities.map((fac) => {
              const isSelected = selectedEntity?.type === 'FACILITY' && selectedEntity.data.id === fac.id;
              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedEntity({ type: 'FACILITY', data: fac })}
                  className={`cursor-pointer transition-all duration-200 transform hover:scale-110 z-10 ${
                    isSelected ? 'ring-2 ring-[#4C8DFF] ring-offset-2 ring-offset-[#050607]' : ''
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-[#4C8DFF]/10 border border-[#4C8DFF] shadow-lg backdrop-blur-md min-w-[160px]">
                    <div className="flex items-center justify-between text-xs font-mono text-[#4C8DFF] font-bold">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {fac.id}
                      </span>
                      <span className="text-[10px] text-white">{fac.capacityUsed}/{fac.capacityTotal}</span>
                    </div>
                    <p className="text-[10px] text-white line-clamp-1 mt-1 font-mono">{fac.name}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Map Zoom Controls & Coordinates Ticker HUD */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#0b0e11]/90 border border-[#1D252C] p-1 rounded-lg text-xs font-mono">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
                className="p-1.5 rounded hover:bg-[#121d24] text-[#c5c6ca] hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="px-2 text-[#36C5F0] font-bold">ZOOM: {zoomLevel}x</span>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 1, 8))}
                className="p-1.5 rounded hover:bg-[#121d24] text-[#c5c6ca] hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#0b0e11]/90 border border-[#1D252C] text-xs font-mono text-[#8f9194]">
              CURSOR: <span className="text-[#F5F7F8]">26.1445° N, 91.7362° E</span>
            </div>
          </div>

          {/* Floating Layer Controls HUD (Right Top) */}
          <div className="absolute top-16 right-4 z-20 bg-[#0b0e11]/90 backdrop-blur-md border border-[#1D252C] rounded-xl p-3 shadow-xl text-xs font-mono space-y-2">
            <div className="flex items-center gap-1.5 text-[#F5F7F8] font-bold pb-1 border-b border-[#1D252C]">
              <Layers className="w-4 h-4 text-[#36C5F0]" />
              <span>TACTICAL LAYERS</span>
            </div>
            
            <button
              onClick={() => toggleLayer('incidents')}
              className={`w-full flex items-center justify-between gap-3 px-2 py-1 rounded transition-all ${
                visibleLayers.incidents ? 'bg-[#FF3B30]/15 text-[#FF3B30]' : 'text-[#8f9194]'
              }`}
            >
              <span>SOS Incidents</span>
              {visibleLayers.incidents ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => toggleLayer('responders')}
              className={`w-full flex items-center justify-between gap-3 px-2 py-1 rounded transition-all ${
                visibleLayers.responders ? 'bg-[#32D583]/15 text-[#32D583]' : 'text-[#8f9194]'
              }`}
            >
              <span>Rescue Teams</span>
              {visibleLayers.responders ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => toggleLayer('network')}
              className={`w-full flex items-center justify-between gap-3 px-2 py-1 rounded transition-all ${
                visibleLayers.network ? 'bg-[#36C5F0]/15 text-[#36C5F0]' : 'text-[#8f9194]'
              }`}
            >
              <span>BLE Mesh Relay</span>
              {visibleLayers.network ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => toggleLayer('facilities')}
              className={`w-full flex items-center justify-between gap-3 px-2 py-1 rounded transition-all ${
                visibleLayers.facilities ? 'bg-[#4C8DFF]/15 text-[#4C8DFF]' : 'text-[#8f9194]'
              }`}
            >
              <span>Shelters/Facilities</span>
              {visibleLayers.facilities ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => toggleLayer('floodPolygons')}
              className={`w-full flex items-center justify-between gap-3 px-2 py-1 rounded transition-all ${
                visibleLayers.floodPolygons ? 'bg-[#8B7CFF]/15 text-[#8B7CFF]' : 'text-[#8f9194]'
              }`}
            >
              <span>Inundation Zone</span>
              {visibleLayers.floodPolygons ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Selected Entity Contextual Inspector Drawer */}
      {selectedEntity && (
        <div className="w-full lg:w-80 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col justify-between h-auto lg:h-full">
          <div className="space-y-4">
            {/* Drawer Title */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#36C5F0]" />
                <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                  SPATIAL INSPECTOR — {selectedEntity.type}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="p-1 rounded text-[#8f9194] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Entity Content: Incident */}
            {selectedEntity.type === 'INCIDENT' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#36C5F0]">{selectedEntity.data.id}</span>
                  <StatusBadge type="severity" value={selectedEntity.data.severity} />
                </div>

                <h4 className="text-sm font-bold text-[#F5F7F8] leading-tight">
                  {selectedEntity.data.title}
                </h4>

                <div className="p-3 bg-[#121d24] rounded-lg border border-[#1D252C] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Risk Score:</span>
                    <span className="text-[#FF3B30] font-bold">{selectedEntity.data.riskScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Headcount:</span>
                    <span className="text-white">{selectedEntity.data.peopleCount} Citizens</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Location:</span>
                    <span className="text-white">{selectedEntity.data.location.sector}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Battery:</span>
                    <span className="text-[#32D583] font-bold">{selectedEntity.data.batteryLevel}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Transport:</span>
                    <span className="text-[#36C5F0] font-bold">{selectedEntity.data.transport}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#8B7CFF]/10 rounded-lg border border-[#8B7CFF]/20 text-xs">
                  <span className="font-mono font-bold text-[#8B7CFF] block mb-1">AI TELEMETRY NOTE</span>
                  <p className="text-[#c5c6ca] leading-snug">
                    {selectedEntity.data.aiExplanation[0]}
                  </p>
                </div>
              </div>
            )}

            {/* Entity Content: Responder */}
            {selectedEntity.type === 'RESPONDER' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#32D583]">{selectedEntity.data.id}</span>
                  <span className="px-2 py-0.5 rounded bg-[#32D583]/15 text-[#32D583] font-mono text-xs font-bold">
                    {selectedEntity.data.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#F5F7F8]">
                  {selectedEntity.data.name}
                </h4>

                <div className="p-3 bg-[#121d24] rounded-lg border border-[#1D252C] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Personnel:</span>
                    <span className="text-white">{selectedEntity.data.personnelCount} Responders</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">ETA:</span>
                    <span className="text-[#32D583] font-bold">{selectedEntity.data.etaMinutes} mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Battery:</span>
                    <span className="text-white">{selectedEntity.data.batteryPercent}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Entity Content: Node */}
            {selectedEntity.type === 'NODE' && (
              <div className="space-y-3">
                <span className="font-mono text-sm font-bold text-[#36C5F0]">{selectedEntity.data.id}</span>
                <h4 className="text-sm font-bold text-[#F5F7F8]">{selectedEntity.data.name}</h4>
                <div className="p-3 bg-[#121d24] rounded-lg border border-[#1D252C] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Active Relays:</span>
                    <span className="text-[#36C5F0] font-bold">{selectedEntity.data.activeRelays} Hops</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9194]">Bandwidth:</span>
                    <span className="text-white">{selectedEntity.data.bandwidthKbps} Kbps</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#1D252C] mt-4">
            {selectedEntity.type === 'INCIDENT' && onDispatchUnit && (
              <button
                onClick={() => onDispatchUnit(selectedEntity.data)}
                className="w-full py-2.5 rounded-lg bg-[#FF3B30] text-white text-xs font-bold hover:bg-[#FF3B30]/90 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,59,48,0.3)]"
              >
                <span>DISPATCH TEAM TO THIS SOS</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
