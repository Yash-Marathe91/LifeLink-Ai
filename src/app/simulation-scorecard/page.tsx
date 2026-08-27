'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  Award,
  CheckCircle2,
  TrendingUp,
  Shield,
  Download,
  Sparkles,
  Zap,
  BarChart2
} from 'lucide-react';

export default function SimulationScorecardPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-[#0b0e11] border border-[#32D583]/40 rounded-xl p-6 text-center space-y-3 shadow-2xl bg-[#32D583]/5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#32D583]/20 border border-[#32D583] text-[#32D583] font-mono text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>EXERCISE EVALUATION COMPLETE</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white font-mono">SIMULATION SCORE: GRADE A (96.4 / 100)</h1>
          <p className="text-xs text-[#c5c6ca] font-sans max-w-xl mx-auto">
            Monsoon Flood Disaster Drill 2026-B successfully evaluated. The system demonstrated 98.4% off-grid mesh resilience and zero victim packet drop.
          </p>
        </div>

        {/* Detailed Category Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-[#0b0e11] border border-[#1D252C] rounded-xl space-y-1">
            <span className="text-[#8f9194] block">DISPATCH SPEED:</span>
            <div className="text-xl font-bold text-[#32D583]">98 / 100</div>
            <span className="text-[11px] text-[#8f9194]">Avg dispatch time 2.8 mins</span>
          </div>

          <div className="p-4 bg-[#0b0e11] border border-[#1D252C] rounded-xl space-y-1">
            <span className="text-[#8f9194] block">BLE MESH RESILIENCE:</span>
            <div className="text-xl font-bold text-[#36C5F0]">95 / 100</div>
            <span className="text-[11px] text-[#8f9194]">42 nodes auto-healed grid drop</span>
          </div>

          <div className="p-4 bg-[#0b0e11] border border-[#1D252C] rounded-xl space-y-1">
            <span className="text-[#8f9194] block">RESOURCE EFFICIENCY:</span>
            <div className="text-xl font-bold text-[#8B7CFF]">96 / 100</div>
            <span className="text-[11px] text-[#8f9194]">Zero amphibious raft collisions</span>
          </div>
        </div>

        {/* AI After-Action Review (AAR) */}
        <div className="bg-[#0b0e11] border border-[#8B7CFF]/30 rounded-xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B7CFF]" />
            <h3 className="text-base font-bold text-white font-mono">GEMINI 3.1 PRO AFTER-ACTION RECOMMENDATIONS</h3>
          </div>

          <div className="space-y-2 text-xs font-sans text-[#c5c6ca] leading-relaxed">
            <p>1. Deploy 2 additional solar-recharged BLE mesh nodes along Sector 4 Waterway B to improve signal depth.</p>
            <p>2. Pre-stage Amphibious Raft Unit R-19 near SevenHills Hospital for faster victim transfers.</p>
          </div>
        </div>

        {/* Download Scorecard Action */}
        <button
          onClick={() => alert('Downloading official signed drill evaluation report...')}
          className="w-full py-3.5 rounded-xl bg-[#32D583] text-black font-mono font-bold text-xs hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(50,213,131,0.3)] min-h-[48px]"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD CERTIFIED DRILL SCORECARD PDF</span>
        </button>

      </div>
    </AppShell>
  );
}
