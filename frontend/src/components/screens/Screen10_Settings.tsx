import React, { useState } from 'react';
import { api } from '../../services/api';
import {
  Building,
  Ship,
  Sparkles,
  Server,
  Save,
  CheckCircle2,
  Sun,
  Moon,
  Laptop,
  Palette
} from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

export const Screen10_Settings: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [orgName, setOrgName] = useState('Maritime Optimizer Global Fleet');
  const [timezone, setTimezone] = useState('(UTC+08:00) Singapore');
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY (e.g. 03 Nov 2026)');
  const [currency, setCurrency] = useState('USD ($)');
  const [defaultAlgorithm, setDefaultAlgorithm] = useState('Quantum-Inspired (QIEA)');
  const [defaultParetoCount, setDefaultParetoCount] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    setIsSaved(true);
    await api.updateSettings({
      organization_name: orgName,
      timezone,
      date_format: dateFormat,
      default_currency: currency,
      default_algorithm: defaultAlgorithm,
      default_pareto_solutions: defaultParetoCount,
      auto_refresh_sec: autoRefresh ? 4 : 0,
      email_notifications: emailNotifs,
      in_app_notifications: inAppNotifs
    });
    setTimeout(() => setIsSaved(false), 2500);
  };

  const themeCards: { id: Theme; title: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'dark',
      title: 'Dark Mode (Oceanic Slate)',
      desc: 'Optimized for low-light bridge operations and reduced eye fatigue with deep oceanic palettes.',
      icon: Moon
    },
    {
      id: 'light',
      title: 'Light Mode (Maritime Daylight)',
      desc: 'Clean, high-contrast maritime executive theme with crisp panels and daylight visibility.',
      icon: Sun
    },
    {
      id: 'system',
      title: 'System Synchronized',
      desc: 'Automatically adapts to match your operating system theme settings in real-time.',
      icon: Laptop
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900 flex items-center gap-2.5">
            <span>Settings & System Configuration</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700 border border-slate-700 light:border-slate-300">
              Admin Config
            </span>
          </h1>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Configure system preferences, appearance & themes, fleet parameters, optimization constraints, emission factors and data refresh intervals.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3 rounded-lg bg-emerald-950/80 light:bg-emerald-50 border border-emerald-500/50 light:border-emerald-300 text-emerald-300 light:text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 light:text-emerald-600" />
          <span>Platform configuration updated and propagated across backend services!</span>
        </div>
      )}

      {/* Appearance & Theme Section */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2.5">
          <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Palette className="h-4 w-4 text-cyan-400 light:text-cyan-600" />
            <span>Appearance & Theme Mode</span>
          </h2>
          <span className="text-[10px] text-cyan-400 light:text-cyan-600 font-mono">
            Active: {resolvedTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeCards.map((card) => {
            const Icon = card.icon;
            const isSelected = theme === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setTheme(card.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 light:bg-slate-50/80 border-slate-800 light:border-slate-200 hover:border-slate-700 light:hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${
                    isSelected 
                      ? 'bg-cyan-500 text-white shadow-md' 
                      : 'bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-white shadow-sm">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white light:text-slate-900">{card.title}</h3>
                <p className="text-xs text-slate-400 light:text-slate-500 mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2x2 Grid matching Frame 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Settings */}
        <div className="glass-panel rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2.5">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building className="h-4 w-4 text-cyan-400 light:text-cyan-600" />
              <span>Organization Settings</span>
            </h2>
            <span className="text-[10px] text-slate-400 light:text-slate-500">Global Defaults</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 light:text-slate-600 block mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 light:text-slate-600 block mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="(UTC+08:00) Singapore">(UTC+08:00) Singapore</option>
                <option value="(UTC+04:00) Dubai">(UTC+04:00) Dubai</option>
                <option value="(UTC+00:00) London / UTC">(UTC+00:00) London / UTC</option>
                <option value="(UTC-05:00) New York">(UTC-05:00) New York</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 light:text-slate-600 block mb-1">Units Format</label>
                <input
                  type="text"
                  disabled
                  value="Metric (MT, km, knots)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/50 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-400 light:text-slate-600"
                />
              </div>
              <div>
                <label className="text-slate-400 light:text-slate-600 block mb-1">Default Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fleet & Vessel Settings */}
        <div className="glass-panel rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2.5">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Ship className="h-4 w-4 text-emerald-400 light:text-emerald-600" />
              <span>Fleet & Vessel Defaults</span>
            </h2>
            <span className="text-[10px] text-emerald-400 light:text-emerald-600 font-mono">Hydrodynamic Models</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 light:text-slate-600 block mb-1">Default Fuel Consumption Model</label>
              <select
                aria-label="Default Fuel Consumption Model"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
              >
                <option>Hybrid (Sensor + XGBoost ML Ensemble)</option>
                <option>Admiralty Holtrop-Mennen Formula</option>
                <option>Pure Neural Network Surrogate</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 light:text-slate-600 block mb-1">Default Emission Factor (tCO₂ / MT fuel)</label>
              <input
                type="text"
                disabled
                value="3.151 tCO₂/MT (IMO MEPC Standard)"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/50 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-cyan-400 light:text-cyan-700 font-mono font-medium"
              />
            </div>

            <div className="space-y-2 pt-1 text-slate-300 light:text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500" />
                <span>Track real-time vessel position & AIS stream</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500" />
                <span>Monitor real-time engine telemetry (RPM, Exhaust Gas, Oil Pressure)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500" />
                <span>Enable automated predictive maintenance alerts</span>
              </label>
            </div>
          </div>
        </div>

        {/* Optimization Settings */}
        <div className="glass-panel rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2.5">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 light:text-cyan-600" />
              <span>Optimization Settings</span>
            </h2>
            <span className="text-[10px] text-purple-400 light:text-purple-600 font-mono">QIEA Core</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 light:text-slate-600 block mb-1">Default Optimization Algorithm</label>
              <select
                value={defaultAlgorithm}
                onChange={(e) => setDefaultAlgorithm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
              >
                <option value="Quantum-Inspired (QIEA)">Quantum-Inspired Evolutionary Algorithm (QIEA)</option>
                <option value="Conventional (GA)">Conventional Genetic Algorithm (GA)</option>
                <option value="Particle Swarm (PSO)">Particle Swarm Optimization (PSO)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 light:text-slate-600 block mb-1">Pareto Frontier Solutions Count</label>
              <input
                type="number"
                value={defaultParetoCount}
                onChange={(e) => setDefaultParetoCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2 pt-1 text-slate-300 light:text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500" />
                <span>Enforce Vessel Capacity & Deadline Constraints</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500" />
                <span>Enforce IMO ECA 0.1% Sulfur Regulation Bounds</span>
              </label>
            </div>
          </div>
        </div>

        {/* System Health & Refresh Settings */}
        <div className="glass-panel rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2.5">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Server className="h-4 w-4 text-purple-400 light:text-purple-600" />
              <span>System & Background Dispatch</span>
            </h2>
            <span className="text-[10px] text-emerald-400 light:text-emerald-600 font-mono">Real-time Stream</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-2.5 text-slate-300 light:text-slate-700">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Automatic Live Telemetry Refresh (4s WebSocket)</span>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Enable Automated Weather Hazard Alerts</span>
                <input
                  type="checkbox"
                  checked={inAppNotifs}
                  onChange={(e) => setInAppNotifs(e.target.checked)}
                  className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Enable Email Notification Dispatch</span>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-slate-800 light:border-slate-200 flex items-center justify-between text-[11px] text-slate-400 light:text-slate-500">
              <span>Data Retention Policy:</span>
              <span className="font-mono text-white light:text-slate-900">2 Years Operational Logs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
