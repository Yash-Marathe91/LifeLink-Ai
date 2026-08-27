'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  UserCheck,
  Truck,
  AlertTriangle,
  BrainCircuit,
  MessageSquare,
  Users,
  Radio,
  BarChart3,
  History,
  Bell,
  Shield,
  UserCog,
  Building2,
  Gamepad2,
  Building,
  FileSpreadsheet,
  Lock,
  Sparkles,
  Smartphone,
  Flame,
  ChevronRight
} from 'lucide-react';

const navigationGroups = [
  {
    group: 'EMERGENCY OPERATIONS',
    items: [
      { name: 'Command Overview', href: '/', icon: LayoutDashboard },
      { name: 'Live Emergency Map', href: '/map', icon: MapPin },
      { name: 'Incident Workspace', href: '/incident-workspace', icon: FileText },
      { name: 'Responder Dashboard', href: '/responder-dashboard', icon: Truck },
      { name: 'Emergency SOS Flow', href: '/sos-flow', icon: AlertTriangle },
      { name: 'Communications Center', href: '/communications', icon: MessageSquare },
      { name: 'Responder Operations', href: '/responder-team', icon: Users },
    ]
  },
  {
    group: 'INTELLIGENCE & RESILIENCE',
    items: [
      { name: 'AI Intelligence Center', href: '/ai-intelligence', icon: BrainCircuit },
      { name: 'Mesh Network Resilience', href: '/network-resilience', icon: Radio },
      { name: 'Facilities & Resources', href: '/facilities', icon: Building },
      { name: 'Analytics & Intelligence', href: '/analytics', icon: BarChart3 },
      { name: 'Reports & AI Briefings', href: '/reports', icon: FileSpreadsheet },
    ]
  },
  {
    group: 'CITIZEN SAFETY SUITE',
    items: [
      { name: 'Citizen Safety Hub', href: '/citizen-safety', icon: UserCheck },
      { name: 'Active SOS Tracking', href: '/active-sos', icon: Smartphone },
      { name: 'Personal Safety Circle', href: '/emergency-contacts', icon: Shield },
      { name: 'Profile & Medical Settings', href: '/profile-settings', icon: UserCog },
    ]
  },
  {
    group: 'ADMIN & COMPLIANCE',
    items: [
      { name: 'Audit & Security Logs', href: '/audit-logs', icon: Lock },
      { name: 'Incident Case History', href: '/incident-history', icon: History },
      { name: 'Notifications & Alerts', href: '/notifications', icon: Bell },
      { name: 'Org Admin Console', href: '/org-admin', icon: Building2 },
      { name: 'Live Drill Controller', href: '/simulation-exercise', icon: Gamepad2 },
      { name: 'Drill Scorecard', href: '/simulation-scorecard', icon: Sparkles },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-[#1e293b] flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1e293b] flex items-center gap-3">
        <img src="/images/logo.png" alt="LifeLink AI Logo" className="w-9 h-9 shrink-0 object-contain" />
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-sm tracking-wider text-[#f8fafc]">LIFELINK AI</h1>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1e293b] text-[#0ea5e9] border border-[#334155]">OS</span>
          </div>
          <p className="text-[11px] font-mono text-[#64748b]">COMMAND CENTER</p>
        </div>
      </div>

      {/* Categorized Navigation Links */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {navigationGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <p className="px-2 text-[10px] font-mono uppercase tracking-wider text-[#64748b] font-semibold mb-1">
              {group.group}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1e293b] text-[#f8fafc] border border-[#334155] font-semibold shadow-sm'
                      : 'text-[#cbd5e1] hover:bg-[#1e293b]/60 hover:text-[#f8fafc]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0ea5e9]' : 'text-[#64748b]'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#0ea5e9] shrink-0" />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Operator Footer */}
      <div className="p-3 border-t border-[#1e293b] bg-[#090d14]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 flex items-center justify-center text-xs font-mono font-bold text-[#0ea5e9]">
              PK
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#f8fafc]">Operator P. Kumar</p>
              <p className="text-[10px] font-mono text-[#64748b]">ID: 994-Alpha</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" title="System Connected" />
        </div>
      </div>
    </aside>
  );
};
