'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Zap,
  Layers,
  Activity,
  ArrowRight,
  Send,
  HelpCircle,
  Filter,
  Shield,
  Clock,
  Radio,
  BarChart2,
  ChevronRight,
  RefreshCw,
  Maximize2
} from 'lucide-react';

export default function AiIntelligencePage() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'REVIEW' | 'OPTIMIZATIONS'>('ALL');
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotChat, setCopilotChat] = useState([
    {
      sender: 'COPILOT',
      title: 'Global Situation Synthesis',
      content: 'Elevated anomaly detection in Sector 4 network topology. Correlated with 3 priority resource degradation signals. AI confidence 94.2% for cascading failure event if unmitigated within 15 minutes.'
    }
  ]);

  const decisionCards = [
    {
      id: 'DEC-401',
      title: 'Cascading Resource Failure Predicted in Sector 4',
      type: 'CRITICAL',
      confidence: 94.2,
      impactScore: 'HIGH (94/100)',
      timeWindow: '15 Mins',
      summary: 'AI correlation engine detects 3 synchronous node degradation events in Sector 4. High probability of complete mesh node isolation.',
      recommendation: 'Reallocate Unit R-17 (Amphibious Raft) and deploy Mobile BLE Relay Drone M-02 to maintain communication bridge.',
      supportingSignals: ['Telemetry drop on Relay G-02', 'Accelerated inundation depth +1.4m', 'Victim density surge on Rooftop 4B'],
      status: 'NEEDS_REVIEW'
    },
    {
      id: 'DEC-402',
      title: 'Trauma Facility Route Optimization (SevenHills Hospital)',
      type: 'OPTIMIZATION',
      confidence: 91.8,
      impactScore: 'MEDIUM (68/100)',
      timeWindow: 'Immediate',
      summary: 'Main Sector 4 road bridge blocked by debris. Dynamic spatial routing recalculates alternate canal access.',
      recommendation: 'Reroute Unit R-17 via Canal Route B. Saves 8.5 minutes in transport time to SevenHills ICU.',
      supportingSignals: ['Traffic sensor blockage at Bridge 4A', 'Water velocity within safe raft limits on Canal B'],
      status: 'RECOMMENDED'
    },
    {
      id: 'DEC-403',
      title: 'BLE Mesh Relay Battery Preservation Protocol',
      type: 'OPTIMIZATION',
      confidence: 98.4,
      impactScore: 'LOW (42/100)',
      timeWindow: 'Next 2 Hours',
      summary: 'Nodes G-08 through G-12 running at 34% average battery under heavy packet traffic.',
      recommendation: 'Reduce beacon ping frequency by 20% on secondary channels to extend mesh lifespan by +14 hours.',
      supportingSignals: ['Battery depletion rate 4.2%/hr', 'Low packet loss risk on primary telemetry channels'],
      status: 'RECOMMENDED'
    }
  ];

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;

    const q = copilotQuery;
    setCopilotQuery('');
    setCopilotChat(prev => [...prev, { sender: 'USER', title: 'Operator Query', content: q }]);

    setTimeout(() => {
      let aiAns = 'Analyzing historical disaster patterns (Arch-44) cross-referenced with live sensor streams. Sector 4 bridge collapse risk is calculated at 78%. Recommend deploying amphibious units immediately.';
      if (q.toLowerCase().includes('shelter')) {
        aiAns = 'Sector 4 Shelter capacity is at 82%. Sector 2 Shelter has 140 vacant beds with direct dry road access.';
      } else if (q.toLowerCase().includes('battery')) {
        aiAns = 'Activating BLE low-power beaconing protocol on nodes G-01 through G-20 will preserve 18 hours of continuous operation.';
      }

      setCopilotChat(prev => [...prev, { sender: 'COPILOT', title: 'AI Synthesis & Recommendation', content: aiAns }]);
    }, 700);
  };

  const filteredCards = decisionCards.filter(card => {
    if (activeFilter === 'CRITICAL') return card.type === 'CRITICAL';
    if (activeFilter === 'REVIEW') return card.status === 'NEEDS_REVIEW';
    if (activeFilter === 'OPTIMIZATIONS') return card.type === 'OPTIMIZATION';
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Title Header Bar */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#8B7CFF]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">07 — AI Intelligence & Copilot Workspace</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Multi-agent anomaly correlation, disaster scenario predictive modeling & real-time decision recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 text-[#8B7CFF] font-mono text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>GEMINI 3.1 PRO CORRELATION ENGINE (ONLINE)</span>
            </span>
          </div>
        </div>

        {/* Global Situation Brief Summary Banner */}
        <div className="bg-[#0b0e11] border border-[#8B7CFF]/30 rounded-xl p-5 relative overflow-hidden shadow-xl bg-[#8B7CFF]/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
                <span className="text-xs font-mono font-bold text-[#8B7CFF] uppercase tracking-wider">
                  GLOBAL SYNTHESIS BRIEF
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FF3B30]/20 text-[#FF3B30] font-mono text-[10px] font-bold">
                  HIGH ANOMALY DETECTED
                </span>
              </div>
              <p className="text-sm font-sans font-semibold text-white">
                Elevated anomaly correlation detected in Sector 4 network topology. AI confidence is 94.2% for cascading relay failure if unmitigated within 15 minutes.
              </p>
            </div>

            <button
              onClick={() => alert('Executing AI automated load balancing on Sector 4 nodes...')}
              className="px-4 py-2 rounded-lg bg-[#8B7CFF] text-white font-mono font-bold text-xs hover:bg-[#8B7CFF]/90 transition-all shadow-[0_0_15px_rgba(139,124,255,0.4)] whitespace-nowrap"
            >
              RUN AUTOMATED MITIGATION
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#1D252C]">
          <div className="flex items-center gap-2 font-mono text-xs">
            {[
              { id: 'ALL', label: 'All Intelligence (142)' },
              { id: 'CRITICAL', label: 'Critical Alerts (12)' },
              { id: 'REVIEW', label: 'Needs Review (48)' },
              { id: 'OPTIMIZATIONS', label: 'Optimizations (82)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === tab.id
                    ? 'bg-[#121d24] text-white border border-[#2c363e] font-bold'
                    : 'text-[#8f9194] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8f9194]">
            <Filter className="w-3.5 h-3.5" />
            <span>SORT: CONFIDENCE SCORE</span>
          </div>
        </div>

        {/* Main 2-Column Grid: AI Decision Cards (Left 7 Cols) & Copilot Prompt Simulator (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Decision Cards List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className={`bg-[#0b0e11] border rounded-xl p-5 space-y-4 shadow-lg transition-all ${
                  card.type === 'CRITICAL'
                    ? 'border-[#FF3B30]/40 bg-[#FF3B30]/5'
                    : 'border-[#1D252C] hover:border-[#2c363e]'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8B7CFF]">{card.id}</span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                      card.type === 'CRITICAL' ? 'bg-[#FF3B30] text-white' : 'bg-[#36C5F0]/20 text-[#36C5F0]'
                    }`}>
                      {card.type}
                    </span>
                    <span className="text-xs font-mono text-[#32D583] font-bold">
                      {card.confidence}% CONFIDENCE
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#8f9194]">Window: {card.timeWindow}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{card.title}</h3>
                  <p className="text-xs text-[#c5c6ca] mt-1 font-sans leading-relaxed">{card.summary}</p>
                </div>

                {/* AI Protocol Recommendation Box */}
                <div className="p-3 bg-[#050607] rounded-lg border border-[#1D252C] space-y-2">
                  <span className="text-xs font-mono font-bold text-[#8B7CFF] block">
                    RECOMMENDED DECISION PROTOCOL:
                  </span>
                  <p className="text-xs text-white font-sans font-semibold leading-normal">
                    {card.recommendation}
                  </p>
                </div>

                {/* Supporting Signals List */}
                <div>
                  <span className="text-[11px] font-mono text-[#8f9194] block mb-1">CORRELATED SENSOR SIGNALS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.supportingSignals.map((sig, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#121d24] border border-[#1D252C] text-[11px] font-mono text-[#c5c6ca]">
                        • {sig}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1D252C] font-mono text-xs">
                  <span className="text-[#8f9194]">Impact: <strong className="text-white">{card.impactScore}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Approved protocol for ${card.id}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#32D583] text-black font-bold hover:bg-[#32D583]/90 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>APPROVE PROTOCOL</span>
                    </button>
                    <button
                      onClick={() => alert(`Dismissed anomaly ${card.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#121d24] border border-[#1D252C] text-[#8f9194] hover:text-white transition-all"
                    >
                      DISMISS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: AI Chat Copilot Simulator (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b0e11] border border-[#8B7CFF]/30 rounded-xl p-4 flex flex-col h-[600px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#8B7CFF]/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8B7CFF]" />
                <h3 className="text-sm font-bold text-[#F5F7F8]">AI DECISION COPILOT CHAT</h3>
              </div>
              <span className="text-xs font-mono text-[#32D583]">ONLINE</span>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1">
              {copilotChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs font-sans ${
                    msg.sender === 'USER'
                      ? 'bg-[#36C5F0]/10 border-[#36C5F0]/30 ml-6 text-white'
                      : 'bg-[#8B7CFF]/10 border-[#8B7CFF]/30 mr-4 text-[#c5c6ca]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#8B7CFF] mb-1">
                    <span className="font-bold">{msg.sender === 'USER' ? 'DISPATCH OPERATOR' : 'LIFELINK AI COPILOT'}</span>
                    <span>{msg.title}</span>
                  </div>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Quick Prompt Pill Shortcuts */}
            <div className="flex flex-wrap gap-1.5 mb-3 pt-2 border-t border-[#1D252C]">
              {[
                'Simulate Sector 4 Bridge Collapse',
                'Check Medical Inventory Depletion',
                'Evaluate Mesh Node Battery Life'
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => setCopilotQuery(p)}
                  className="px-2.5 py-1 rounded-full bg-[#121d24] border border-[#1D252C] text-[11px] font-mono text-[#36C5F0] hover:bg-[#36C5F0]/10 transition-all"
                >
                  + {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleQuerySubmit} className="flex items-center gap-2 pt-2 border-t border-[#1D252C]">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask AI Copilot for decision analysis or scenario simulation..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#8B7CFF]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#8B7CFF] text-white font-bold text-xs hover:bg-[#8B7CFF]/90 transition-all flex items-center gap-1 font-mono"
              >
                <span>QUERY</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
