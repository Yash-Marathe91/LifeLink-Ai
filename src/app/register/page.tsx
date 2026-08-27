'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, User, Phone, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#050607] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden bg-[radial-gradient(#1D252C_1px,transparent_1px)] [background-size:24px_24px]">
      
      {/* Glow Effects */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-[#32D583]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-[#36C5F0]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Info */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="relative w-10 h-10 rounded-xl bg-[#0b0e11] border border-[#32D583]/40 p-2 shadow-[0_0_15px_rgba(50,213,131,0.3)] flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="LifeLink AI Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-black text-white tracking-wider font-mono">
            LIFELINK <span className="text-[#32D583]">AI</span>
          </span>
        </div>
        
        <h2 className="text-lg font-extrabold text-[#F5F7F8] tracking-tight">
          REGISTER NEW EMERGENCY ACCOUNT
        </h2>
        <p className="text-xs text-[#8f9194] font-mono mt-0.5">
          CITIZEN & RESPONDER PROFILE PROVISIONING
        </p>
      </div>

      {/* Main Form Card */}
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#0b0e11]/90 backdrop-blur-xl py-6 px-6 shadow-2xl border border-[#1D252C] rounded-2xl sm:px-8">
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#FF3B30]/15 border border-[#FF3B30] text-xs font-mono text-[#FF3B30] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                FULL LEGAL NAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Commander Sarah Jenkins"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono"
                />
                <User className="w-4 h-4 text-[#8f9194] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.jenkins@lifelink.ai"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono"
                />
                <Mail className="w-4 h-4 text-[#8f9194] absolute left-3 top-2.5" />
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
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono"
                />
                <Lock className="w-4 h-4 text-[#8f9194] absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 800-555-0199"
                    className="w-full pl-9 pr-2 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white placeholder-[#8f9194] focus:outline-none focus:border-[#32D583] font-mono"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#8f9194] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                  SYSTEM ROLE
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-xs text-white focus:outline-none focus:border-[#32D583] font-mono"
                >
                  <option value="CITIZEN">CITIZEN</option>
                  <option value="RESPONDER">RESPONDER</option>
                  <option value="DISPATCHER">DISPATCHER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            {/* Medical Encryption Consent Checkbox */}
            <div className="p-3 bg-[#121d24] rounded-lg border border-[#1D252C] text-xs font-mono space-y-1.5 mt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={encryptedConsent}
                  onChange={(e) => setEncryptedConsent(e.target.checked)}
                  className="mt-0.5 rounded bg-[#050607] border-[#1D252C] text-[#32D583]"
                />
                <span className="text-[#c5c6ca] leading-tight">
                  Consent to AES-256 GCM local encryption of sensitive medical & emergency contact data.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-2.5 rounded-lg bg-[#32D583] text-black font-bold text-xs hover:bg-[#32D583]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(50,213,131,0.3)] font-mono"
            >
              {isSubmitting ? (
                <span>REGISTERING ACCOUNT...</span>
              ) : (
                <>
                  <span>CREATE ACCOUNT & SIGN IN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-3 border-t border-[#1D252C] text-center text-xs font-mono text-[#8f9194]">
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
