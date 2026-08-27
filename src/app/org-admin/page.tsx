'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { KPICard } from '@/components/common/KPICard';

import {
  Building2,
  Users,
  Shield,
  Key,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

export default function OrgAdminPage() {
  const [agencies, setAgencies] = useState([
    { id: 'ORG-01', name: 'National Disaster Response Force (NDRF)', role: 'PRIMARY DISPATCH', personnel: 450, scope: 'Level 5 Full Access', status: 'ACTIVE' },
    { id: 'ORG-02', name: 'State Emergency Medical Services (SEMS)', role: 'MEDICAL EVAC', personnel: 320, scope: 'Level 4 Triage Access', status: 'ACTIVE' },
    { id: 'ORG-03', name: 'Municipal Coast Guard & Raft Unit', role: 'WATER RESCUE', personnel: 180, scope: 'Level 4 Field Access', status: 'ACTIVE' },
    { id: 'ORG-04', name: 'Civil Defense Volunteer Corps', role: 'LOCAL RELIEF', personnel: 470, scope: 'Level 2 Logistics Access', status: 'ACTIVE' }
  ]);

  const handleProvisionAgency = () => {
    alert('Opening Agency Provisioning Wizard...');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#36C5F0]" />
              <h1 className="text-lg font-bold text-[#F5F7F8]">Organization & Administration Console</h1>
            </div>
            <p className="text-xs text-[#8f9194] mt-0.5 font-sans">
              Inter-agency RBAC access management, personnel credentialing & multi-department emergency command scope configuration.
            </p>
          </div>

          <button
            onClick={handleProvisionAgency}
            className="px-3.5 py-1.5 rounded-lg bg-[#36C5F0] text-black font-bold text-xs hover:bg-[#36C5F0]/90 transition-all flex items-center gap-1.5 font-mono shadow-[0_0_12px_rgba(54,197,240,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>PROVISION NEW AGENCY</span>
          </button>
        </div>

        {/* Top KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="REGISTERED AGENCIES"
            value="12 AGENCIES"
            subtitle="Disaster, Medical, Fire, Coast Guard"
            icon={<Building2 className="w-5 h-5" />}
            accentColor="cyan"
          />
          <KPICard
            title="TOTAL PERSONNEL"
            value="1,420 OFFICERS"
            subtitle="Biometrically Verified"
            icon={<Users className="w-5 h-5" />}
            accentColor="green"
          />
          <KPICard
            title="SECURITY COMPLIANCE"
            value="100% CERTIFIED"
            subtitle="HIPAA & Disaster Protocol Compliant"
            icon={<Shield className="w-5 h-5" />}
            accentColor="violet"
          />
          <KPICard
            title="ACTIVE ACCESS KEYS"
            value="48 API KEYS"
            subtitle="Hardware HSM Signed"
            icon={<Key className="w-5 h-5" />}
            accentColor="amber"
          />
        </div>

        {/* Agency Directory List */}
        <div className="bg-[#0b0e11] border border-[#1D252C] rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D252C]">
            <h3 className="text-sm font-bold text-[#F5F7F8] font-mono">INTER-AGENCY COMMAND DIRECTORY</h3>
            <span className="text-xs font-mono text-[#32D583]">ALL AGENCIES SYNCHRONIZED</span>
          </div>

          <div className="space-y-3">
            {agencies.map((agency) => (
              <div
                key={agency.id}
                className="p-4 bg-[#050607] border border-[#1D252C] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#36C5F0]">{agency.id}</span>
                    <h4 className="text-sm font-bold text-white">{agency.name}</h4>
                  </div>
                  <p className="text-xs text-[#8f9194] font-mono">{agency.role} • {agency.personnel} Active Responders</p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-[#121d24] text-white border border-[#2c363e]">
                    {agency.scope}
                  </span>
                  <button
                    onClick={() => alert(`Managing credentials for ${agency.name}...`)}
                    className="px-3 py-1.5 rounded-lg bg-[#36C5F0]/20 text-[#36C5F0] hover:bg-[#36C5F0]/30 font-bold transition-all"
                  >
                    MANAGE ACCESS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
