'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Incident, ResponderTeam, NetworkRelayNode } from '@/lib/types';
import { Search, Navigation, Compass, Crosshair, Layers, MapPin } from 'lucide-react';
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
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const polylineRef = useRef<any>(null);

  const [mapMode, setMapMode] = useState<'CARTO_DARK' | 'GOOGLE_SATELLITE' | 'MAPBOX_DARK'>('CARTO_DARK');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [geocodedAddress, setGeocodedAddress] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<{ distanceKm: string; durationMins: string } | null>(null);

  // Switch Tile Server Layer
  const changeTileServer = (mode: 'CARTO_DARK' | 'GOOGLE_SATELLITE' | 'MAPBOX_DARK') => {
    setMapMode(mode);
    if (!mapInstanceRef.current || typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      let newTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      let subdomains = 'abcd';
      let attribution = '&copy; CARTO &copy; OSM';

      if (mode === 'GOOGLE_SATELLITE') {
        newTileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        subdomains = '';
        attribution = '&copy; Google Maps';
      } else if (mode === 'MAPBOX_DARK') {
        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
        if (mapboxToken) {
          newTileUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;
          subdomains = '';
          attribution = '&copy; Mapbox &copy; OpenStreetMap';
        }
      }

      const newTileLayer = L.tileLayer(newTileUrl, {
        attribution: attribution,
        subdomains: subdomains,
        maxZoom: 20,
        tileSize: mode === 'MAPBOX_DARK' ? 512 : 256,
        zoomOffset: mode === 'MAPBOX_DARK' ? -1 : 0,
      }).addTo(map);

      tileLayerRef.current = newTileLayer;
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const container = mapContainerRef.current;
      if (!container) return;

      if (!mapInstanceRef.current) {
        const map = L.map(container, {
          center: [26.1445, 91.7362],
          zoom: 14,
          zoomControl: false,
        });

        const initialTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CARTO &copy; OSM',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        tileLayerRef.current = initialTileLayer;
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
      markersRef.current = {};

      // 1. Add Incident Markers
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

      // 2. Add Responder Markers
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

  // Fetch OSRM Routing Path
  const fetchOSRMRoute = async (incident: Incident, responder: ResponderTeam) => {
    if (!incident || !responder || typeof window === 'undefined') return;

    try {
      const startLng = responder.location.lng;
      const startLat = responder.location.lat;
      const endLng = incident.location.lng;
      const endLat = incident.location.lat;

      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMins = Math.ceil(route.duration / 60).toString();

        setActiveRoute({ distanceKm, durationMins });

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
      console.log('OSRM Routing fallback:', err);
    }
  };

  // High Precision OpenCage Geocoding Engine
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setGeocodedAddress(null);

    const openCageKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '93b4ed5c6a9c41a79f2fbf83c5b04a93';

    try {
      const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${openCageKey}&limit=1`);
      const data = await res.json();

      if (data && data.results && data.results.length > 0) {
        const result = data.results[0];
        const lat = result.geometry.lat;
        const lng = result.geometry.lng;
        const formatted = result.formatted;

        setGeocodedAddress(formatted);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.5 });
        }
      } else {
        const fallbackRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const fallbackData = await fallbackRes.json();

        if (fallbackData && fallbackData.length > 0) {
          const lat = parseFloat(fallbackData[0].lat);
          const lng = parseFloat(fallbackData[0].lon);
          setGeocodedAddress(fallbackData[0].display_name);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.5 });
          }
        }
      }
    } catch (err) {
      console.log('OpenCage Geocoding Error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8.5rem)]">
      {/* Map Main Stage Container */}
      <div className="flex-1 bg-[#050607] border border-[#1D252C] rounded-xl relative overflow-hidden flex flex-col">
        
        {/* Map Header Toolbar */}
        <div className="p-3 bg-[#0b0e11]/90 backdrop-blur-md border-b border-[#1D252C] z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#4C8DFF]/15 text-[#4C8DFF] border border-[#4C8DFF]/30">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F7F8]">LIFELINK GOOGLE / MAPBOX & OPENCAGE GIS STAGE</h2>
              <p className="text-[11px] font-mono text-[#8f9194]">OPENCAGE GEOCODER • GOOGLE SATELLITE • MAPBOX READY • OSRM ROUTING</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tile Layer Selector */}
            <div className="flex items-center gap-1 bg-[#050607] p-1 rounded-lg border border-[#1D252C] text-xs font-mono">
              <button
                onClick={() => changeTileServer('CARTO_DARK')}
                className={`px-2 py-0.5 rounded transition-all ${
                  mapMode === 'CARTO_DARK' ? 'bg-[#36C5F0] text-black font-bold' : 'text-[#8f9194] hover:text-white'
                }`}
              >
                🌙 CARTO DARK
              </button>
              <button
                onClick={() => changeTileServer('GOOGLE_SATELLITE')}
                className={`px-2 py-0.5 rounded transition-all ${
                  mapMode === 'GOOGLE_SATELLITE' ? 'bg-[#32D583] text-black font-bold' : 'text-[#8f9194] hover:text-white'
                }`}
              >
                🛰️ GOOGLE SATELLITE
              </button>
              <button
                onClick={() => changeTileServer('MAPBOX_DARK')}
                className={`px-2 py-0.5 rounded transition-all ${
                  mapMode === 'MAPBOX_DARK' ? 'bg-[#8B7CFF] text-black font-bold' : 'text-[#8f9194] hover:text-white'
                }`}
              >
                🗺️ MAPBOX DARK
              </button>
            </div>

            {/* Address Search */}
            <form onSubmit={handleAddressSearch} className="flex items-center gap-1.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-2 py-1 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0] w-36 sm:w-48 font-mono"
                />
                <Search className="w-3 h-3 text-[#8f9194] absolute left-2 top-2" />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-2.5 py-1 rounded-lg bg-[#36C5F0] text-black text-xs font-mono font-bold hover:bg-[#36C5F0]/90 transition-all"
              >
                {isSearching ? 'FINDING...' : 'GEOCODE'}
              </button>
            </form>
          </div>
        </div>

        {/* Leaflet DOM Container */}
        <div ref={mapContainerRef} className="flex-1 w-full h-full z-10" />

        {/* OpenCage Formatted Address Result Pill */}
        {geocodedAddress && (
          <div className="absolute top-16 left-4 z-20 bg-[#0b0e11]/95 border border-[#32D583]/50 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 max-w-lg">
            <MapPin className="w-4 h-4 text-[#32D583] shrink-0" />
            <span className="text-[#32D583] font-bold">OPENCAGE:</span>
            <span className="text-white truncate">{geocodedAddress}</span>
          </div>
        )}

        {/* Route HUD Banner */}
        {activeRoute && selectedIncident && (
          <div className="absolute bottom-4 left-4 z-20 bg-[#0b0e11]/95 backdrop-blur-md border border-[#36C5F0]/40 p-3 rounded-xl shadow-2xl flex items-center gap-4 text-xs font-mono">
            <div className="p-2 rounded-lg bg-[#36C5F0]/15 text-[#36C5F0]">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[#36C5F0] font-bold block">TACTICAL GIS / OSRM NEON ROUTE PATH</span>
              <span className="text-white font-bold">{activeRoute.distanceKm} km</span>
              <span className="text-[#8f9194] ml-2">• ETA: {activeRoute.durationMins} mins</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Incident Panel */}
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
