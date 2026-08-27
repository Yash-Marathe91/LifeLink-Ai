'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Incident, ResponderTeam, NetworkRelayNode } from '@/lib/types';
import { Search, Navigation, Compass, Crosshair } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface RealTacticalLeafletMapProps {
  incidents: Incident[];
  responders: ResponderTeam[];
  networkNodes: NetworkRelayNode[];
  onDispatchUnit?: (incident: Incident) => void;
}

export const RealTacticalLeafletMap: React.FC<RealTacticalLeafletMapProps> = ({
  incidents,
  responders,
  networkNodes,
  onDispatchUnit
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const polylineRef = useRef<any>(null);

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<{ distanceKm: string; durationMins: string } | null>(null);

  // Initialize Leaflet Map once component mounts on browser
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Dynamically load Leaflet library if not already present
    import('leaflet').then((L) => {
      // Fix default marker icon assets
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const container = mapContainerRef.current;
      if (!container) return;

      if (!mapInstanceRef.current) {
        // Initialize Map centered around Sector 4 (Guwahati Flood Center default: 26.1445, 91.7362)
        const map = L.map(container, {
          center: [26.1445, 91.7362],
          zoom: 14,
          zoomControl: false,
        });

        // Add 100% Free CartoDB Dark Matter Tile Layer (NO credit card, NO key needed!)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
      markersRef.current = {};

      // 1. Add Incident Markers (Red / Orange Glowing Circles)
      incidents.forEach((inc) => {
        const isCritical = inc.severity === 'CRITICAL';
        const color = isCritical ? '#FF3B30' : '#FFB020';

        const markerHtml = `
          <div style="
            width: 28px;
            height: 28px;
            background: ${color}22;
            border: 2px solid ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px ${color};
            color: white;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
          ">
            🚨
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([inc.location.lat, inc.location.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="color: #000; font-family: monospace;">
              <strong>${inc.id} — ${inc.title}</strong><br/>
              Severity: ${inc.severity}<br/>
              People: ${inc.peopleCount}
            </div>
          `);

        marker.on('click', () => {
          setSelectedIncident(inc);
          fetchOSRMRoute(inc, responders[0]);
        });

        markersRef.current[inc.id] = marker;
      });

      // 2. Add Responder Markers (Green Squad Vans)
      responders.forEach((resp) => {
        const markerHtml = `
          <div style="
            width: 30px;
            height: 30px;
            background: #32D58322;
            border: 2px solid #32D583;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 12px #32D583;
            color: white;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
          ">
            🚑
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([resp.location.lat, resp.location.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="color: #000; font-family: monospace;">
              <strong>${resp.name} (${resp.id})</strong><br/>
              Status: ${resp.status}<br/>
              Personnel: ${resp.personnelCount}
            </div>
          `);

        markersRef.current[resp.id] = marker;
      });
    });
  }, [incidents, responders]);

  // Fetch 100% Free OSRM Turn-by-Turn Emergency Routing Path
  const fetchOSRMRoute = async (incident: Incident, responder: ResponderTeam) => {
    if (!incident || !responder || typeof window === 'undefined') return;

    try {
      const startLng = responder.location.lng;
      const startLat = responder.location.lat;
      const endLng = incident.location.lng;
      const endLat = incident.location.lat;

      // Free OSRM Public Routing API
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMins = Math.ceil(route.duration / 60).toString();

        setActiveRoute({ distanceKm, durationMins });

        // Draw glowing neon cyan route polyline on Leaflet map
        import('leaflet').then((L) => {
          if (polylineRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(polylineRef.current);
          }

          if (mapInstanceRef.current) {
            const polyline = L.polyline(coordinates, {
              color: '#36C5F0',
              weight: 5,
              opacity: 0.8,
              dashArray: '10, 10',
            }).addTo(mapInstanceRef.current);

            polylineRef.current = polyline;
            mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
          }
        });
      }
    } catch (err) {
      console.log('OSRM Routing fallback active:', err);
    }
  };

  // Handle Free OpenStreetMap Address Search
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Free Nominatim OpenStreetMap Geocoder
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.5 });
        }
      }
    } catch (err) {
      console.log('Address Search Error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8.5rem)]">
      {/* Map Main Stage Container */}
      <div className="flex-1 bg-[#050607] border border-[#1D252C] rounded-xl relative overflow-hidden flex flex-col">
        
        {/* Map Header Toolbar & Free Address Search Bar */}
        <div className="p-3 bg-[#0b0e11]/90 backdrop-blur-md border-b border-[#1D252C] z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#4C8DFF]/15 text-[#4C8DFF] border border-[#4C8DFF]/30">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F7F8]">CARTO TACTICAL GIS STAGE (FREE NO-CARD ARCHITECTURE)</h2>
              <p className="text-[11px] font-mono text-[#8f9194]">POSTGIS READY • OSRM REAL ROUTING • OSM GEOCODER</p>
            </div>
          </div>

          {/* Real Address Search Box */}
          <form onSubmit={handleAddressSearch} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search emergency address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0] w-48 sm:w-64 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-[#8f9194] absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-3 py-1.5 rounded-lg bg-[#36C5F0] text-black text-xs font-mono font-bold hover:bg-[#36C5F0]/90 transition-all"
            >
              {isSearching ? 'SEARCHING...' : 'SEARCH'}
            </button>
          </form>
        </div>

        {/* Leaflet Map DOM Container */}
        <div ref={mapContainerRef} className="flex-1 w-full h-full z-10" />

        {/* Live OSRM Route HUD Banner (Bottom Floating) */}
        {activeRoute && selectedIncident && (
          <div className="absolute bottom-4 left-4 z-20 bg-[#0b0e11]/95 backdrop-blur-md border border-[#36C5F0]/40 p-3 rounded-xl shadow-2xl flex items-center gap-4 text-xs font-mono">
            <div className="p-2 rounded-lg bg-[#36C5F0]/15 text-[#36C5F0]">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[#36C5F0] font-bold block">OSRM NEON ROUTE PATH COMPUTED</span>
              <span className="text-white font-bold">{activeRoute.distanceKm} km</span>
              <span className="text-[#8f9194] ml-2">• ETA: {activeRoute.durationMins} mins</span>
            </div>
          </div>
        )}
      </div>

      {/* Incident Inspector Panel */}
      {selectedIncident && (
        <div className="w-full lg:w-80 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col justify-between h-auto lg:h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#36C5F0]" />
                <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                  SELECTED SOS INCIDENT
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-[#36C5F0]">{selectedIncident.id}</span>
                <StatusBadge type="severity" value={selectedIncident.severity} />
              </div>

              <h4 className="text-sm font-bold text-[#F5F7F8] leading-tight">{selectedIncident.title}</h4>

              <div className="p-3 bg-[#121d24] rounded-lg border border-[#1D252C] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#8f9194]">Risk Score:</span>
                  <span className="text-[#FF3B30] font-bold">{selectedIncident.riskScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8f9194]">Headcount:</span>
                  <span className="text-white">{selectedIncident.peopleCount} Victims</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8f9194]">Sector:</span>
                  <span className="text-white">{selectedIncident.location.sector}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1D252C] mt-4">
            {onDispatchUnit && (
              <button
                onClick={() => onDispatchUnit(selectedIncident)}
                className="w-full py-2.5 rounded-lg bg-[#FF3B30] text-white text-xs font-bold hover:bg-[#FF3B30]/90 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,59,48,0.3)]"
              >
                <span>DISPATCH TEAM TO THIS SOS</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
