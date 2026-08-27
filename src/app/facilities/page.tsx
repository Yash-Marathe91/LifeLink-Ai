'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  Building2,
  Hospital,
  Shield,
  Heart,
  Zap,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Phone,
  Search,
  Filter,
  Users,
  Bed,
  Sparkles,
  ArrowUpRight,
  Plus
} from 'lucide-react';

export default function EmergencyFacilitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'HOSPITAL' | 'SHELTER' | 'FIRE_HUB'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('FAC-01');

  const facilities = [
    {
      id: 'FAC-01',
      name: 'SevenHills Trauma Hospital',
      category: 'HOSPITAL',
      sector: 'Sector 4 East',
      status: 'OPERATIONAL',
      distance: '2.4 km',
      icuBedsAvailable: 12,
      icuBedsTotal: 40,
      oxygenSupply: '88%',
      powerGrid: 'MAINS GRID + GENERATOR (100%)',
      capabilities: ['Level 1 Trauma', 'Orthopedic Surgery', 'Burn Unit', 'Helipad'],
      phone: '+91-22-6789-0001'
    },
    {
      id: 'FAC-02',
      name: 'City Central Emergency Hospital',
      category: 'HOSPITAL',
      sector: 'Sector 2 Central',
      status: 'HIGH_LOAD',
      distance: '4.8 km',
      icuBedsAvailable: 4,
      icuBedsTotal: 50,
      oxygenSupply: '64%',
      powerGrid: 'MAINS GRID (100%)',
      capabilities: ['General ICU', 'Pediatric Care', 'Blood Bank'],
      phone: '+91-22-6789-0002'
    },
    {
      id: 'FAC-03',
      name: 'Sector 4 High School Relief Shelter',
      category: 'SHELTER',
      sector: 'Sector 4 West',
      status: 'OPERATIONAL',
      distance: '450 m',
      capacityOccupied: 124,
      capacityTotal: 150,
      waterSupply: '2,400 Liters',
      powerGrid: 'SOLAR + BATTERY (82%)',
      capabilities: ['Food Rationing', 'Dry Rooftop', 'Basic First Aid', 'BLE Mesh Relay'],
      phone: '+91-22-6789-0003'
    },
    {
      id: 'FAC-04',
      name: 'Fire & Rescue Station 09 Hub',
      category: 'FIRE_HUB',
      sector: 'Sector 4 North',
      status: 'OPERATIONAL',
      distance: '1.8 km',
      raftsAvailable: 4,
      raftsTotal: 6,
      powerGrid: 'GENERATOR BACKUP (94%)',
      capabilities: ['Amphibious Rafts', 'Heavy Lifting Gear', 'Water Rescue Crew'],
      phone: '+91-22-6789-0004'
    }
  ];

  const filteredFacilities = facilities.filter(fac => {
    const matchesCat = selectedCategory === 'ALL' || fac.category === selectedCategory;
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const currentFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#32D583]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">09 — Emergency Facilities & Resource Intelligence</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Real-time monitoring of hospital ICU bed capacities, evacuation shelter supplies, fire hubs & resource routing.
            </p>
          </div>

          <button
            onClick={() => alert('Facility Dispatch Request initiated.')}
            className="px-3.5 py-1.5 rounded-lg bg-[#32D583] text-black font-bold text-xs hover:bg-[#32D583]/90 transition-all flex items-center gap-1 font-mono shadow-[0_0_12px_rgba(50,213,131,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>DISPATCH RESOURCE TO FACILITY</span>
          </button>
        </div>

        {/* AI Optimal Matching Box for Active Incidents */}
        <div className="bg-[#0b0e11] border border-[#8B7CFF]/30 rounded-xl p-4 space-y-2 shadow-lg bg-[#8B7CFF]/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
            <span className="text-xs font-mono font-bold text-[#8B7CFF] uppercase tracking-wider">
              AI MATCHING RECOMMENDATION FOR INC-2048
            </span>
          </div>
          <p className="text-xs font-sans text-white leading-relaxed">
            Route patient <strong>Priya Sharma</strong> (Hypothermia + Suspected Leg Fracture) to <strong>SevenHills Trauma Hospital</strong> (2.4km East). 12 ICU beds available; Level 1 Orthopedic Surgery team on standby.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Facilities (4)' },
              { id: 'HOSPITAL', label: 'Hospitals & ICUs (2)' },
              { id: 'SHELTER', label: 'Relief Shelters (1)' },
              { id: 'FIRE_HUB', label: 'Fire & Rescue Hubs (1)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#121d24] text-white border border-[#2c363e] font-bold'
                    : 'text-[#8f9194] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8f9194]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facilities..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0]"
            />
          </div>
        </div>

        {/* 2-Column Grid: Directory Cards (Left 7 Cols) & Selected Facility Inspector (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Facilities List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                onClick={() => setSelectedFacilityId(fac.id)}
                className={`bg-[#0b0e11] border rounded-xl p-5 space-y-3 cursor-pointer transition-all shadow-lg ${
                  selectedFacilityId === fac.id
                    ? 'border-[#32D583] bg-[#32D583]/5 ring-1 ring-[#32D583]/40'
                    : 'border-[#1D252C] hover:border-[#2c363e]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#32D583]">{fac.id}</span>
                    <h3 className="text-base font-bold text-white">{fac.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    fac.status === 'OPERATIONAL' ? 'bg-[#32D583]/20 text-[#32D583]' : 'bg-[#FFB020]/20 text-[#FFB020]'
                  }`}>
                    {fac.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[#8f9194] block">SECTOR:</span>
                    <span className="text-white font-bold">{fac.sector}</span>
                  </div>
                  <div>
                    <span className="text-[#8f9194] block">DISTANCE:</span>
                    <span className="text-[#36C5F0] font-bold">{fac.distance}</span>
                  </div>
                  <div>
                    <span className="text-[#8f9194] block">RESOURCE METRIC:</span>
                    <span className="text-[#32D583] font-bold">
                      {fac.icuBedsAvailable !== undefined ? `${fac.icuBedsAvailable}/${fac.icuBedsTotal} ICU Beds` : 
                       fac.capacityOccupied !== undefined ? `${fac.capacityOccupied}/${fac.capacityTotal} Capacity` :
                       `${fac.raftsAvailable}/${fac.raftsTotal} Rafts`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {fac.capabilities.map((cap, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#121d24] border border-[#1D252C] text-[11px] font-mono text-[#c5c6ca]">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Facility Telemetry Inspector (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div>
                <span className="text-xs font-mono text-[#32D583] font-bold">{currentFacility.id} INSPECTOR</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{currentFacility.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#32D583]/20 text-[#32D583] text-xs font-mono font-bold">
                {currentFacility.status}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">SECTOR LOCATION:</span>
                  <span className="text-white font-bold">{currentFacility.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">POWER GRID STATUS:</span>
                  <span className="text-[#32D583] font-bold">{currentFacility.powerGrid}</span>
                </div>
                {currentFacility.oxygenSupply && (
                  <div className="flex justify-between">
                    <span className="text-[#8f9194]">OXYGEN RESERVES:</span>
                    <span className="text-[#36C5F0] font-bold">{currentFacility.oxygenSupply}</span>
                  </div>
                )}
                {currentFacility.waterSupply && (
                  <div className="flex justify-between">
                    <span className="text-[#8f9194]">CLEAN WATER:</span>
                    <span className="text-[#36C5F0] font-bold">{currentFacility.waterSupply}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">DIRECT DISPATCH TEL:</span>
                  <span className="text-[#4C8DFF] font-bold">{currentFacility.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-[#8f9194] block mb-1">CAPABILITIES & EQUIPMENT:</span>
                <div className="space-y-1">
                  {currentFacility.capabilities.map((cap, idx) => (
                    <div key={idx} className="p-2 bg-[#121d24] rounded border border-[#1D252C] flex items-center justify-between">
                      <span className="text-white font-sans text-xs">{cap}</span>
                      <span className="text-[#32D583] font-mono text-[10px]">AVAILABLE</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => alert(`Direct dispatch call initiated to ${currentFacility.name} at ${currentFacility.phone}`)}
                className="w-full py-3 rounded-lg bg-[#32D583] text-black font-mono font-bold text-xs hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(50,213,131,0.3)]"
              >
                <Phone className="w-4 h-4" />
                <span>CALL FACILITY DISPATCH DESK</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
