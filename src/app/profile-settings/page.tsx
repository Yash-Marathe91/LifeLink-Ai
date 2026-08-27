'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  User,
  Shield,
  Lock,
  Heart,
  QrCode,
  CheckCircle2,
  Radio,
  Sliders,
  Save,
  Download
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const [meshSharing, setMeshSharing] = useState(true);
  const [backgroundBeacon, setBackgroundBeacon] = useState(true);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#32D583]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Profile, Medical & Privacy Settings</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Manage your emergency medical triage ID, off-grid mesh beaconing privacy & encrypted credentials.
            </p>
          </div>

          {savedSuccess && (
            <div className="px-3 py-1.5 rounded-lg bg-[#32D583]/20 border border-[#32D583] text-[#32D583] text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>PROFILE SAVED!</span>
            </div>
          )}
        </div>

        {/* Citizen Medical Emergency ID Card */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#FF3B30]" />
              <h3 className="text-base font-bold text-white font-mono">CITIZEN EMERGENCY MEDICAL ID</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#32D583]/20 text-[#32D583] text-xs font-mono font-bold">
              VERIFIED CITIZEN
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#8f9194] block mb-1">FULL NAME:</label>
                <input
                  type="text"
                  defaultValue="Priya Sharma"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#050607] border border-[#1D252C] text-white focus:outline-none focus:border-[#32D583]"
                />
              </div>

              <div>
                <label className="text-[#8f9194] block mb-1">BLOOD GROUP:</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#050607] border border-[#1D252C] text-white focus:outline-none focus:border-[#32D583]"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                </select>
              </div>

              <div>
                <label className="text-[#8f9194] block mb-1">KNOWN ALLERGIES:</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#050607] border border-[#1D252C] text-white focus:outline-none focus:border-[#32D583]"
                />
              </div>

              <div>
                <label className="text-[#8f9194] block mb-1">CHRONIC CONDITIONS:</label>
                <input
                  type="text"
                  defaultValue="Asthma (Uses Inhaler)"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#050607] border border-[#1D252C] text-white focus:outline-none focus:border-[#32D583]"
                />
              </div>
            </div>

            {/* Privacy & BLE Mesh Toggles */}
            <div className="pt-4 border-t border-[#1D252C] space-y-3">
              <h4 className="text-xs font-bold text-[#36C5F0]">OFF-GRID MESH PRIVACY CONTROLS</h4>

              <div className="flex items-center justify-between p-3 bg-[#050607] rounded-lg border border-[#1D252C]">
                <div>
                  <span className="text-white font-bold block">Allow Offline BLE Mesh Beacon Relay</span>
                  <span className="text-[#8f9194] text-[11px] font-sans">Enables phone to anonymously hop emergency signals during cell outage.</span>
                </div>
                <input
                  type="checkbox"
                  checked={meshSharing}
                  onChange={(e) => setMeshSharing(e.target.checked)}
                  className="w-5 h-5 accent-[#32D583] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1D252C]">
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#32D583] text-black font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(50,213,131,0.3)] min-h-[48px]"
              >
                <Save className="w-4 h-4" />
                <span>SAVE CHANGES</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </AppShell>
  );
}
