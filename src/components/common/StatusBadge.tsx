import React from 'react';
import { SeverityLevel, IncidentStatus, ConnectivityTransport } from '@/lib/types';
import { AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert, Radio, Wifi, Smartphone, Cpu } from 'lucide-react';

interface StatusBadgeProps {
  type: 'severity' | 'status' | 'transport';
  value: SeverityLevel | IncidentStatus | ConnectivityTransport | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs font-mono' : 'px-3 py-1 text-sm font-mono';

  if (type === 'severity') {
    switch (value) {
      case 'CRITICAL':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 font-semibold animate-pulse-subtle ${sizeClasses}`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#1e293b] text-[#f8fafc] border border-[#334155] font-semibold ${sizeClasses}`}>
            <AlertCircle className="w-3.5 h-3.5 text-[#0ea5e9]" />
            HIGH
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#1e293b] text-[#94a3b8] border border-[#334155] ${sizeClasses}`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0ea5e9]" />
            {String(value)}
          </span>
        );
    }
  }

  if (type === 'transport') {
    return (
      <span className={`inline-flex items-center gap-1 rounded bg-[#1e293b] text-[#0ea5e9] border border-[#334155] ${sizeClasses}`}>
        <Radio className="w-3 h-3 text-[#0ea5e9]" />
        {String(value).replace('_', ' ')}
      </span>
    );
  }

  // General Status
  return (
    <span className={`inline-flex items-center gap-1 rounded-md bg-[#1e293b] text-[#cbd5e1] border border-[#334155] ${sizeClasses}`}>
      <ShieldAlert className="w-3 h-3 text-[#0ea5e9]" />
      {String(value).replace('_', ' ')}
    </span>
  );
};
