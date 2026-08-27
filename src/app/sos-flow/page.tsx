'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  AlertTriangle,
  Radio,
  MapPin,
  Heart,
  Shield,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  XCircle,
  Truck,
  MessageSquare,
  Volume2,
  Activity,
  UserCheck
} from 'lucide-react';

export default function SosFlowPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string>('FLOOD_TRAPPED');
  const [userNotes, setUserNotes] = useState<string>('');

  // Handle press and hold SOS timer in Step 1
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (holding && currentStep === 1) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            setCurrentStep(2);
            setHolding(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    } else if (!holding && currentStep === 1) {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [holding, currentStep]);

  // Handle transition from Step 3 (Transmitting) to Step 4 (Active Tracking)
  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        setCurrentStep(4);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />
              <h1 className="text-xl font-bold text-[#F5F7F8] tracking-tight">06 — Emergency SOS & Active Flow</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              4-Step emergency dispatch activation: Hold trigger → Incident triage → BLE Mesh broadcast → Live rescue tracking.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                  currentStep === stepNum
                    ? 'bg-[#FF3B30] text-white shadow-[0_0_10px_rgba(255,59,48,0.5)]'
                    : currentStep > stepNum
                    ? 'bg-[#32D583] text-black'
                    : 'bg-[#121d24] text-[#8f9194] border border-[#1D252C]'
                }`}
              >
                {currentStep > stepNum ? '✓' : stepNum}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: PRESS & HOLD SOS TRIGGER */}
        {currentStep === 1 && (
          <div className="bg-[#0b0e11] border border-[#1D252C] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#FF3B30]/15 border border-[#FF3B30]/30 text-[#FF3B30] font-mono text-xs font-bold inline-block">
                STEP 1 OF 4: EMERGENCY TRIGGER
              </span>
              <h2 className="text-2xl font-bold text-white">Press and Hold to Signal Emergency</h2>
              <p className="text-xs text-[#c5c6ca] max-w-md mx-auto font-sans">
                Holding for 3 seconds sends an instant high-priority alert to LifeLink Command Center and broadcasts your coordinates over the local BLE mesh network.
              </p>
            </div>

            <div className="flex justify-center py-6">
              <button
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onTouchStart={() => setHolding(true)}
                onTouchEnd={() => setHolding(false)}
                className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-[0_0_40px_rgba(255,59,48,0.4)] ${
                  holding
                    ? 'scale-95 bg-[#FF3B30] text-white ring-4 ring-[#FF3B30]/60'
                    : 'bg-[#FF3B30]/20 border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30]/30'
                }`}
              >
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-[#FF3B30]/20"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={552}
                    strokeDashoffset={552 - (552 * holdProgress) / 100}
                    className="text-[#FF3B30] transition-all duration-150"
                  />
                </svg>

                <AlertTriangle className="w-12 h-12 mb-1 animate-pulse" />
                <span className="text-sm font-mono font-bold uppercase tracking-wider">
                  {holding ? `HOLDING ${Math.round(holdProgress)}%` : 'HOLD SOS (3S)'}
                </span>
                <span className="text-[11px] text-[#c5c6ca] mt-0.5 font-mono">RELEASE TO CANCEL</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#1D252C] flex items-center justify-center gap-4 text-xs font-mono text-[#8f9194]">
              <span className="flex items-center gap-1">
                <Radio className="w-4 h-4 text-[#32D583]" />
                BLE Mesh Active
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#36C5F0]" />
                GPS Locked
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: INCIDENT TRIAGE & PROFILE PREVIEW */}
        {currentStep === 2 && (
          <div className="bg-[#0b0e11] border border-[#1D252C] rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1D252C]">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] font-mono text-xs font-bold block w-fit mb-1">
                  STEP 2 OF 4: INCIDENT TRIAGE
                </span>
                <h2 className="text-xl font-bold text-white">Select Emergency Type & Review Profile</h2>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-mono text-[#8f9194] hover:text-white"
              >
                ← Cancel SOS
              </button>
            </div>

            {/* Emergency Category Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#8f9194] uppercase tracking-wider block">
                EMERGENCY CATEGORY:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'FLOOD_TRAPPED', label: 'FLOOD TRAPPED' },
                  { id: 'MEDICAL', label: 'MEDICAL EMERGENCY' },
                  { id: 'FIRE', label: 'FIRE HAZARD' },
                  { id: 'THREAT', label: 'PHYSICAL THREAT' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedEmergencyType(cat.id)}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                      selectedEmergencyType === cat.id
                        ? 'bg-[#FF3B30] text-white border-[#FF3B30] shadow-[0_0_10px_rgba(255,59,48,0.4)]'
                        : 'bg-[#121d24] text-[#c5c6ca] border-[#1D252C] hover:border-[#2c363e]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shared Medical Profile & Location Summary */}
            <div className="p-4 bg-[#050607] rounded-xl border border-[#1D252C] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D252C]">
                <span className="text-[#8f9194] font-bold">AUTOMATICALLY SHARED TELEMETRY DATA:</span>
                <span className="text-[#32D583]">VERIFIED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[#8f9194] block">LOCATION:</span>
                  <span className="text-white font-bold">Sector 4, Rooftop 4B (26.1445° N, 91.7362° E)</span>
                </div>
                <div>
                  <span className="text-[#8f9194] block">CITIZEN PROFILE:</span>
                  <span className="text-white font-bold">Priya Sharma (Age 42)</span>
                </div>
                <div>
                  <span className="text-[#8f9194] block">MEDICAL COND:</span>
                  <span className="text-[#FF3B30] font-bold">Asthma, Suspected Leg Fracture</span>
                </div>
                <div>
                  <span className="text-[#8f9194] block">TRUSTED CONTACTS:</span>
                  <span className="text-[#36C5F0] font-bold">Rahul S., Priya K. (Notified)</span>
                </div>
              </div>
            </div>

            {/* Confirm Transmission Button */}
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full py-3.5 rounded-xl bg-[#FF3B30] text-white font-mono font-bold text-sm hover:bg-[#FF3B30]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,59,48,0.4)]"
            >
              <span>CONFIRM & TRANSMIT EMERGENCY BEACON</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: UPLINK TRANSMISSION IN PROGRESS */}
        {currentStep === 3 && (
          <div className="bg-[#0b0e11] border border-[#36C5F0]/40 rounded-2xl p-10 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#36C5F0]/20 border-2 border-[#36C5F0] flex items-center justify-center text-[#36C5F0] animate-spin">
              <Radio className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#36C5F0]/15 text-[#36C5F0] font-mono text-xs font-bold inline-block">
                STEP 3 OF 4: TRANSMITTING BEACON
              </span>
              <h2 className="text-2xl font-bold text-white">Establishing Secure BLE Mesh Uplink...</h2>
              <p className="text-xs text-[#c5c6ca] max-w-md mx-auto font-mono">
                Broadcasting encrypted SOS packet through Gateway Node G-02 → LifeLink AI Emergency Command Center.
              </p>
            </div>

            <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] max-w-sm mx-auto font-mono text-xs text-[#32D583]">
              ✓ BLE Mesh 3-Hop Relay Connection Established
            </div>
          </div>
        )}

        {/* STEP 4: LIVE SOS RESCUE TRACKING DASHBOARD */}
        {currentStep === 4 && (
          <div className="bg-[#0b0e11] border-2 border-[#32D583]/50 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1D252C]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#32D583] animate-ping" />
                  <span className="text-xs font-mono font-bold text-[#32D583] uppercase">
                    SOS DISPATCH ACTIVE — RESCUE EN ROUTE
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">Incident INC-2048 Live Rescue Tracking</h2>
              </div>

              <button
                onClick={() => {
                  alert('SOS Resolved. Returning to Citizen Safety Dashboard.');
                  setCurrentStep(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#121d24] border border-[#1D252C] text-[#FF3B30] font-mono text-xs font-bold hover:bg-[#FF3B30]/10 transition-all flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                <span>Mark Safe / Cancel SOS</span>
              </button>
            </div>

            {/* Responder Arrival Card */}
            <div className="p-4 bg-[#32D583]/10 border border-[#32D583]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#32D583]/20 border border-[#32D583]/40 flex items-center justify-center text-[#32D583]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-[#8f9194]">DISPATCHED UNIT:</span>
                  <h3 className="text-base font-bold text-white">Unit R-17 (Amphibious Alpha)</h3>
                  <p className="text-xs text-[#32D583]">Commander Capt. V. Rao • 4 Personnel</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#8f9194] block">ESTIMATED ARRIVAL:</span>
                <span className="text-2xl font-bold text-[#32D583] animate-pulse">4 MINUTES</span>
                <span className="text-xs text-[#36C5F0] block">Distance: 1.2 km</span>
              </div>
            </div>

            {/* Real-time Incident Chat Stream */}
            <div className="p-4 bg-[#050607] rounded-xl border border-[#1D252C] space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D252C] font-mono">
                <span className="text-[#36C5F0] font-bold flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  DISPATCH OPERATOR & RESPONDER CHAT
                </span>
                <span className="text-[#32D583] text-[10px]">LIVE CHANNEL</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded bg-[#121d24] border border-[#1D252C]">
                  <span className="font-mono font-bold text-[#36C5F0] block text-[10px]">OPERATOR P. KUMAR (15:21):</span>
                  <p className="text-white mt-0.5">Unit R-17 has been dispatched to Rooftop 4B. Please stay on higher ground.</p>
                </div>
                <div className="p-2.5 rounded bg-[#32D583]/10 border border-[#32D583]/30">
                  <span className="font-mono font-bold text-[#32D583] block text-[10px]">CAPT. V. RAO (15:23):</span>
                  <p className="text-white mt-0.5">Entering Sector 4 channel now. We have thermal visual on rooftop 4B.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
