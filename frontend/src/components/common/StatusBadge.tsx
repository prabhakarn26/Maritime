import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status ? status.toLowerCase() : '';
  
  let bgClass = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let dotClass = 'bg-slate-400';

  if (s.includes('on route') || s.includes('active') || s.includes('healthy') || s.includes('verified') || s.includes('completed') || s.includes('operational')) {
    bgClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    dotClass = 'bg-emerald-400 animate-pulse';
  } else if (s.includes('at port') || s.includes('upcoming') || s.includes('info') || s.includes('standard')) {
    bgClass = 'bg-blue-950/80 text-blue-300 border-blue-500/40';
    dotClass = 'bg-blue-400';
  } else if (s.includes('warning') || s.includes('delayed') || s.includes('fair') || s.includes('review')) {
    bgClass = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
    dotClass = 'bg-amber-400';
  } else if (s.includes('critical') || s.includes('severe') || s.includes('infeasible') || s.includes('danger')) {
    bgClass = 'bg-rose-950/80 text-rose-300 border-rose-500/40';
    dotClass = 'bg-rose-400 animate-ping';
  } else if (s === 'a') {
    bgClass = 'bg-emerald-950 text-emerald-300 border-emerald-400 font-bold';
    dotClass = 'bg-emerald-400';
  } else if (s === 'b') {
    bgClass = 'bg-teal-950 text-teal-300 border-teal-400 font-bold';
    dotClass = 'bg-teal-400';
  } else if (s === 'c') {
    bgClass = 'bg-amber-950 text-amber-300 border-amber-400 font-bold';
    dotClass = 'bg-amber-400';
  } else if (s === 'd' || s === 'e') {
    bgClass = 'bg-rose-950 text-rose-300 border-rose-400 font-bold';
    dotClass = 'bg-rose-400';
  }

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3.5 py-1.5 font-medium' : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${bgClass} ${sizeClass} transition-all`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`}></span>
      {status}
    </span>
  );
};
