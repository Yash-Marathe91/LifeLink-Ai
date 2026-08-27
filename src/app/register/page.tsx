'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  Phone, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  Radio, 
  Activity, 
  Cpu, 
  MapPin 
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [agencyId, setAgencyId] = useState('');
  const [encryptedConsent, setEncryptedConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      full_name: fullName,
      email: email,
      password: password,
      role_name: role,
      phone: phone || null,
      agency_id: agencyId || null,
      is_emergency_contact: true,
    };

    const res = await registerUser(payload);

    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.error || 'Registration failed. Check user details.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] flex flex-col lg:flex-row text-[#F5F7F8] font-sans overflow-x-hidden">
      
      {/* LEFT SIDE: Tactical Disaster Relief & Emergency Imagery Showcase */}
      <div className="lg:w-1/2 relative bg-[#0b0e11] min-h-[400px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1D252C]">
        
        {/* Dark Tactical Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        
        {/* Neon Glow Accents */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#36C5F0]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#32D583]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header Logo (NO BORDER, ENLARGED) */}
        <div className="relative z-10">
          <Link href="/landing" className="flex items-center gap-4 group">
            {/* Enlarged Logo, NO Border */}
            <div className="relative w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-110 drop-shadow-[0_0_20px_rgba(54,197,240,0.4)]">
              <Image
                src="/images/logo.png"
                alt="LifeLink AI Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider font-mono text-white block">
                LIFELINK <span className="text-[#36C5F0]">AI</span>
              </span>
              <span className="text-xs font-mono text-[#8f9194] tracking-widest uppercase">
                EMERGENCY DISASTER PLATFORM
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Value Proposition Showcase */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#32D583]/10 border border-[#32D583]/30 text-xs font-mono text-[#32D583] mb-6 shadow-[0_0_15px_rgba(50,213,131,0.2)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#32D583]" />
            <span>OFFLINE BLE MESH & AI TRIAGE READY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Empowering Responders & Citizens in Critical Hours.
          </h1>
          
          <p className="mt-4 text-sm text-[#8f9194] leading-relaxed">
            Create an authenticated LifeLink AI account to access peer-to-peer BLE mesh relays, real-time spatial GIS dispatch, and AI-driven survivor risk triage.
          </p>

          {/* Key Feature Badges */}
          <div className="mt-8 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#050607]/80 border border-[#1D252C] backdrop-blur-md">
              <div className="p-2 rounded-lg bg-[#36C5F0]/15 text-[#36C5F0]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-bold block">Gemini 3.1 Pro AI Reasoning</span>
                <span className="text-[#8f9194]">Automated 1-100 victim triage risk score</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#050607]/80 border border-[#1D252C] backdrop-blur-md">
              <div className="p-2 rounded-lg bg-[#32D583]/15 text-[#32D583]">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-bold block">Peer-to-Peer BLE Mesh Hops</span>
                <span className="text-[#8f9194]">Zero-cellular off-grid emergency telemetry</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#050607]/80 border border-[#1D252C] backdrop-blur-md">
              <div className="p-2 rounded-lg bg-[#4C8DFF]/15 text-[#4C8DFF]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-bold block">Esri & Google Tactical GIS</span>
                <span className="text-[#8f9194]">Watermark-free spatial mapping & OSRM routing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side Footer */}
        <div className="relative z-10 pt-4 border-t border-[#1D252C]/60 flex items-center justify-between text-xs font-mono text-[#8f9194]">
          <span>AES-256 GCM ENCRYPTED</span>
          <span>SYSTEM VERIFIED</span>
        </div>
      </div>

      {/* RIGHT SIDE: Spacious Registration Form */}
      <div className="lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 lg:p-16 relative bg-[#050607] bg-[radial-gradient(#1D252C_1px,transparent_1px)] [background-size:24px_24px]">
        
        <div className="max-w-md w-full mx-auto space-y-6">
          
          {/* Header Mobile Logo (ENLARGED & NO BORDER) */}
          <div className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-12 h-12 flex items-center justify-center drop-shadow-[0_0_15px_rgba(50,213,131,0.4)]">
                <Image
                  src="/images/logo.png"
                  alt="LifeLink AI Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black text-white tracking-wider font-mono">
                LIFELINK <span className="text-[#32D583]">AI</span>
              </span>
            </div>
            
            <h2 className="text-2xl font-extrabold text-[#F5F7F8] tracking-tight">
              CREATE RESPONDER & CITIZEN ACCOUNT
            </h2>
            <p className="text-xs text-[#8f9194] font-mono mt-1">
              FILL FORM DETAILS TO PROVISION RBAC EMERGENCY CREDS
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#FF3B30]/15 border border-[#FF3B30] text-xs font-mono text-[#FF3B30] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono text-[#c5c6ca] mb-1.5 font-bold">
                FULL LEGAL NAME *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Commander Sarah Jenkins"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono"
                />
                <User className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#c5c6ca] mb-1.5 font-bold">
                ORGANIZATION / PERSONAL EMAIL *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.jenkins@lifelink.ai"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono"
                />
                <Mail className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#c5c6ca] mb-1.5 font-bold">
                SECURE ACCESS PASSWORD *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono"
                />
                <Lock className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1.5 font-bold">
                  EMERGENCY PHONE
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 800-555-0199"
                    className="w-full pl-9 pr-2 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#8f9194] absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1.5 font-bold">
                  ASSIGNED SYSTEM ROLE
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-xs text-white focus:outline-none focus:border-[#32D583] font-mono"
                >
                  <option value="CITIZEN">CITIZEN (SURVIVOR)</option>
                  <option value="RESPONDER">RESPONDER (RESCUE)</option>
                  <option value="DISPATCHER">DISPATCHER (COMMAND)</option>
                  <option value="ADMIN">ADMIN (SYSTEM)</option>
                </select>
              </div>
            </div>

            {/* Medical Encryption Consent Checkbox */}
            <div className="p-3.5 bg-[#0b0e11] rounded-xl border border-[#1D252C] text-xs font-mono space-y-1.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={encryptedConsent}
                  onChange={(e) => setEncryptedConsent(e.target.checked)}
                  className="mt-0.5 rounded bg-[#050607] border-[#1D252C] text-[#32D583] focus:ring-0"
                />
                <span className="text-[#c5c6ca] leading-relaxed text-[11px]">
                  I consent to AES-256 GCM local client encryption for my medical vulnerability profile & emergency alert broadcasts.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#32D583] text-black font-extrabold text-xs sm:text-sm hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,213,131,0.35)] font-mono tracking-wider"
            >
              {isSubmitting ? (
                <span>PROVISIONING ACCOUNT...</span>
              ) : (
                <>
                  <span>PROVISION ACCOUNT & ENTER PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account footer */}
          <div className="pt-4 border-t border-[#1D252C] text-center text-xs font-mono text-[#8f9194]">
            Already have an active account?{' '}
            <Link href="/login" className="text-[#32D583] font-bold hover:underline">
              Log in to Command Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
