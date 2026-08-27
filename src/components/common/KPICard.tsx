import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
  trend?: string;
  isCritical?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  isCritical = false
}) => {
  return (
    <div
      className={`relative bg-[#0f172a] border rounded-xl p-4 transition-all duration-200 ${
        isCritical
          ? 'border-[#ef4444]/50 bg-[#ef4444]/5 animate-pulse-subtle'
          : 'border-[#1e293b] hover:border-[#334155]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider font-mono">{title}</p>
          <h3 className="text-2xl font-bold font-mono text-[#f8fafc] tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-xs text-[#94a3b8] font-sans">{subtitle}</p>
          )}
          {trend && (
            <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-[#0ea5e9] border border-[#334155]">
              {trend}
            </span>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${isCritical ? 'bg-[#ef4444]/15 text-[#ef4444]' : 'bg-[#1e293b] text-[#0ea5e9]'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
