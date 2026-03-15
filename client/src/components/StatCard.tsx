import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps { 
  label: string; 
  value: number; 
  icon: LucideIcon; 
  color?: string; 
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color = 'var(--color-brand)', onClick, isActive }) => (
  <div 
    onClick={onClick}
    className={`card-technical flex flex-col gap-4 cursor-pointer transition-all ${isActive ? 'ring-1 ring-brand bg-white/10' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
  >
    <div className="flex justify-between items-start">
      <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">{label}</span>
      <Icon size={16} style={{ color }} />
    </div>
    <div className="stat-value leading-none" style={{ color }}>{value.toString().padStart(2, '0')}</div>
  </div>
);
