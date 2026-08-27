'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  FileText,
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  Share2,
  Sliders,
  Zap,
  TrendingUp,
  Clock,
  Printer
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string>('REP-901');

  const reports = [
    {
      id: 'REP-901',
      title: 'Monsoon 2026 Executive Disaster Briefing',
      type: 'AI_SYNTHESIS',
      date: '2026-08-27',
      author: 'Gemini 3.1 Pro Correlation Engine',
      summary: 'Comprehensive analysis of 1,482 citizen evacuations across Sector 4. Zero packet loss achieved over BLE Mesh network.',
      status: 'FINAL'
    },
    {
      id: 'REP-898',
      title: 'BLE Mesh Node Uptime & Power Depletion SLA',
      type: 'INFRASTRUCTURE',
      date: '2026-08-26',
      author: 'Network Operations Desk',
      summary: 'Audit of 42 deployed BLE nodes. Recommends replacing battery pack on Relay N-09.',
      status: 'APPROVED'
    },
    {
      id: 'REP-894',
      title: 'SevenHills & City Central ICU Capacity Forecast',
      type: 'MEDICAL',
      date: '2026-08-25',
      author: 'Medical Command Desk',
      summary: 'Bed availability forecast for incoming flood casualties.',
      status: 'APPROVED'
    }
  ];

  const currentReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handleGenerateReport = () => {
    alert('AI synthesis generating new operational report in background...');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8B7CFF]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Reports & AI Briefing Center</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Automated executive incident summaries, infrastructure SLA audits & downloadable PDF briefing packages.
            </p>
          </div>

          <button
            onClick={handleGenerateReport}
            className="px-3.5 py-1.5 rounded-lg bg-[#8B7CFF] text-white font-bold text-xs hover:bg-[#8B7CFF]/90 transition-all flex items-center gap-1.5 font-mono shadow-[0_0_12px_rgba(139,124,255,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GENERATE AI BRIEFING REPORT</span>
          </button>
        </div>

        {/* AI Synthesis Summary Box */}
        <div className="bg-[#0b0e11] border border-[#8B7CFF]/30 rounded-xl p-5 space-y-2 shadow-xl bg-[#8B7CFF]/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
            <span className="text-xs font-mono font-bold text-[#8B7CFF] uppercase tracking-wider">
              GEMINI 3.1 PRO EXECUTIVE SYNTHESIS SUMMARY
            </span>
          </div>
          <p className="text-sm font-sans font-semibold text-white leading-relaxed">
            During Monsoon Event #4, 1,482 citizens were successfully rescued with an average dispatch time of 4.2 minutes (-38% faster than traditional emergency networks). BLE Mesh relay uptime maintained 98.4% continuity during grid power outage.
          </p>
        </div>

        {/* 2-Column Grid: Report List (7 Cols) & Report Reader (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Report List (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`p-4 rounded-xl border space-y-2 cursor-pointer transition-all shadow-lg ${
                  selectedReportId === rep.id
                    ? 'bg-[#8B7CFF]/10 border-[#8B7CFF] shadow-[0_0_10px_rgba(139,124,255,0.2)]'
                    : 'bg-[#0b0e11] border-[#1D252C] hover:border-[#2c363e]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#8B7CFF]">{rep.id}</span>
                    <span className="px-2 py-0.5 rounded bg-[#121d24] text-white font-bold">
                      {rep.type}
                    </span>
                  </div>
                  <span className="text-[#8f9194] text-[11px]">{rep.date}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{rep.title}</h3>
                <p className="text-xs font-sans text-[#8f9194]">{rep.summary}</p>
              </div>
            ))}
          </div>

          {/* Report Document Reader (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
              <div>
                <span className="text-xs font-mono text-[#8B7CFF] font-bold">{currentReport.id} PREVIEW</span>
                <h3 className="text-base font-bold text-white mt-0.5">{currentReport.title}</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#32D583]/20 text-[#32D583] text-xs font-mono font-bold">
                {currentReport.status}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">AUTHOR:</span>
                  <span className="text-white font-bold">{currentReport.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8f9194]">DATE GENERATED:</span>
                  <span className="text-[#36C5F0] font-bold">{currentReport.date}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#8f9194] block mb-1">EXECUTIVE ABSTRACT:</span>
                <p className="p-3 bg-[#121d24] rounded border border-[#1D252C] text-xs font-sans text-[#c5c6ca] leading-relaxed">
                  {currentReport.summary}
                </p>
              </div>

              <button
                onClick={() => alert(`Downloading PDF report for ${currentReport.id}...`)}
                className="w-full py-2.5 rounded-lg bg-[#8B7CFF] text-white font-mono font-bold text-xs hover:bg-[#8B7CFF]/90 transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(139,124,255,0.3)]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD COMPLETE PDF REPORT</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
