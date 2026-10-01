import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositiveChangeGood?: boolean;
  subtext?: string;
  icon?: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'cyan' | 'purple' | 'rose';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  isPositiveChangeGood = false,
  subtext,
  icon: Icon,
  color = 'cyan',
  onClick
}) => {
  const isPositive = change?.startsWith('+');
  const isGood = isPositive ? isPositiveChangeGood : !isPositiveChangeGood;

  const colorStyles = {
    cyan: 'from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400',
    emerald: 'from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-transparent border-amber-500/30 text-amber-400',
    purple: 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400',
    rose: 'from-rose-500/20 to-transparent border-rose-500/30 text-rose-400'
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:border-slate-600 ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
    >
      <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${colorStyles[color]} opacity-40 blur-xl pointer-events-none`} />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 ${colorStyles[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              isGood ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </span>
        )}
        {subtext && <span className="text-slate-400">{subtext}</span>}
      </div>
    </div>
  );
};
