import React from 'react';
import { Search, Bell, Shield, Radio, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { ScreenId } from '../../store/useFleetStore';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  currentUser: User | null;
  lastTelemetryTime: string;
  activeAlertsCount: number;
  onNavigateToAlerts: () => void;
  onNavigateToSystemHealth: () => void;
  onSearch?: (query: string) => void;
  onNavigateToScreen: (screen: ScreenId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  lastTelemetryTime,
  activeAlertsCount,
  onNavigateToAlerts,
  onNavigateToSystemHealth,
  onNavigateToScreen
}) => {
  return (
    <header className="h-16 border-b border-slate-800 light:border-slate-200 bg-slate-950/80 light:bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 light:text-slate-500" />
          <input
            type="text"
            placeholder="Search vessels, voyages, ports, routes (e.g. MV Ocean Star)..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900/90 light:bg-slate-100 border border-slate-700/70 light:border-slate-300 text-xs text-slate-200 light:text-slate-800 placeholder-slate-500 light:placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Live Badge, Quick Optimization, Theme Toggle, Alerts, Profile */}
      <div className="flex items-center gap-3.5">
        {/* Live Data Badge */}
        <div
          onClick={onNavigateToSystemHealth}
          className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 light:bg-emerald-50/80 border border-slate-700/80 light:border-emerald-200 hover:border-emerald-500/50 transition-all group"
          title="Click to view System Health & Data Ingestion"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-emerald-400 light:text-emerald-700 font-medium flex items-center gap-1.5">
            <Radio className="h-3 w-3 animate-pulse" />
            Live Feed: <span className="text-slate-300 light:text-slate-700 font-mono text-[11px]">{lastTelemetryTime}</span>
          </span>
        </div>

        {/* Quick Launch Quantum Optimization */}
        <button
          onClick={() => onNavigateToScreen('screen_5_optimization_studio')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Optimize Fleet</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <ThemeToggle variant="compact" />

        {/* Notifications / Alerts Bell */}
        <button
          onClick={onNavigateToAlerts}
          className="relative p-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700/70 light:border-slate-200 text-slate-300 light:text-slate-700 hover:text-white light:hover:text-cyan-600 hover:border-slate-600 light:hover:border-cyan-300 transition-all shadow-sm"
          title="Operational Alerts"
        >
          <Bell className="h-4 w-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div
          onClick={() => onNavigateToScreen('screen_14_users')}
          className="flex items-center gap-2.5 pl-3 border-l border-slate-800 light:border-slate-200 cursor-pointer group"
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt="User avatar"
            className="h-8 w-8 rounded-full border border-cyan-500/40 light:border-cyan-600/40 object-cover group-hover:border-cyan-400 transition-all"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-white light:text-slate-900 group-hover:text-cyan-400 light:group-hover:text-cyan-600 transition-colors">
              {currentUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500 flex items-center gap-1">
              <Shield className="h-2.5 w-2.5 text-cyan-400 light:text-cyan-600" />
              {currentUser?.role || 'Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
