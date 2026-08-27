'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  AlertOctagon,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  MapPin,
  Battery,
  Phone,
  Users,
  Sparkles,
  Play,
  Heart,
  Flame,
  Waves,
  ShieldAlert,
  ArrowRight,
  Send,
  HelpCircle,
  Smartphone
} from 'lucide-react';

export default function CitizenSafetyDashboardPage() {
  const [holdingSos, setHoldingSos] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [selectedDisasterType, setSelectedDisasterType] = useState<string>('FLOOD');
  
  // AI assistant chat state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChat, setAiChat] = useState([
    {
      sender: 'LIFELINK_AI',
      text: 'Hello Aditi! I am your AI Safety Copilot. Flood warning is currently active in Sector 4. How can I assist your safety preparedness today?'
    }
  ]);

  // Handle press and hold SOS timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (holdingSos && !sosTriggered) {
      interval = setInterval(() => {
        setSosProgress(prev => {
          if (prev >= 100) {
            setSosTriggered(true);
            setHoldingSos(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    } else if (!holdingSos && !sosTriggered) {
      setSosProgress(0);
    }
    return () => clearInterval(interval);
  }, [holdingSos, sosTriggered]);

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    setAiChat(prev => [...prev, { sender: 'USER', text: userText }]);
    setAiPrompt('');

    setTimeout(() => {
      let reply = 'Move to upper floors or rooftop immediately. Keep your phone in Low Power Mode; your device is currently broadcasting location via BLE Mesh to nearby Gateway G-02.';
      if (userText.toLowerCase().includes('shelter')) {
        reply = 'The nearest active shelter is Sector 4 Community High School Shelter (450m East). Capacity is 124/150.';
      } else if (userText.toLowerCase().includes('battery')) {
        reply = 'Disable Wi-Fi & Bluetooth background searching. LIFELINK AI will maintain low-energy BLE mesh beacons automatically.';
      }

      setAiChat(prev => [...prev, { sender: 'LIFELINK_AI', text: reply }]);
    }, 600);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#32D583]" />
              <h1 className="text-xl font-bold text-[#F5F7F8] tracking-tight">04 — Citizen Safety Dashboard</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Personal emergency readiness, 1-touch BLE Mesh SOS beacon, location safety & trusted contact network.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#32D583]/15 border border-[#32D583]/30 text-[#32D583] font-mono text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>PROTECTED • BLE MESH ONLINE</span>
          </div>
        </div>

        {/* Welcome Greeting Banner */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-[#32D583] font-bold uppercase tracking-wider block mb-1">
                STATUS: SECURE & CONNECTED
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Good afternoon, Aditi.
              </h2>
              <p className="text-xs text-[#c5c6ca] mt-1 font-sans">
                You are protected by LIFELINK AI. Sector 4 mesh network is operational with 42 active relay nodes.
              </p>
            </div>

            {/* Hold SOS Button */}
            <div className="flex flex-col items-center">
              <button
                onMouseDown={() => setHoldingSos(true)}
                onMouseUp={() => setHoldingSos(false)}
                onTouchStart={() => setHoldingSos(true)}
                onTouchEnd={() => setHoldingSos(false)}
                className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(255,59,48,0.4)] ${
                  holdingSos 
                    ? 'scale-95 bg-[#FF3B30] text-white ring-4 ring-[#FF3B30]/50' 
                    : 'bg-[#FF3B30]/20 border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30]/30'
                }`}
              >
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="74"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-[#FF3B30]/30"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="74"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={464}
                    strokeDashoffset={464 - (464 * sosProgress) / 100}
                    className="text-[#FF3B30] transition-all duration-150"
                  />
                </svg>

                <AlertTriangle className="w-8 h-8 mb-1 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {holdingSos ? `HOLDING ${Math.round(sosProgress)}%` : 'HOLD SOS (3S)'}
                </span>
                <span className="text-[10px] text-[#c5c6ca] mt-0.5">PRESS & HOLD</span>
              </button>

              {sosTriggered && (
                <div className="mt-3 px-3 py-1 rounded bg-[#FF3B30] text-white font-mono text-xs font-bold animate-bounce">
                  🚨 EMERGENCY SOS BROADCAST SENT!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Emergency Shortcuts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'FLASH FLOOD', icon: Waves, color: 'text-[#36C5F0]', bg: 'bg-[#36C5F0]/10 border-[#36C5F0]/30' },
            { label: 'MEDICAL EMERGENCY', icon: Heart, color: 'text-[#FF3B30]', bg: 'bg-[#FF3B30]/10 border-[#FF3B30]/30' },
            { label: 'FIRE DANGER', icon: Flame, color: 'text-[#FFB020]', bg: 'bg-[#FFB020]/10 border-[#FFB020]/30' },
            { label: 'SECURITY / CRIME', icon: ShieldAlert, color: 'text-[#8B7CFF]', bg: 'bg-[#8B7CFF]/10 border-[#8B7CFF]/30' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setSelectedDisasterType(item.label);
                  setSosTriggered(true);
                }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all text-xs font-mono font-bold ${item.bg}`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-white">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Safety Readiness & Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Location & Battery Status */}
          <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1D252C]">
              <MapPin className="w-4 h-4 text-[#36C5F0]" />
              <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                LOCATION & TELEMETRY STATUS
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">CURRENT SECTOR:</span>
                  <span className="text-[#36C5F0] font-bold">Sector 4 (Rooftop 4B)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">COORDINATES:</span>
                  <span className="text-white">26.1445° N, 91.7362° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">NEAREST SHELTER:</span>
                  <span className="text-[#32D583] font-bold">Sector 4 High School (450m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">DEVICE BATTERY:</span>
                  <span className="text-[#32D583] font-bold">84% (Low Power Mesh Active)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Readiness Checklist */}
          <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1D252C]">
              <CheckCircle2 className="w-4 h-4 text-[#32D583]" />
              <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                SAFETY READINESS CHECKLIST
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { name: 'Emergency Contacts (2 Verified)', status: 'VERIFIED' },
                { name: 'Location Precision Access', status: 'ACTIVE' },
                { name: 'BLE Mesh Relay Signal', status: 'STRONG (3 HOPS)' },
                { name: 'Offline Safety Pack Downloaded', status: 'READY' },
              ].map((check, idx) => (
                <div key={idx} className="p-2.5 bg-[#121d24] rounded-lg border border-[#1D252C] flex items-center justify-between">
                  <span className="text-white">{check.name}</span>
                  <span className="px-2 py-0.5 rounded bg-[#32D583]/15 text-[#32D583] font-bold text-[10px]">
                    ✓ {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Trusted Contacts Network */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8B7CFF]" />
              <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
                TRUSTED FAMILY SAFETY NETWORK
              </h3>
            </div>
            <button className="text-xs font-mono text-[#36C5F0] hover:underline">
              + Add Contact
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#121d24] rounded-lg border border-[#1D252C] flex items-center justify-between">
              <div>
                <span className="text-white font-bold block">Rahul S. (Brother)</span>
                <span className="text-[#8f9194]">+91-98765-43210</span>
              </div>
              <button className="px-2.5 py-1 rounded bg-[#32D583]/15 text-[#32D583] hover:bg-[#32D583]/20 font-bold text-[11px]">
                PING SMS
              </button>
            </div>

            <div className="p-3 bg-[#121d24] rounded-lg border border-[#1D252C] flex items-center justify-between">
              <div>
                <span className="text-white font-bold block">Priya K. (Mother)</span>
                <span className="text-[#8f9194]">+91-98765-43211</span>
              </div>
              <button className="px-2.5 py-1 rounded bg-[#32D583]/15 text-[#32D583] hover:bg-[#32D583]/20 font-bold text-[11px]">
                PING SMS
              </button>
            </div>
          </div>
        </div>

        {/* LIFELINK AI Citizen Emergency Assistant */}
        <div className="bg-[#0b0e11] border border-[#8B7CFF]/30 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 pb-2 border-b border-[#8B7CFF]/20">
            <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
            <h3 className="text-xs font-mono font-bold text-[#F5F7F8] uppercase tracking-wider">
              LIFELINK AI SAFETY ASSISTANT
            </h3>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {aiChat.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-xs font-sans ${
                  msg.sender === 'USER'
                    ? 'bg-[#36C5F0]/10 border border-[#36C5F0]/30 ml-8 text-white'
                    : 'bg-[#8B7CFF]/10 border border-[#8B7CFF]/30 mr-8 text-[#c5c6ca]'
                }`}
              >
                <span className="font-mono text-[10px] font-bold text-[#8B7CFF] block mb-0.5">
                  {msg.sender === 'USER' ? 'YOU' : 'LIFELINK AI'}
                </span>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleAskAi} className="flex items-center gap-2 pt-2 border-t border-[#1D252C]">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask LIFELINK AI about emergency flood procedures..."
              className="flex-1 px-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#8B7CFF]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#8B7CFF] text-white font-bold text-xs hover:bg-[#8B7CFF]/90 transition-all font-mono"
            >
              ASK
            </button>
          </form>
        </div>

      </div>
    </AppShell>
  );
}
