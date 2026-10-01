import React from 'react';
import { Ship, Navigation, Fuel, DollarSign, CloudRain, Plus, ArrowUpRight, AlertTriangle, ChevronRight, Wind } from 'lucide-react';
import { Vessel, Voyage, Alert } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { FleetMap } from '../common/FleetMap';
import { StatusBadge } from '../common/StatusBadge';
import { ScreenId } from '../../store/useFleetStore';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface Screen02Props {
  vessels: Vessel[];
  voyages: Voyage[];
  alerts: Alert[];
  onNavigateToScreen: (screen: ScreenId) => void;
  onSelectVessel: (vesselId: string) => void;
  onSelectVoyage: (voyageId: string) => void;
}

const fuelTrendData = [
  { day: 'Day 1', actual: 4800, baseline: 5200, target: 4500 },
  { day: 'Day 5', actual: 5100, baseline: 5350, target: 4550 },
  { day: 'Day 10', actual: 4950, baseline: 5300, target: 4600 },
  { day: 'Day 15', actual: 5300, baseline: 5400, target: 4620 },
  { day: 'Day 20', actual: 5150, baseline: 5420, target: 4650 },
  { day: 'Day 25', actual: 5420, baseline: 5500, target: 4680 },
  { day: 'Day 30', actual: 5280, baseline: 5480, target: 4650 }
];

const fleetStatusData = [
  { name: 'On Route', value: 18, color: '#10b981' },
  { name: 'At Port', value: 3, color: '#3b82f6' },
  { name: 'Delayed', value: 2, color: '#f59e0b' },
  { name: 'Maintenance', value: 1, color: '#ef4444' }
];

