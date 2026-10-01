import React from 'react';
import {
  LayoutDashboard,
  Ship,
  Navigation,
  Sparkles,
  BarChart3,
  Sliders,
  Bell,
  FileText,
  Settings,
  Database,
  Activity,
  Wrench,
  Users,
  History,
  Server,
  LogOut,
  Anchor
} from 'lucide-react';
import { ScreenId } from '../../store/useFleetStore';
import { ThemeToggle } from '../common/ThemeToggle';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  activeAlertsCount
}) => {
  const primaryNavItems = [
    { id: 'screen_2_fleet_overview' as ScreenId, label: 'Fleet Overview', icon: LayoutDashboard, badge: null },
    { id: 'screen_3_vessel_details' as ScreenId, label: 'Vessel Details', icon: Ship, badge: null },
    { id: 'screen_4_voyages' as ScreenId, label: 'Voyages & Cargo', icon: Navigation, badge: null },
    { id: 'screen_5_optimization_studio' as ScreenId, label: 'Optimization Studio', icon: Sparkles, badge: 'Quantum' },
    { id: 'screen_6_optimization_results' as ScreenId, label: 'Optimization Results', icon: BarChart3, badge: null },
    { id: 'screen_7_scenario_simulator' as ScreenId, label: 'Scenario Simulator', icon: Sliders, badge: null },
    { id: 'screen_8_alerts' as ScreenId, label: 'Alerts & Risks', icon: Bell, badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : null },
    { id: 'screen_9_reports' as ScreenId, label: 'Reports & Analytics', icon: FileText, badge: null }
  ];

  const supportingNavItems = [
    { id: 'screen_11_live_integrations' as ScreenId, label: 'Live Data & APIs', icon: Database, badge: 'Live' },
    { id: 'screen_12_vessel_telemetry' as ScreenId, label: 'Vessel Telemetry', icon: Activity, badge: null },
    { id: 'screen_13_maintenance' as ScreenId, label: 'Predictive Maint.', icon: Wrench, badge: null },
    { id: 'screen_15_optimization_history' as ScreenId, label: 'Run History', icon: History, badge: null },
    { id: 'screen_16_system_health' as ScreenId, label: 'System Monitoring', icon: Server, badge: '99.9%' },
    { id: 'screen_14_users' as ScreenId, label: 'User Management', icon: Users, badge: null },
    { id: 'screen_10_settings' as ScreenId, label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <aside className="w-64 bg-slate-950/95 light:bg-white/95 border-r border-slate-800/90 light:border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-50 transition-colors">
      {/* Brand Logo Header */}
      <div>
        <div
          onClick={() => onSelectScreen('screen_2_fleet_overview')}
          className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/80 light:border-slate-200 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Anchor className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white light:text-slate-900 flex items-center gap-1.5">
              <span>Maritime Optimizer</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 light:bg-cyan-100 light:text-cyan-700 border border-cyan-500/30 light:border-cyan-300 font-semibold">QIEA</span>
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500 font-medium">Green Fleet Intelligence</div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {/* Main Modules */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 light:text-slate-500">
              Operations Center
            </div>
            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 light:from-cyan-50 light:to-blue-50/50 text-cyan-400 light:text-cyan-700 border border-cyan-500/30 light:border-cyan-200 shadow-sm font-semibold'
                        : 'text-slate-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-slate-900/80 light:hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400 light:text-cyan-600' : 'text-slate-400 light:text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          item.badge === 'Quantum'
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 light:from-cyan-100 light:to-purple-100 text-cyan-300 light:text-purple-700 border border-cyan-500/40 light:border-purple-300'
                            : 'bg-rose-950 light:bg-rose-100 text-rose-300 light:text-rose-700 border border-rose-500/40 light:border-rose-300 animate-pulse'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Supporting / Technical Systems */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 light:text-slate-500">
              Intelligence & Platform
            </div>
            <nav className="space-y-1">
              {supportingNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 light:from-cyan-50 light:to-blue-50/50 text-cyan-400 light:text-cyan-700 border border-cyan-500/30 light:border-cyan-200 shadow-sm font-semibold'
                        : 'text-slate-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-slate-900/80 light:hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400 light:text-cyan-600' : 'text-slate-400 light:text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 light:bg-emerald-100 text-emerald-400 light:text-emerald-700 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Controls: Theme Mode & Logout */}
      <div className="p-3 border-t border-slate-800/80 light:border-slate-200 space-y-1.5">
        {/* Theme Toggle Button in Sidebar */}
        <ThemeToggle variant="sidebar" />

        {/* Sign out */}
        <button
          onClick={() => onSelectScreen('screen_1_login')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 light:text-slate-600 hover:text-rose-400 light:hover:text-rose-600 hover:bg-rose-950/30 light:hover:bg-rose-50 transition-all border border-transparent hover:border-rose-900/50 light:hover:border-rose-200"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="h-4 w-4" />
            <span>Sign Out / Switch</span>
          </div>
          <span className="text-[10px] text-slate-500 light:text-slate-400 font-mono">v2.4.0</span>
        </button>
      </div>
    </aside>
  );
};
