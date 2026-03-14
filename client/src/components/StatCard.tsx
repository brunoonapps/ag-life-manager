import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps { label: string; value: number; icon: LucideIcon; color?: string; }
export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color = 'var(--color-brand)' }) => (
  <div className="card-technical flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <span className="font-mono text-xs text-white/50 uppercase tracking-widest">{label}</span>
      <Icon size={18} style={{ color }} />
    </div>
    <div className="stat-value" style={{ color }}>{value.toString().padStart(2, '0')}</div>
  </div>
);
