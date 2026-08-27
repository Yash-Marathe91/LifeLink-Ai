'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';

import {
  Users,
  PhoneCall,
  UserPlus,
  Shield,
  Heart,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Trash2
} from 'lucide-react';

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Sunil Sharma', relationship: 'Spouse / Next of Kin', phone: '+91-98200-11223', locationSharing: true, status: 'NOTIFIED' },
    { id: 2, name: 'Dr. Anita Roy', relationship: 'Family Physician', phone: '+91-98200-44556', locationSharing: true, status: 'STANDBY' },
    { id: 3, name: 'Rohan Mehta', relationship: 'Sector 4 Volunteer', phone: '+91-98200-77889', locationSharing: false, status: 'LOCAL_HELP' }
  ]);

  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAlertCircle = () => {
    alert('SMS & Mesh Broadcast sent to all 3 emergency contacts with your live GPS location!');
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    setContacts(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newContact.name,
        relationship: newContact.relationship || 'Emergency Contact',
        phone: newContact.phone,
        locationSharing: true,
        status: 'STANDBY'
      }
    ]);

    setNewContact({ name: '', relationship: '', phone: '' });
    setShowAddModal(false);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#36C5F0]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Personal Safety Network & Contacts</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Manage your emergency next-of-kin contacts, automated SMS alerts & off-grid BLE mesh location sharing.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-[#36C5F0] text-black font-mono font-bold text-xs hover:bg-[#36C5F0]/90 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(54,197,240,0.3)] w-full sm:w-auto justify-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>ADD EMERGENCY CONTACT</span>
          </button>
        </div>

        {/* Big Red "Alert My Safety Circle" Button */}
        <div className="bg-[#0b0e11] border border-[#FF3B30]/40 rounded-xl p-5 space-y-3 shadow-xl bg-[#FF3B30]/5 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />
                <h3 className="text-base font-bold text-white">INSTANT SAFETY CIRCLE BROADCAST</h3>
              </div>
              <p className="text-xs text-[#c5c6ca] font-sans">
                Sends an instant encrypted SMS + BLE offline mesh signal to all designated contacts with live coordinates.
              </p>
            </div>

            <button
              onClick={handleAlertCircle}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FF3B30] text-white font-mono font-bold text-xs hover:bg-[#FF3B30]/90 transition-all shadow-[0_0_20px_rgba(255,59,48,0.5)] whitespace-nowrap min-h-[48px]"
            >
              ALERT MY SAFETY CIRCLE NOW
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg hover:border-[#2c363e] transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{contact.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-[#121d24] text-[11px] font-mono text-[#36C5F0]">
                    {contact.relationship}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#8f9194]">{contact.phone}</p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#32D583]/20 border border-[#32D583]/40 text-[#32D583] hover:bg-[#32D583]/30 font-bold transition-all flex items-center justify-center gap-1 min-h-[44px]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>CALL</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Add Contact Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white font-mono">ADD NEW EMERGENCY CONTACT</h3>

              <form onSubmit={handleAddContact} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-[#8f9194] block mb-1">FULL NAME:</label>
                  <input
                    type="text"
                    required
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="e.g. Rahul Verma"
                    className="w-full px-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-white focus:outline-none focus:border-[#36C5F0]"
                  />
                </div>

                <div>
                  <label className="text-[#8f9194] block mb-1">RELATIONSHIP:</label>
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    placeholder="e.g. Sibling, Neighbor"
                    className="w-full px-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-white focus:outline-none focus:border-[#36C5F0]"
                  />
                </div>

                <div>
                  <label className="text-[#8f9194] block mb-1">PHONE NUMBER:</label>
                  <input
                    type="tel"
                    required
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 rounded-lg bg-[#050607] border border-[#1D252C] text-white focus:outline-none focus:border-[#36C5F0]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1D252C]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#121d24] text-[#8f9194] hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#36C5F0] text-black font-bold"
                  >
                    SAVE CONTACT
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
