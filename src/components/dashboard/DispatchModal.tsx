'use client';

import React, { useState } from 'react';
import { Incident, ResponderTeam } from '@/lib/types';
import { X, Truck, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, BrainCircuit } from 'lucide-react';

interface DispatchModalProps {
  incident: Incident | null;
  responders: ResponderTeam[];
  onClose: () => void;
  onConfirmDispatch: (incidentId: string, responderId: string, responderName: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  incident,
  responders,
  onClose,
  onConfirmDispatch
}) => {
  const [selectedResponderId, setSelectedResponderId] = useState<string>('R-23');

  if (!incident) return null;

  const availableResponders = responders;
  const selectedResponder = responders.find(r => r.id === selectedResponderId) || responders[0];

  const handleDispatch = () => {
    if (selectedResponder) {
      onConfirmDispatch(incident.id, selectedResponder.id, selectedResponder.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#1D252C] flex items-center justify-between bg-[#121d24]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FF3B30]" />
            <h3 className="text-base font-bold text-[#F5F7F8]">Responder Team Dispatch</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8f9194] hover:text-white hover:bg-[#1D252C] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Incident Meta */}
        <div className="p-4 border-b border-[#1D252C] bg-[#050607]/80">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#36C5F0] font-bold">{incident.id}</span>
            <span className="text-[#FF3B30] font-bold">RISK SCORE: {incident.riskScore}/100</span>
          </div>
          <h4 className="text-sm font-bold text-[#F5F7F8]">{incident.title}</h4>
          <p className="text-xs text-[#8f9194] mt-1 font-mono">
            {incident.location.address} ({incident.peopleCount} Citizens Affected)
          </p>
        </div>

        {/* Unit Selector */}
        <div className="p-4 space-y-3">
          <label className="text-xs font-mono text-[#8f9194] uppercase tracking-wider block">
            Select Rescue Unit for Deployment:
          </label>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {availableResponders.map((responder) => {
              const isSelected = responder.id === selectedResponderId;
              return (
                <div
                  key={responder.id}
                  onClick={() => setSelectedResponderId(responder.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#36C5F0]/10 border-[#36C5F0] text-[#F5F7F8]'
                      : 'bg-[#121d24] border-[#1D252C] text-[#c5c6ca] hover:border-[#2c363e]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className={`w-4 h-4 ${isSelected ? 'text-[#36C5F0]' : 'text-[#8f9194]'}`} />
                      <span className="font-mono text-xs font-bold">{responder.id}</span>
                      <span className="text-xs font-bold">{responder.name}</span>
                    </div>
                    <span className="text-xs font-mono text-[#32D583]">
                      ETA: {responder.etaMinutes > 0 ? `${responder.etaMinutes}m` : 'Immediate'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1D252C] text-[11px] font-mono text-[#8f9194]">
                    <span>Equipment: {responder.equipment.join(', ')}</span>
                    <span>{responder.personnelCount} Crew</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Recommendation Note */}
          <div className="p-3 rounded-lg bg-[#8B7CFF]/10 border border-[#8B7CFF]/20 text-xs text-[#c5c6ca] flex items-start gap-2">
            <BrainCircuit className="w-4 h-4 text-[#8B7CFF] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#8B7CFF] font-mono block mb-0.5">AI DISPATCH ADVISORY</span>
              Based on spatial proximity, equipment profile, and risk level, Unit {selectedResponder?.name} is the optimal choice for immediate dispatch.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1D252C] flex items-center justify-end gap-3 bg-[#050607]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#121d24] border border-[#1D252C] text-xs text-[#c5c6ca] hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDispatch}
            className="px-4 py-2 rounded-lg bg-[#FF3B30] text-white text-xs font-bold hover:bg-[#FF3B30]/90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,59,48,0.4)]"
          >
            <span>CONFIRM DISPATCH UNIT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
