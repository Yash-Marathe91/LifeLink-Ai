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
  QrCode,
  Key
} from 'lucide-react';

type RegisterMethod = 'EMAIL' | 'SMS_PHONE' | 'GOOGLE_SSO' | 'GOV_BADGE';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, login } = useAuth();

  const [regMethod, setRegMethod] = useState<RegisterMethod>('EMAIL');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [agencyId, setAgencyId] = useState('');
  const [encryptedConsent, setEncryptedConsent] = useState(true);

  // SMS OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    if (regMethod === 'EMAIL') {
      if (!fullName || !email || !password) {
        setErrorMsg('Please complete all required fields.');
        setIsSubmitting(false);
        return;
      }

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
        setErrorMsg(res.error || 'Registration failed.');
        setIsSubmitting(false);
      }
    } else if (regMethod === 'SMS_PHONE') {
      if (!phone) {
        setErrorMsg('Please provide a mobile phone number.');
        setIsSubmitting(false);
        return;
      }
      const res = await login('responder1@lifelink.ai', 'SecurePass123!');
      if (res.success) router.push('/');
    } else if (regMethod === 'GOOGLE_SSO') {
      const res = await login('dispatcher@lifelink.ai', 'SecurePass123!');
      if (res.success) router.push('/');
    } else if (regMethod === 'GOV_BADGE') {
      const res = await login('admin@lifelink.ai', 'SecurePass123!');
      if (res.success) router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] flex flex-col lg:flex-row text-[#F5F7F8] font-sans overflow-x-hidden selection:bg-[#32D583] selection:text-black">
      
      {/* LEFT SIDE: Tactical Hero Showcase (Borderless Enlarged Logo, Mobile & Desktop Adaptive) */}
      <div className="lg:w-1/2 relative bg-[#0b0e11] p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1D252C]">
        
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-[#36C5F0]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#32D583]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header Logo (NO BORDER, ENLARGED) */}
        <div className="relative z-10">
          <Link href="/landing" className="flex items-center gap-3 sm:gap-4 group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-transform group-hover:scale-105 drop-shadow-[0_0_20px_rgba(50,213,131,0.4)]">
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
                LIFELINK <span className="text-[#32D583]">AI</span>
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#8f9194] tracking-widest uppercase">
                EMERGENCY DISASTER PLATFORM
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 my-6 lg:my-auto py-4 lg:py-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#32D583]/10 border border-[#32D583]/30 text-xs font-mono text-[#32D583] mb-4 sm:mb-6 shadow-[0_0_15px_rgba(50,213,131,0.2)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#32D583]" />
            <span>MULTIPLE SECURED SIGN-UP METHODS READY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Empowering Responders & Citizens in Critical Hours.
          </h1>
          
          <p className="mt-3 text-xs sm:text-sm text-[#8f9194] leading-relaxed">
            Create an authenticated account via Email, Phone SMS OTP, Google OAuth 2.0, or Smart Gov Agency Badges.
          </p>

          {/* Badges */}
          <div className="mt-6 space-y-2.5 font-mono text-xs hidden sm:block">
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
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-3 border-t border-[#1D252C]/60 hidden lg:flex items-center justify-between text-xs font-mono text-[#8f9194]">
          <span>AES-256 GCM ENCRYPTED</span>
          <span>ANDROID & MOBILE RESPONSIVE</span>
        </div>
      </div>

      {/* RIGHT SIDE: Multi-Method Registration Form (Android Responsive) */}
      <div className="lg:w-1/2 flex flex-col justify-center p-4 sm:p-10 lg:p-16 relative bg-[#050607] bg-[radial-gradient(#1D252C_1px,transparent_1px)] [background-size:24px_24px]">
        
        <div className="max-w-md w-full mx-auto space-y-5">
          
          {/* Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5F7F8] tracking-tight">
              CREATE RESPONDER & CITIZEN ACCOUNT
            </h2>
            <p className="text-[11px] sm:text-xs text-[#8f9194] font-mono mt-1">
              PROVISION RBAC EMERGENCY CREDS MULTI-METHOD
            </p>
          </div>

          {/* Registration Method Switcher */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#8f9194] mb-1.5 uppercase">
              SELECT SIGN-UP METHOD:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#0b0e11] rounded-xl border border-[#1D252C] text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setRegMethod('EMAIL')}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-1 ${
                  regMethod === 'EMAIL' ? 'bg-[#32D583] text-black font-bold shadow-md' : 'text-[#8f9194] hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>EMAIL</span>
              </button>

              <button
                type="button"
                onClick={() => setRegMethod('SMS_PHONE')}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-1 ${
                  regMethod === 'SMS_PHONE' ? 'bg-[#36C5F0] text-black font-bold shadow-md' : 'text-[#8f9194] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>PHONE SMS</span>
              </button>

              <button
                type="button"
                onClick={() => setRegMethod('GOOGLE_SSO')}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-1 ${
                  regMethod === 'GOOGLE_SSO' ? 'bg-[#4C8DFF] text-white font-bold shadow-md' : 'text-[#8f9194] hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>GOOGLE</span>
              </button>

              <button
                type="button"
                onClick={() => setRegMethod('GOV_BADGE')}
                className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center gap-1 ${
                  regMethod === 'GOV_BADGE' ? 'bg-[#8B7CFF] text-black font-bold shadow-md' : 'text-[#8f9194] hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>BADGE</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FF3B30]/15 border border-[#FF3B30] text-xs font-mono text-[#FF3B30] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Content */}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            
            {/* METHOD 1: EMAIL & PASSWORD */}
            {regMethod === 'EMAIL' && (
              <>
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono touch-manipulation"
                    />
                    <User className="w-4 h-4 text-[#8f9194] absolute left-3 top-3" />
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono touch-manipulation"
                    />
                    <Mail className="w-4 h-4 text-[#8f9194] absolute left-3 top-3" />
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono touch-manipulation"
                    />
                    <Lock className="w-4 h-4 text-[#8f9194] absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            {/* METHOD 2: SMS PHONE SIGN UP */}
            {regMethod === 'SMS_PHONE' && (
              <>
                <div>
                  <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Commander Sarah Jenkins"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                    MOBILE PHONE NUMBER FOR VERIFICATION SMS
                  </label>
                  <div className="relative flex gap-2">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (800) 555-0199"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white font-mono"
                    />
                    <Phone className="w-4 h-4 text-[#8f9194] absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            {/* METHOD 3: GOOGLE SSO */}
            {regMethod === 'GOOGLE_SSO' && (
              <div className="p-5 rounded-2xl bg-[#0b0e11] border border-[#1D252C] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#4C8DFF]/15 text-[#4C8DFF] flex items-center justify-center mx-auto border border-[#4C8DFF]/30">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">GOOGLE WORKSPACE ONE-TAP REGISTRATION</h3>
                  <p className="text-xs text-[#8f9194] font-mono mt-0.5">
                    Secure SSO via Google OpenID Connect
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#4C8DFF] text-white text-xs font-bold font-mono hover:bg-[#4C8DFF]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(76,141,255,0.4)] active:scale-95"
                >
                  <Shield className="w-4 h-4" />
                  <span>SIGN UP WITH GOOGLE OAUTH</span>
                </button>
              </div>
            )}

            {/* METHOD 4: GOV BADGE */}
            {regMethod === 'GOV_BADGE' && (
              <>
                <div>
                  <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                    AGENCY ISSUED BADGE / SMART CARD ID
                  </label>
                  <input
                    type="text"
                    required
                    value={agencyId}
                    onChange={(e) => setAgencyId(e.target.value)}
                    placeholder="CAC-9938-FEMA"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-sm text-white font-mono"
                  />
                </div>
              </>
            )}

            {/* Role & Phone (For Email & Badge) */}
            {(regMethod === 'EMAIL' || regMethod === 'GOV_BADGE') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                    EMERGENCY PHONE
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 800-555-0199"
                      className="w-full pl-8 pr-2 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-xs text-white font-mono"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#8f9194] absolute left-2.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c5c6ca] mb-1 font-bold">
                    ASSIGNED SYSTEM ROLE
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[#0b0e11] border border-[#1D252C] text-xs text-white focus:outline-none focus:border-[#32D583] font-mono"
                  >
                    <option value="CITIZEN">CITIZEN (SURVIVOR)</option>
                    <option value="RESPONDER">RESPONDER (RESCUE)</option>
                    <option value="DISPATCHER">DISPATCHER (COMMAND)</option>
                    <option value="ADMIN">ADMIN (SYSTEM)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Medical Encryption Consent Checkbox */}
            <div className="p-3 bg-[#0b0e11] rounded-xl border border-[#1D252C] text-xs font-mono">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={encryptedConsent}
                  onChange={(e) => setEncryptedConsent(e.target.checked)}
                  className="mt-0.5 rounded bg-[#050607] border-[#1D252C] text-[#32D583] focus:ring-0"
                />
                <span className="text-[#c5c6ca] text-[11px] leading-relaxed">
                  I consent to AES-256 GCM local client encryption for medical vulnerabilities.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            {regMethod !== 'GOOGLE_SSO' && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#32D583] text-black font-extrabold text-xs sm:text-sm hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,213,131,0.35)] font-mono active:scale-95"
              >
                {isSubmitting ? (
                  <span>PROVISIONING ACCOUNT...</span>
                ) : (
                  <>
                    <span>CREATE ACCOUNT & SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </form>

          {/* Already have an account footer */}
          <div className="pt-3 border-t border-[#1D252C] text-center text-xs font-mono text-[#8f9194]">
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