export const Screen02_FleetOverview: React.FC<Screen02Props> = ({
  vessels,
  voyages,
  alerts,
  onNavigateToScreen,
  onSelectVessel,
  onSelectVoyage
}) => {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Action Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900 flex items-center gap-2.5">
            <span>Fleet Overview</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded bg-cyan-950 light:bg-cyan-50 text-cyan-300 light:text-cyan-700 border border-cyan-500/30 light:border-cyan-200">
              Live Fleet Control
            </span>
          </h1>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Real-time operations deck: AIS tracking, voyage schedules, bunker consumption, and weather hazards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToScreen('screen_5_optimization_studio')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Optimization Run</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Vessels"
          value={vessels.length || 24}
          subtext="18 Active • 4 Port • 2 Delayed"
          icon={Ship}
          color="cyan"
          onClick={() => onNavigateToScreen('screen_3_vessel_details')}
        />
        <MetricCard
          title="Active Voyages"
          value={voyages.length || 18}
          change="+2 from yesterday"
          isPositiveChangeGood={true}
          icon={Navigation}
          color="blue"
          onClick={() => onNavigateToScreen('screen_4_voyages')}
        />
        <MetricCard
          title="Total Fuel (MT)"
          value="5,420"
          unit="MT"
          change="+4% vs last week"
          isPositiveChangeGood={false}
          icon={Fuel}
          color="amber"
          onClick={() => onNavigateToScreen('screen_9_reports')}
        />
        <MetricCard
          title="Total Cost (USD)"
          value="$2.8M"
          change="-6% vs last week"
          isPositiveChangeGood={true}
          icon={DollarSign}
          color="emerald"
          onClick={() => onNavigateToScreen('screen_9_reports')}
        />
        <MetricCard
          title="Total Emissions"
          value="16,230"
          unit="tCO₂e"
          change="-10% vs last week"
          isPositiveChangeGood={true}
          icon={CloudRain}
          color="purple"
          onClick={() => onNavigateToScreen('screen_9_reports')}
        />
      </div>

      {/* Middle Operations Grid: Map (2 Cols) + Operations Intelligence (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Live Fleet Map Card */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white light:text-slate-900 tracking-wide">
                Live Fleet Map & AIS Tracking
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 light:text-slate-500">
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span> On Route
              </span>
              <span className="text-blue-500 font-semibold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span> At Port
              </span>
              <span className="text-amber-500 font-semibold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span> Delayed
              </span>
            </div>
          </div>

          <FleetMap
            vessels={vessels}
            onSelectVessel={(vId) => onSelectVessel(vId)}
            height="520px"
            showControls={true}
            allowFullscreen={true}
          />
        </div>

        {/* Right Intelligence Column: Alerts & Fleet Status Donut */}
        <div className="space-y-6">
          {/* Recent Alerts */}
          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 light:border-slate-200">
              <h2 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Recent Alerts</span>
              </h2>
              <button
                onClick={() => onNavigateToScreen('screen_8_alerts')}
                className="text-xs text-cyan-400 light:text-cyan-600 hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
              >
                <span>View All</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {alerts.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  onClick={() => onNavigateToScreen('screen_8_alerts')}
                  className="p-2.5 rounded-xl bg-slate-900/90 light:bg-slate-50 border border-slate-800 light:border-slate-200 hover:border-cyan-500/50 light:hover:border-cyan-500 cursor-pointer transition-all text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white light:text-slate-900 group-hover:text-cyan-400 light:group-hover:text-cyan-600 transition-colors">
                      {a.title}
                    </span>
                    <span className="text-[10px] text-slate-400 light:text-slate-500 font-mono">{a.time.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 light:text-slate-500 text-[11px]">
                    <span>{a.vessel_name}</span>
                    <StatusBadge status={a.severity} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fleet Status Donut & Weather Summary */}
          <div className="glass-panel rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white light:text-slate-900">Fleet Status</h2>
              <span className="text-xs text-slate-400 light:text-slate-500 font-mono">{vessels.length || 24} Vessels</span>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fleetStatusData}
                      innerRadius={30}
                      outerRadius={46}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {fleetStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isLight ? '#ffffff' : '#0f172a',
                        borderColor: isLight ? '#e2e8f0' : '#334155',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: isLight ? '#0f172a' : '#f8fafc'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs">
                {fleetStatusData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-300 light:text-slate-700">{s.name}</span>
                    </div>
                    <span className="font-bold text-white light:text-slate-900 font-mono">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Weather (Key Shipping Regions) */}
            <div className="pt-3 border-t border-slate-800 light:border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 light:text-slate-500">
                <span>Marine Weather (Key Regions)</span>
                <span className="text-cyan-400 light:text-cyan-600 text-[10px] font-semibold">Active AIS</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                  <div className="text-[10px] text-slate-400 light:text-slate-500 truncate">Arabian Sea</div>
                  <div className="font-bold text-amber-400 light:text-amber-600">28°C</div>
                  <div className="text-[9px] text-slate-400 light:text-slate-500 flex items-center justify-center gap-0.5 mt-0.5">
                    <Wind className="h-2.5 w-2.5" /> 18 kn
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                  <div className="text-[10px] text-slate-400 light:text-slate-500 truncate">Bay of Bengal</div>
                  <div className="font-bold text-rose-400 light:text-rose-600">26°C</div>
                  <div className="text-[9px] text-slate-400 light:text-slate-500 flex items-center justify-center gap-0.5 mt-0.5">
                    <Wind className="h-2.5 w-2.5" /> 24 kn
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                  <div className="text-[10px] text-slate-400 light:text-slate-500 truncate">South China</div>
                  <div className="font-bold text-emerald-400 light:text-emerald-600">27°C</div>
                  <div className="text-[9px] text-slate-400 light:text-slate-500 flex items-center justify-center gap-0.5 mt-0.5">
                    <Wind className="h-2.5 w-2.5" /> 14 kn
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Active Voyages Table (Left 3/5) + Fuel Consumption Trend (Right 2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Active Voyages Table */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 light:border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-white light:text-slate-900">Active Voyages</h2>
              <span className="text-xs text-slate-400 light:text-slate-500">Tracking schedule progress & bunker consumption</span>
            </div>
            <button
              onClick={() => onNavigateToScreen('screen_4_voyages')}
              className="text-xs text-cyan-400 light:text-cyan-600 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span>View All {voyages.length || 18} Voyages</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 light:text-slate-500 uppercase text-[10px] border-b border-slate-800 light:border-slate-200 pb-2">
                <tr>
                  <th className="py-2 font-semibold">Voyage ID</th>
                  <th className="py-2 font-semibold">Vessel</th>
                  <th className="py-2 font-semibold">Cargo</th>
                  <th className="py-2 font-semibold">Route</th>
                  <th className="py-2 font-semibold">ETA</th>
                  <th className="py-2 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 light:divide-slate-200 text-slate-300 light:text-slate-700">
                {voyages.slice(0, 5).map((voy) => (
                  <tr
                    key={voy.id}
                    onClick={() => onSelectVoyage(voy.id)}
                    className="hover:bg-slate-900/60 light:hover:bg-slate-100 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 font-mono text-cyan-400 light:text-cyan-600 font-semibold">{voy.id}</td>
                    <td className="py-2.5 font-medium text-white light:text-slate-900 group-hover:text-cyan-300 light:group-hover:text-cyan-600">{voy.vessel_name}</td>
                    <td className="py-2.5 text-slate-400 light:text-slate-500">{voy.cargo_type}</td>
                    <td className="py-2.5 text-slate-400 light:text-slate-500 font-mono text-[11px]">{voy.origin_id} → {voy.destination_id}</td>
                    <td className="py-2.5 text-slate-300 light:text-slate-700 text-[11px]">{voy.estimated_arrival.split(',')[0]}</td>
                    <td className="py-2.5">
                      <StatusBadge status={voy.status} size="sm" />
                    </td>
                    <td className="py-2.5">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-mono">{voy.progress_pct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 light:bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              voy.status === 'Delayed' ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                            }`}
                            style={{ width: `${voy.progress_pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fuel Consumption Trend Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 light:border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-white light:text-slate-900">Fuel Consumption Trend</h2>
              <span className="text-xs text-slate-400 light:text-slate-500">Actual vs Baseline vs QIEA Target</span>
            </div>
            <span className="text-xs text-slate-400 light:text-slate-500 font-mono">Last 30 Days</span>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelTrendData}>
                <defs>
                  <linearGradient id="fuelActualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                <XAxis dataKey="day" stroke={isLight ? '#94a3b8' : '#64748b'} fontSize={10} />
                <YAxis stroke={isLight ? '#94a3b8' : '#64748b'} fontSize={10} domain={[4000, 6000]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    borderColor: isLight ? '#e2e8f0' : '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: isLight ? '#0f172a' : '#f8fafc'
                  }}
                />
                <Area type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#fuelActualGrad)" name="Actual (MT)" />
                <Area type="monotone" dataKey="baseline" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Baseline (MT)" />
                <Area type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} fill="none" name="QIEA Target (MT)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs text-slate-400 light:text-slate-500 pt-2 border-t border-slate-800 light:border-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span>Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Target</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
