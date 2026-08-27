'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck, Key, Radio, Building, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('DISPATCHER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Fill Presets for testing RBAC Roles
  const handleSelectRolePreset = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);

    switch (role) {
      case 'DISPATCHER':
        setEmail('dispatcher@lifelink.ai');
        setPassword('SecurePass123!');
        break;
      case 'RESPONDER':
        setEmail('responder1@lifelink.ai');
        setPassword('SecurePass123!');
        break;
      case 'CITIZEN':
        setEmail('citizen@lifelink.ai');
        setPassword('SecurePass123!');
        break;
      case 'ADMIN':
        setEmail('admin@lifelink.ai');
        setPassword('SecurePass123!');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-[radial-gradient(#1D252C_1px,transparent_1px)] [background-size:24px_24px]">
      
      {/* Neon Atmospheric Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#36C5F0]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-[#FF3B30]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Brand Info */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-xl bg-[#0b0e11] border border-[#36C5F0]/40 p-2 shadow-[0_0_20px_rgba(54,197,240,0.3)] flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="LifeLink AI Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-black text-white tracking-wider font-mono">
            LIFELINK <span className="text-[#36C5F0]">AI</span>
          </span>
        </div>
        
        <h2 className="text-xl font-extrabold text-[#F5F7F8] tracking-tight">
          MISSION COMMAND PORTAL AUTHENTICATION
        </h2>
        <p className="mt-1 text-xs text-[#8f9194] font-mono">
          AES-256 ENCRYPTED • ROLE-BASED ACCESS CONTROL (RBAC)
        </p>
      </div>

      {/* Main Glassmorphic Login Form Box */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#0b0e11]/90 backdrop-blur-xl py-8 px-6 shadow-2xl border border-[#1D252C] rounded-2xl sm:px-10 relative">
          
          {/* Role Preset Quick Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-mono font-bold text-[#8f9194] mb-2 uppercase">
              SELECT AUTHORIZED RBAC ROLE PRESET:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {(['DISPATCHER', 'RESPONDER', 'CITIZEN', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSelectRolePreset(r)}
                  className={`py-2 px-3 rounded-lg border transition-all flex items-center justify-between ${
                    selectedRole === r
                      ? 'bg-[#36C5F0]/15 border-[#36C5F0] text-[#36C5F0] font-bold shadow-[0_0_10px_rgba(54,197,240,0.2)]'
                      : 'bg-[#050607] border-[#1D252C] text-[#8f9194] hover:text-white'
                  }`}
                >
                  <span>{r}</span>
                  {selectedRole === r && <UserCheck className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Error Alert Box */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#FF3B30]/15 border border-[#FF3B30] text-xs font-mono text-[#FF3B30] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                ORGANIZATION EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dispatcher@lifelink.ai"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0] font-mono"
                />
                <Mail className="w-4 h-4 text-[#8f9194] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#c5c6ca] mb-1">
                SECURE ACCESS PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-sm text-white placeholder-[#8f9194] focus:outline-none focus:border-[#36C5F0] font-mono"
                />
                <Lock className="w-4 h-4 text-[#8f9194] absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <label className="flex items-center gap-2 text-[#8f9194] cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-[#050607] border-[#1D252C] text-[#36C5F0]" />
                <span>Keep JWT session active</span>
              </label>
              <a href="#" className="text-[#36C5F0] hover:underline">Forgot key?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 rounded-lg bg-[#36C5F0] text-black font-bold text-sm hover:bg-[#36C5F0]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(54,197,240,0.3)] font-mono"
            >
              {isSubmitting ? (
                <span>VERIFYING JWT CREDS...</span>
              ) : (
                <>
                  <span>AUTHENTICATE & ENTER PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link to Register */}
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
