'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  Radio,
  Mic,
  Volume2,
  Send,
  Wifi,
  PhoneCall,
  Shield,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';

export default function CommunicationsPage() {
  const [activeChannel, setActiveChannel] = useState<'PTT_RADIO' | 'BLE_MESH' | 'BROADCAST'>('PTT_RADIO');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Unit R-17 (Amphibious)', channel: 'PTT RADIO CH-01', time: '15:42:10 UTC', content: 'Base, Unit R-17 has made contact with Priya Sharma on Rooftop 4B. Preparing raft rescue.' },
    { id: 2, sender: 'Gateway G-01 Mesh Relay', channel: 'BLE MESH STREAM', time: '15:40:02 UTC', content: 'Citizen SOS packet synced via BLE node N-07. Heart rate: 108 BPM. Depth: +1.4m.' },
    { id: 3, sender: 'Dispatch Operator OP-402', channel: 'CITIZEN SOS BROADCAST', time: '15:35:00 UTC', content: 'EMERGENCY ALERT BROADCAST TO SECTOR 4: High flood water rising. Move to marked shelters immediately.' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'Command Dispatch (You)',
        channel: activeChannel === 'PTT_RADIO' ? 'PTT RADIO CH-01' : activeChannel === 'BLE_MESH' ? 'BLE MESH STREAM' : 'CITIZEN SOS BROADCAST',
        time: new Date().toLocaleTimeString() + ' UTC',
        content: messageInput
      }
    ]);
    setMessageInput('');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#36C5F0]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Unified Emergency Communications Center</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Centralized Tactical PTT Radio, BLE Mesh relay streams, satellite audio & citizen emergency broadcast center.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full bg-[#36C5F0]/15 border border-[#36C5F0]/30 text-[#36C5F0] font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>PTT CH-01 ACTIVE (156.800 MHz)</span>
            </span>
          </div>
        </div>

        {/* Tactical Push-To-Talk Radio Microphone Simulator */}
        <div className="bg-[#0b0e11] border border-[#36C5F0]/30 rounded-xl p-5 space-y-4 shadow-xl bg-[#36C5F0]/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onMouseDown={() => setIsTransmitting(true)}
                onMouseUp={() => setIsTransmitting(false)}
                className={`px-6 py-4 rounded-xl font-mono font-bold text-xs transition-all shadow-lg flex items-center gap-2 ${
                  isTransmitting
                    ? 'bg-[#FF3B30] text-white shadow-[0_0_20px_rgba(255,59,48,0.5)] animate-pulse'
                    : 'bg-[#36C5F0] text-black hover:bg-[#36C5F0]/90 shadow-[0_0_15px_rgba(54,197,240,0.3)]'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>{isTransmitting ? 'TRANSMITTING VOICE (HOLDING PTT)...' : 'HOLD TO TALK (PTT MIC)'}</span>
              </button>

              <span className="text-xs font-mono text-[#8f9194]">
                {isTransmitting ? 'Voice broadcasting live on PTT CH-01' : 'Ready to transmit on TacRadio CH-01'}
              </span>
            </div>

            {/* Simulated Audio Spectrum Bar */}
            <div className="flex items-center gap-1 h-8 px-4 bg-[#050607] rounded-lg border border-[#1D252C]">
              {[40, 70, 30, 90, 50, 80, 20, 100, 60, 40].map((h, i) => (
                <div
                  key={i}
                  style={{ height: isTransmitting ? `${h}%` : '20%' }}
                  className="w-1 bg-[#36C5F0] rounded-full transition-all duration-150"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Channel Navigation Pills */}
        <div className="flex items-center gap-2 pb-2 border-b border-[#1D252C] font-mono text-xs">
          {[
            { id: 'PTT_RADIO', label: 'Tactical PTT Radio CH-01' },
            { id: 'BLE_MESH', label: 'BLE Mesh Relay Feed' },
            { id: 'BROADCAST', label: 'Citizen SOS Broadcast' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChannel(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChannel === tab.id
                  ? 'bg-[#121d24] text-white border border-[#2c363e] font-bold'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Communications Feed & Message Console */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-lg h-[500px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#36C5F0]" />
              <h3 className="text-sm font-bold text-[#F5F7F8]">UNIFIED TRANSMISSION STREAM</h3>
            </div>
            <span className="text-xs font-mono text-[#32D583]">3 ACTIVE CHANNELS LISTENERS</span>
          </div>

          {/* Stream Logs */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-[#050607] rounded-xl border border-[#1D252C] space-y-1">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#36C5F0]">{msg.sender}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#121d24] text-[10px] text-[#8B7CFF]">{msg.channel}</span>
                    <span className="text-[#8f9194] text-[10px]">{msg.time}</span>
                  </div>
                </div>
                <p className="text-xs font-sans text-white leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* Text Message Transmission Form */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-[#1D252C]">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Transmit text message or broadcast alert..."
              className="flex-1 px-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#36C5F0] text-black font-mono font-bold text-xs hover:bg-[#36C5F0]/90 transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(54,197,240,0.3)]"
            >
              <span>TRANSMIT</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </AppShell>
  );
}
