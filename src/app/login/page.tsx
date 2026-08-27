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
  UserCheck, 
  Smartphone, 
  Fingerprint, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  Phone,
  Radio
} from 'lucide-react';

type AuthMethod = 'PASSWORD' | 'SMS_OTP' | 'GOOGLE' | 'PASSKEY';

export default function LoginPage() {
  const router = useRouter();
  const { login, requestOTP, verifyOTP, loginWithGoogle, loginWithBiometrics } = useAuth();

  const [authMethod, setAuthMethod] = useState<AuthMethod>('PASSWORD');
  
  // Standard Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('DISPATCHER');

  // SMS OTP State
  const [phone, setPhone] = useState('+91 98200 12345');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoCodeNotice, setDemoCodeNotice] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Preset Selector for Password Mode
  const handleSelectRolePreset = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    switch (role) {
      case 'DISPATCHER':
        setEmail('commander.rajesh@ndrf.gov.in');
        setPassword('SecurePass123!');
        break;
      case 'RESPONDER':
        setEmail('dr.ananya.deshmukh@sdrf.in');
        setPassword('SecurePass123!');
        break;
      case 'CITIZEN':
        setEmail('aarav.patel@lifelink.in');
        setPassword('SecurePass123!');
        break;
      case 'ADMIN':
        setEmail('admin.mha@ndma.gov.in');
        setPassword('SecurePass123!');
        break;
    }
  };

  // Handle Standard Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await login(email, password);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.error || 'Authentication failed.');
      setIsSubmitting(false);
    }
  };

  // Handle SMS OTP Request
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg('Please enter a valid Indian emergency phone number (+91).');
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
      setErrorMsg(res.error || 'Failed to dispatch SMS code.');
    }
  };

  // Handle SMS OTP Verify
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
      setErrorMsg(res.error || 'Invalid OTP verification code.');
      setIsSubmitting(false);
    }
  };

  // Handle 1-Click Google SSO
  const handleGoogleSSO = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const googlePayload = {
      email: 'priya.sharma@lifelink.in',
      fullName: 'Priya Sharma (Emergency Responder)',
      googleId: 'google_oauth_984128509128',
      idToken: 'demo_google_id_token_xyz',
    };

    const res = await loginWithGoogle(googlePayload);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.error || 'Google SSO failed.');
      setIsSubmitting(false);
    }
  };

  // Handle Android Biometrics / Hardware Passkey
  const handleBiometrics = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await loginWithBiometrics();
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.error || 'Biometric authentication failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans select-none">
      
      {/* 1. PROFESSIONAL ARCHITECTURAL COMMAND CENTER BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 animate-[pulse_10s_ease-in-out_infinite] transition-transform duration-[15000ms] pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80')`
        }}
      />

      {/* 2. RADIAL GRADIENT VIGNETTE OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,6,7,0.4)_0%,rgba(5,6,7,0.95)_75%,#050607_100%)] pointer-events-none" />

      {/* 3. TACTICAL GRID PATTERN OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(#1D252C_1px,transparent_1px)] [background-size:32px_32px] opacity-60 pointer-events-none" />

      {/* 4. HIGH-TECH NEON AMBIENT GLOWS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#36C5F0]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-[#32D583]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* 5. TACTICAL RADAR BEAM SWEEP ANIMATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#36C5F0]/10 pointer-events-none animate-[spin_20s_linear_infinite]">
        <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#36C5F0]/10 to-transparent rounded-tl-full" />
      </div>

      {/* Header Info with ENLARGED BORDERLESS LOGO */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center relative">
        
        {/* Live Telemetry Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b0e11]/80 border border-[#36C5F0]/30 text-[11px] font-mono text-[#36C5F0] mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(54,197,240,0.2)]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#36C5F0]" />
          <span>NDRF & SDRF MISSION COMMAND ACTIVE</span>
        </div>

        <div className="flex items-center justify-center gap-3.5 mb-2">
          <div className="relative w-16 h-16 flex items-center justify-center drop-shadow-[0_0_25px_rgba(54,197,240,0.6)] transition-transform hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="LifeLink AI Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-3xl font-black text-white tracking-wider font-mono">
            LIFELINK <span className="text-[#36C5F0]">AI</span>
          </span>
        </div>
        
        <h2 className="text-lg sm:text-xl font-extrabold text-[#F5F7F8] tracking-tight uppercase">
          SECURE PORTAL AUTHENTICATION
        </h2>
        <p className="mt-1 text-xs text-[#8f9194] font-mono">
          AES-256 GCM ENCRYPTED • ROLE-BASED ACCESS CONTROL (RBAC)
        </p>
      </div>

      {/* Main Glassmorphic Auth Box */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
        <div className="bg-[#0b0e11]/85 backdrop-blur-2xl py-6 sm:py-8 px-4 sm:px-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#1D252C] rounded-2xl relative">
          
          {/* Method Tabs Bar */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#050607]/90 rounded-xl border border-[#1D252C] mb-6 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => { setAuthMethod('PASSWORD'); setErrorMsg(null); }}
              className={`py-3 px-1 rounded-lg font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                authMethod === 'PASSWORD'
                  ? 'bg-[#36C5F0] text-black shadow-[0_0_12px_rgba(54,197,240,0.4)]'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>KEY</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('SMS_OTP'); setErrorMsg(null); }}
              className={`py-3 px-1 rounded-lg font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                authMethod === 'SMS_OTP'
                  ? 'bg-[#32D583] text-black shadow-[0_0_12px_rgba(50,213,131,0.4)]'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>SMS OTP</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('GOOGLE'); setErrorMsg(null); }}
              className={`py-3 px-1 rounded-lg font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                authMethod === 'GOOGLE'
                  ? 'bg-[#4C8DFF] text-white shadow-[0_0_12px_rgba(76,141,255,0.4)]'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>GOOGLE</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('PASSKEY'); setErrorMsg(null); }}
              className={`py-3 px-1 rounded-lg font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                authMethod === 'PASSKEY'
                  ? 'bg-[#8B7CFF] text-black shadow-[0_0_12px_rgba(139,124,255,0.4)]'
                  : 'text-[#8f9194] hover:text-white'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>PASSKEY</span>
            </button>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF3B30]/15 border border-[#FF3B30] text-xs font-mono text-[#FF3B30] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* METHOD 1: STANDARD JWT PASSWORD */}
          {authMethod === 'PASSWORD' && (
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              
              {/* Role Presets */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#8f9194] mb-2 uppercase">
                  AUTHORIZED INDIAN AGENCY PRESETS (1-CLICK TEST):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {(['DISPATCHER', 'RESPONDER', 'CITIZEN', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleSelectRolePreset(r)}
                      className={`py-2.5 px-3 rounded-xl border transition-all flex items-center justify-between min-h-[44px] ${
                        selectedRole === r
                          ? 'bg-[#36C5F0]/15 border-[#36C5F0] text-[#36C5F0] font-bold'
                          : 'bg-[#050607]/80 border-[#1D252C] text-[#8f9194] hover:text-white'
                      }`}
                    >
                      <span>{r === 'DISPATCHER' ? 'NDRF COMMAND' : r === 'RESPONDER' ? 'SDRF RESCUE' : r === 'CITIZEN' ? 'SURVIVOR' : 'NDMA ADMIN'}</span>
                      {selectedRole === r && <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                  OFFICIAL EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. commander.rajesh@ndrf.gov.in"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#050607]/90 border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0] font-mono min-h-[48px]"
                  />
                  <Mail className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                  ACCESS PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#050607]/90 border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0] font-mono min-h-[48px]"
                  />
                  <Lock className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#36C5F0] text-black font-extrabold text-xs sm:text-sm hover:bg-[#36C5F0]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(54,197,240,0.35)] font-mono min-h-[48px]"
              >
                {isSubmitting ? <span>VERIFYING JWT CREDS...</span> : <span>AUTHENTICATE & ENTER PORTAL</span>}
              </button>
            </form>
          )}

          {/* METHOD 2: SMS OTP EMERGENCY LOGIN */}
          {authMethod === 'SMS_OTP' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                      INDIAN EMERGENCY PHONE NUMBER (+91)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98200 12345"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#050607]/90 border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono min-h-[48px]"
                      />
                      <Phone className="w-4 h-4 text-[#8f9194] absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#32D583] text-black font-extrabold text-xs sm:text-sm hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,213,131,0.35)] font-mono min-h-[48px]"
                  >
                    {isSubmitting ? <span>DISPATCHING SMS...</span> : <span>SEND EMERGENCY SMS CODE (+91)</span>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  {demoCodeNotice && (
                    <div className="p-3 rounded-xl bg-[#32D583]/15 border border-[#32D583] text-xs font-mono text-[#32D583] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{demoCodeNotice}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                      6-DIGIT VERIFICATION CODE
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center py-3 rounded-xl bg-[#050607]/90 border border-[#1D252C] text-lg text-white font-mono tracking-widest focus:outline-none focus:border-[#32D583] min-h-[48px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#32D583] text-black font-extrabold text-xs sm:text-sm hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,213,131,0.35)] font-mono min-h-[48px]"
                  >
                    {isSubmitting ? <span>VERIFYING CODE...</span> : <span>VERIFY & ENTER PORTAL</span>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* METHOD 3: GOOGLE OAUTH 1-CLICK SSO */}
          {authMethod === 'GOOGLE' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#4C8DFF]/15 text-[#4C8DFF] flex items-center justify-center mx-auto mb-2 border border-[#4C8DFF]/30">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono">1-CLICK GOOGLE SSO AUTHENTICATION</h3>
              <p className="text-xs text-[#8f9194]">
                Instant identity verification via Google OpenID Connect for Indian emergency personnel.
              </p>

              <button
                type="button"
                onClick={handleGoogleSSO}
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 rounded-xl bg-[#4C8DFF] text-white font-extrabold text-xs sm:text-sm hover:bg-[#4C8DFF]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(76,141,255,0.4)] font-mono min-h-[48px]"
              >
                {isSubmitting ? <span>CONNECTING TO GOOGLE...</span> : <span>CONTINUE WITH GOOGLE SSO</span>}
              </button>
            </div>
          )}

          {/* METHOD 4: ANDROID BIOMETRICS / HARDWARE PASSKEY */}
          {authMethod === 'PASSKEY' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] flex items-center justify-center mx-auto mb-2 border border-[#8B7CFF]/30">
                <Fingerprint className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono">ANDROID BIOMETRIC & FIDO2 PASSKEY</h3>
              <p className="text-xs text-[#8f9194]">
                Touch Android fingerprint sensor or use Face ID hardware token to unlock mission portal.
              </p>

              <button
                type="button"
                onClick={handleBiometrics}
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 rounded-xl bg-[#8B7CFF] text-black font-extrabold text-xs sm:text-sm hover:bg-[#8B7CFF]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,124,255,0.4)] font-mono min-h-[48px]"
              >
                {isSubmitting ? <span>SCANNING FINGERPRINT...</span> : <span>SCAN FINGERPRINT / PASSKEY</span>}
              </button>
            </div>
          )}

          {/* Footer Link */}
          <div className="mt-6 pt-4 border-t border-[#1D252C] text-center text-xs font-mono text-[#8f9194]">
            Need new responder credentials?{' '}
            <Link href="/register" className="text-[#36C5F0] font-bold hover:underline">
              Request Account Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
