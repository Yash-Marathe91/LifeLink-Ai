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
  MapPin,
  Smartphone,
  Globe,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type RegisterMethod = 'FORM' | 'SMS_OTP' | 'GOOGLE';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, requestOTP, verifyOTP, loginWithGoogle } = useAuth();

  const [regMethod, setRegMethod] = useState<RegisterMethod>('FORM');
  const [showMobileHero, setShowMobileHero] = useState(false);

  // Form Registration State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [agencyId, setAgencyId] = useState('');
  const [encryptedConsent, setEncryptedConsent] = useState(true);

  // SMS OTP Registration State
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoCodeNotice, setDemoCodeNotice] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Standard Form Registration
  const handleFormSubmit = async (e: React.FormEvent) => {
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

  // Handle SMS OTP Registration Request
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg('Please enter a valid phone number for SMS registration.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await requestOTP(phone);
    setIsSubmitting(false);

    if (res.success) {
      setOtpSent(true);
      if (res.demoCode) {
        setDemoCodeNotice(`Twilio Code Dispatched! Test OTP: ${res.demoCode}`);
        setOtpCode(res.demoCode);
      }
    } else {
      setErrorMsg(res.error || 'Failed to dispatch SMS verification code.');
    }
  };

  // Handle SMS OTP Verify Registration
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setErrorMsg('Please enter the 6-digit SMS verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await verifyOTP(phone, otpCode);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.error || 'Invalid OTP code.');
      setIsSubmitting(false);
    }
  };

  // Handle Google SSO 1-Click Fast Registration
  const handleGoogleSSORegister = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const googlePayload = {
      email: 'citizen.new@lifelink.ai',
      fullName: 'Google Authenticated Survivor',
      googleId: 'google_oauth_7718293819',
      idToken: 'demo_google_id_token_xyz_reg',
    };

    const res = await loginWithGoogle(googlePayload);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.error || 'Google SSO registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] flex flex-col lg:flex-row text-[#F5F7F8] font-sans overflow-x-hidden">
      
      {/* LEFT SIDE: Tactical Disaster Relief & System Info (Collapsible on Mobile Android) */}
      <div className="lg:w-1/2 relative bg-[#0b0e11] min-h-auto lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1D252C]">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80')`
          }}
        />

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-[#36C5F0]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#32D583]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header Logo (ENLARGED & NO BORDER) */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-4 group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-transform group-hover:scale-110 drop-shadow-[0_0_20px_rgba(54,197,240,0.4)]">
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
              <span className="text-xl sm:text-2xl font-black tracking-wider font-mono text-white block">
                LIFELINK <span className="text-[#36C5F0]">AI</span>
              </span>
              <span className="text-[11px] font-mono text-[#8f9194] tracking-widest uppercase">
                EMERGENCY DISASTER PLATFORM
              </span>
            </div>
          </Link>

          {/* Android Mobile Accordion Toggle */}
          <button
            type="button"
            onClick={() => setShowMobileHero(!showMobileHero)}
            className="lg:hidden p-2 rounded-lg border border-[#1D252C] bg-[#050607] text-xs font-mono text-[#36C5F0] flex items-center gap-1 min-h-[44px]"
          >
            <span>{showMobileHero ? 'HIDE INFO' : 'SYSTEM INFO'}</span>
            {showMobileHero ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Hero Section Content (Always visible on desktop, toggleable on mobile) */}
        <div className={`relative z-10 my-auto py-6 lg:py-10 max-w-lg ${showMobileHero ? 'block' : 'hidden lg:block'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#32D583]/10 border border-[#32D583]/30 text-xs font-mono text-[#32D583] mb-4 shadow-[0_0_15px_rgba(50,213,131,0.2)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#32D583]" />
            <span>OFFLINE MESH & RBAC SECURITY READY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Register for Mission-Critical Emergency Dispatch.
          </h1>
          
          <p className="mt-3 text-xs sm:text-sm text-[#8f9194] leading-relaxed">
            Choose your preferred sign-up method: Complete Profile Form, 1-Step SMS OTP, or Google SSO.
          </p>

          <div className="mt-6 space-y-2.5 font-mono text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#050607]/80 border border-[#1D252C] backdrop-blur-md">
              <div className="p-2 rounded-lg bg-[#36C5F0]/15 text-[#36C5F0]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-bold block">Gemini 3.1 AI Triage</span>
                <span className="text-[#8f9194]">Instant survivor risk calculation</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#050607]/80 border border-[#1D252C] backdrop-blur-md">
              <div className="p-2 rounded-lg bg-[#32D583]/15 text-[#32D583]">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-bold block">Resilient BLE Mesh Hops</span>
                <span className="text-[#8f9194]">Zero-cellular emergency telemetry</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-4 border-t border-[#1D252C]/60 hidden lg:flex items-center justify-between text-xs font-mono text-[#8f9194]">
          <span>AES-256 GCM ENCRYPTED</span>
          <span>ANDROID & PWA COMPATIBLE</span>
        </div>
      </div>

      {/* RIGHT SIDE: Multi-Method Registration Form Box */}
      <div className="lg:w-1/2 flex flex-col justify-center p-4 sm:p-8 lg:p-12 relative bg-[#050607] bg-[radial-gradient(#1D252C_1px,transparent_1px)] [background-size:24px_24px]">
        
        <div className="max-w-md w-full mx-auto space-y-5">
          
          {/* Header */}
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5F7F8] tracking-tight">
              PROVISION NEW ACCOUNT
            </h2>
            <p className="text-xs text-[#8f9194] font-mono mt-0.5">
              CHOOSE SECURE REGISTRATION METHOD
            </p>
          </div>

          {/* Registration Method Tabs — Android Touch Target Optimized */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#0b0e11] rounded-xl border border-[#1D252C] font-mono text-xs">
            <button
              type="button"
              onClick={() => { setRegMethod('FORM'); setErrorMsg(null); }}
              className={`py-3 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 min-h-[48px] ${
                regMethod === 'FORM'
                  ? 'bg-[#32D583] text-black shadow-[0_0_10px_rgba(50,213,131,0.3)]'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>FORM</span>
            </button>

            <button
              type="button"
              onClick={() => { setRegMethod('SMS_OTP'); setErrorMsg(null); }}
              className={`py-3 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 min-h-[48px] ${
                regMethod === 'SMS_OTP'
                  ? 'bg-[#36C5F0] text-black shadow-[0_0_10px_rgba(54,197,240,0.3)]'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>SMS OTP</span>
            </button>

            <button
              type="button"
              onClick={() => { setRegMethod('GOOGLE'); setErrorMsg(null); }}
              className={`py-3 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 min-h-[48px] ${
                regMethod === 'GOOGLE'
                  ? 'bg-[#4C8DFF] text-white shadow-[0_0_10px_rgba(76,141,255,0.3)]'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>GOOGLE</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#FF3B30]/15 border border-[#FF3B30] text-xs font-mono text-[#FF3B30] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* METHOD 1: FULL FORM REGISTRATION */}
          {regMethod === 'FORM' && (
            <form className="space-y-3.5" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                  FULL LEGAL NAME *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Commander Sarah Jenkins"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono min-h-[48px]"
                  />
                  <User className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                  EMAIL ADDRESS *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah.jenkins@lifelink.ai"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono min-h-[48px]"
                  />
                  <Mail className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                  ACCESS PASSWORD *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono min-h-[48px]"
                  />
                  <Lock className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                    PHONE NUMBER
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 800-555-0199"
                      className="w-full pl-9 pr-2 py-3 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono min-h-[48px]"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#8f9194] absolute left-3 top-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                    SYSTEM ROLE
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-3 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-xs text-white focus:outline-none focus:border-[#32D583] font-mono min-h-[48px]"
                  >
                    <option value="CITIZEN">CITIZEN</option>
                    <option value="RESPONDER">RESPONDER</option>
                    <option value="DISPATCHER">DISPATCHER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#0b0e11] rounded-xl border border-[#1D252C] text-xs font-mono space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={encryptedConsent}
                    onChange={(e) => setEncryptedConsent(e.target.checked)}
                    className="mt-0.5 rounded bg-[#050607] border-[#1D252C] text-[#32D583]"
                  />
                  <span className="text-[#c5c6ca] text-[11px] leading-tight">
                    Consent to AES-256 GCM encryption of medical vulnerability profiles.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#32D583] text-black font-extrabold text-xs sm:text-sm hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,213,131,0.35)] font-mono min-h-[48px]"
              >
                {isSubmitting ? <span>PROVISIONING ACCOUNT...</span> : <span>CREATE ACCOUNT & ENTER PORTAL</span>}
              </button>
            </form>
          )}

          {/* METHOD 2: SMS OTP FAST REGISTRATION */}
          {regMethod === 'SMS_OTP' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                      PHONE NUMBER FOR SMS REGISTRATION
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 800-555-0199"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0] font-mono min-h-[48px]"
                      />
                      <Phone className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#36C5F0] text-black font-extrabold text-xs sm:text-sm hover:bg-[#36C5F0]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(54,197,240,0.3)] font-mono min-h-[48px]"
                  >
                    {isSubmitting ? <span>DISPATCHING SMS...</span> : <span>SEND VERIFICATION SMS</span>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  {demoCodeNotice && (
                    <div className="p-3 rounded-xl bg-[#36C5F0]/15 border border-[#36C5F0] text-xs font-mono text-[#36C5F0] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{demoCodeNotice}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                      ENTER 6-DIGIT CODE
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center py-3 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-lg text-white font-mono tracking-widest focus:outline-none focus:border-[#36C5F0] min-h-[48px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#36C5F0] text-black font-extrabold text-xs sm:text-sm hover:bg-[#36C5F0]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(54,197,240,0.3)] font-mono min-h-[48px]"
                  >
                    {isSubmitting ? <span>VERIFYING REGISTRATION...</span> : <span>VERIFY & COMPLETE REGISTRATION</span>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* METHOD 3: GOOGLE SSO FAST REGISTRATION */}
          {regMethod === 'GOOGLE' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#4C8DFF]/15 text-[#4C8DFF] flex items-center justify-center mx-auto mb-2 border border-[#4C8DFF]/30">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono">FAST GOOGLE SSO REGISTRATION</h3>
              <p className="text-xs text-[#8f9194]">
                Create a LifeLink emergency account in 1 click using your Google OpenID profile.
              </p>

              <button
                type="button"
                onClick={handleGoogleSSORegister}
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 rounded-xl bg-[#4C8DFF] text-white font-extrabold text-xs sm:text-sm hover:bg-[#4C8DFF]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(76,141,255,0.4)] font-mono min-h-[48px]"
              >
                {isSubmitting ? <span>PROVISIONING GOOGLE ACCOUNT...</span> : <span>REGISTER WITH GOOGLE</span>}
              </button>
            </div>
          )}

          {/* Already have account footer */}
          <div className="pt-4 border-t border-[#1D252C] text-center text-xs font-mono text-[#8f9194]">
            Already have an active account?{' '}
            <Link href="/login" className="text-[#32D583] font-bold hover:underline">
              Log in to Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
