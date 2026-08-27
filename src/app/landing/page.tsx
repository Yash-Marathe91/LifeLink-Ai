'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Shield, 
  Radio, 
  Activity, 
  MapPin, 
  PhoneCall, 
  Cpu, 
  ArrowRight, 
  Zap, 
  Lock, 
  Globe, 
  Users, 
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050607] text-[#F5F7F8] font-sans selection:bg-[#36C5F0] selection:text-black overflow-x-hidden">
      
      {/* Background Neon Atmospheric Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[#36C5F0]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#FF3B30]/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#050607]/80 backdrop-blur-xl border-b border-[#1D252C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/landing" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#0b0e11] border border-[#36C5F0]/40 p-1.5 shadow-[0_0_15px_rgba(54,197,240,0.3)] flex items-center justify-center transition-all group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="LifeLink AI Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-lg font-black tracking-wider font-mono">
              LIFELINK <span className="text-[#36C5F0]">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-[#8f9194]">
            <a href="#capabilities" className="hover:text-white transition-colors">CAPABILITIES</a>
            <a href="#architecture" className="hover:text-white transition-colors">ARCHITECTURE</a>
            <a href="#gis-map" className="hover:text-white transition-colors">TACTICAL GIS</a>
            <a href="#security" className="hover:text-white transition-colors">RBAC SECURITY</a>
          </nav>

          {/* Portal Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg border border-[#1D252C] bg-[#0b0e11] text-xs font-mono text-[#c5c6ca] hover:text-white hover:border-[#36C5F0] transition-all"
            >
              PORTAL LOGIN
            </Link>
            <Link
              href="/"
              className="px-4 py-1.5 rounded-lg bg-[#36C5F0] text-black text-xs font-mono font-bold hover:bg-[#36C5F0]/90 transition-all shadow-[0_0_15px_rgba(54,197,240,0.4)] flex items-center gap-1.5"
            >
              <span>COMMAND CENTER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36C5F0]/10 border border-[#36C5F0]/30 text-xs font-mono text-[#36C5F0] mb-6 shadow-[0_0_15px_rgba(54,197,240,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#36C5F0]" />
          <span>PRODUCTION READY DISASTER DISPATCH & MESH PLATFORM</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
          NEXT-GENERATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#36C5F0] via-[#32D583] to-[#4C8DFF]">AI DISASTER TRIAGE</span> & RESILIENT MESH DISPATCH
        </h1>

        <p className="mt-5 text-sm sm:text-base text-[#8f9194] max-w-2xl mx-auto font-sans leading-relaxed">
          LifeLink AI orchestrates offline BLE mesh connectivity, Gemini 3.1 Pro AI triage reasoning, Esri/Google GIS mapping, and Twilio emergency cellular SMS broadcasts when conventional infrastructure fails.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#FF3B30] text-white text-xs sm:text-sm font-mono font-bold hover:bg-[#FF3B30]/90 transition-all shadow-[0_0_25px_rgba(255,59,48,0.4)] flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>ENTER MISSION COMMAND PORTAL</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-xs sm:text-sm font-mono text-[#F5F7F8] hover:border-[#36C5F0] transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-[#36C5F0]" />
            <span>REGISTER RESPONDER ACCOUNT</span>
          </Link>
        </div>

        {/* Live Telemetry Ticker Bar */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#0b0e11]/80 border border-[#1D252C] backdrop-blur-xl font-mono text-left">
          <div className="p-3">
            <span className="text-[11px] text-[#8f9194] block">TRIAGE RESPONSE TIME</span>
            <span className="text-lg font-bold text-[#32D583]">3.2 Seconds</span>
          </div>
          <div className="p-3 border-l border-[#1D252C]">
            <span className="text-[11px] text-[#8f9194] block">BLE MESH CAPACITY</span>
            <span className="text-lg font-bold text-[#36C5F0]">100% Zero-Cellular</span>
          </div>
          <div className="p-3 border-l border-[#1D252C]">
            <span className="text-[11px] text-[#8f9194] block">SPATIAL PRECISION</span>
            <span className="text-lg font-bold text-[#4C8DFF]">Sub-5 Meter PostGIS</span>
          </div>
          <div className="p-3 border-l border-[#1D252C]">
            <span className="text-[11px] text-[#8f9194] block">SECURITY RATING</span>
            <span className="text-lg font-bold text-[#8B7CFF]">AES-256 + RBAC</span>
          </div>
        </div>
      </section>

      {/* Capabilities Feature Section */}
      <section id="capabilities" className="py-16 bg-[#0b0e11]/60 border-y border-[#1D252C] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold text-[#36C5F0] tracking-widest uppercase">
              MISSION CRITICAL CAPABILITIES
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F8] mt-1">
              Engineered for Zero-Trust Emergency Environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#050607] border border-[#1D252C] hover:border-[#36C5F0]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#36C5F0]/15 text-[#36C5F0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F7F8]">Gemini 3.1 AI Triage Engine</h3>
              <p className="text-xs text-[#8f9194] mt-2 leading-relaxed font-sans">
                Automatically computes survivor risk scores (1-100), extracts critical medical vulnerabilities, and prioritizes squad dispatch.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#050607] border border-[#1D252C] hover:border-[#32D583]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#32D583]/15 text-[#32D583] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F7F8]">Resilient BLE Mesh Network</h3>
              <p className="text-xs text-[#8f9194] mt-2 leading-relaxed font-sans">
                Forms peer-to-peer ad-hoc Bluetooth mesh relay hops when cellular towers collapse, transmitting survivor telemetry off-grid.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#050607] border border-[#1D252C] hover:border-[#4C8DFF]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#4C8DFF]/15 text-[#4C8DFF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F7F8]">Esri / Google GIS Tactical Map</h3>
              <p className="text-xs text-[#8f9194] mt-2 leading-relaxed font-sans">
                Watermark-free dark GIS stage with OSRM turn-by-turn squad routing paths, flood polygon overlays, and OpenCage address search.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#050607] border border-[#1D252C] hover:border-[#FF3B30]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#FF3B30]/15 text-[#FF3B30] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F7F8]">Twilio SMS Broadcast Gateway</h3>
              <p className="text-xs text-[#8f9194] mt-2 leading-relaxed font-sans">
                Sends automated cellular emergency SMS alerts to family contacts and rescue teams with exact victim GPS coordinates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#050607] border-t border-[#1D252C] text-center text-xs font-mono text-[#8f9194]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#32D583] animate-ping" />
            <span>LIFELINK AI DISASTER SYSTEM ONLINE</span>
          </div>
          <p>© 2026 LifeLink AI. Mission Critical Infrastructure.</p>
        </div>
      </footer>
    </div>
  );
}
