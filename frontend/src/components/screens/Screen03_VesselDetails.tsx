import React, { useState } from 'react';
import { Vessel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { FleetMap } from '../common/FleetMap';
import { ScreenId } from '../../store/useFleetStore';
import {
  ArrowLeft,
  Ship,
  Navigation,
  Activity,
  Fuel,
  DollarSign,
  CloudRain,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Sparkles,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Screen03Props {
  vessel: Vessel;
  allVessels: Vessel[];
  onBackToFleet: () => void;
  onNavigateToTelemetry: (vesselId: string) => void;
  onNavigateToOptimization: (vesselId: string) => void;
  onSelectVessel: (vesselId: string) => void;
}

const fuelActualVsPredicted = [
  { time: '00:00', actual: 24.8, predicted: 24.5 },
  { time: '04:00', actual: 25.1, predicted: 24.7 },
  { time: '08:00', actual: 24.2, predicted: 24.4 },
  { time: '12:00', actual: 24.5, predicted: 24.5 },
  { time: '16:00', actual: 25.6, predicted: 24.8 },
  { time: '20:00', actual: 24.3, predicted: 24.4 },
  { time: '24:00', actual: 24.5, predicted: 24.5 }
];

const speedProfile = [
  { time: '00:00', actualSpeed: 14.5, plannedSpeed: 14.2 },
  { time: '04:00', actualSpeed: 14.8, plannedSpeed: 14.2 },
  { time: '08:00', actualSpeed: 14.1, plannedSpeed: 14.2 },
  { time: '12:00', actualSpeed: 14.3, plannedSpeed: 14.2 },
  { time: '16:00', actualSpeed: 14.6, plannedSpeed: 14.2 },
  { time: '20:00', actualSpeed: 14.2, plannedSpeed: 14.2 },
  { time: '24:00', actualSpeed: 14.3, plannedSpeed: 14.2 }
];

const emissionsTrend = [
  { day: 'Day 1', co2: 82.5 },
  { day: 'Day 2', co2: 79.8 },
  { day: 'Day 3', co2: 78.6 },
  { day: 'Day 4', co2: 77.2 },
  { day: 'Day 5', co2: 78.6 }
];

export const Screen03_VesselDetails: React.FC<Screen03Props> = ({
  vessel,
  allVessels,
  onBackToFleet,
  onNavigateToTelemetry,
  onNavigateToOptimization,
  onSelectVessel
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'fuel' | 'plan' | 'maintenance'>('overview');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToFleet}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">{vessel.name}</h1>
              <StatusBadge status={vessel.status} />
              <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                IMO: {vessel.imo}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {vessel.vessel_type} • Call Sign: {vessel.call_sign} • Flag: {vessel.flag}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick switch vessel selector */}
          <select
            value={vessel.id}
            onChange={(e) => onSelectVessel(e.target.value)}
            aria-label="Select active vessel"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {allVessels.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.status})
              </option>
            ))}
          </select>

          <button
            onClick={() => onNavigateToTelemetry(vessel.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs font-medium transition-all"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Live Telemetry</span>
          </button>

          <button
            onClick={() => onNavigateToOptimization(vessel.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Optimize Vessel</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs matching Frame 3 */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onNavigateToTelemetry(vessel.id)}
          className="px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
        >
          <span>Live Data</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
        <button
          onClick={() => setActiveTab('fuel')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'fuel'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Fuel & Emissions
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'plan'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Current Plan & Recommendations
        </button>
      </div>

      {/* Main Grid: Left Map & Spec cards, Right Voyage card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Current Position Map */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Current Position & Route</span>
              <span className="text-xs text-emerald-400 font-mono">
                Lat: {vessel.current_lat.toFixed(4)}°N, Lng: {vessel.current_lng.toFixed(4)}°E
              </span>
            </h2>
            <div className="text-xs text-slate-400 font-mono">Heading: {vessel.heading_deg}°</div>
          </div>
          <FleetMap
            vessels={[vessel]}
            selectedVesselId={vessel.id}
            height="260px"
          />
        </div>

        {/* Right Column: Vessel Information & Current Voyage card */}
        <div className="space-y-4">
          {/* Vessel Information */}
          <div className="glass-panel rounded-xl p-4 space-y-2.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Vessel Specifications
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Vessel Type:</span>
                <div className="font-semibold text-white">{vessel.vessel_type}</div>
              </div>
              <div>
                <span className="text-slate-400">Deadweight (DWT):</span>
                <div className="font-semibold text-white font-mono">{vessel.dwt.toLocaleString()} MT</div>
              </div>
              <div>
                <span className="text-slate-400">Capacity:</span>
                <div className="font-semibold text-white font-mono">{vessel.capacity_teu.toLocaleString()} TEU</div>
              </div>
              <div>
                <span className="text-slate-400">Length × Beam:</span>
                <div className="font-semibold text-white">{vessel.length_beam}</div>
              </div>
              <div>
                <span className="text-slate-400">Year Built:</span>
                <div className="font-semibold text-white font-mono">{vessel.year_built}</div>
              </div>
              <div>
                <span className="text-slate-400">Fuel Type:</span>
                <div className="font-semibold text-cyan-400 text-[11px]">{vessel.fuel_type}</div>
              </div>
            </div>
          </div>

          {/* Current Voyage card matching Frame 3 */}
          <div className="glass-panel rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Current Voyage ({vessel.current_voyage_id})
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">View Details</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                <span className="text-slate-400">Origin: </span>
                <span className="text-white font-medium">{vessel.origin_port}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Destination: </span>
                <span className="text-white font-medium">{vessel.destination_port}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-slate-400">ETA: </span>
                <span className="text-white font-mono font-medium">{vessel.eta}</span>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px]">
                <span className="text-slate-400">Shore Power (Cold Ironing):</span>
                <span className={vessel.shore_power_equipped ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {vessel.shore_power_equipped ? 'Equipped (11kV Grid)' : 'Not Equipped'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Operational KPI Metric Cards matching Frame 3 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel rounded-xl p-3 space-y-1">
          <div className="text-[11px] text-slate-400">Fuel Consumption</div>
          <div className="text-lg font-bold text-white font-mono">{vessel.fuel_flow_mt_day} MT/day</div>
          <div className="text-[10px] text-emerald-400 font-medium">-8% vs baseline</div>
        </div>

        <div className="glass-panel rounded-xl p-3 space-y-1">
          <div className="text-[11px] text-slate-400">Operating Cost</div>
          <div className="text-lg font-bold text-white font-mono">${vessel.operating_cost_day.toLocaleString()}/day</div>
          <div className="text-[10px] text-emerald-400 font-medium">-5% vs fleet avg</div>
        </div>

        <div className="glass-panel rounded-xl p-3 space-y-1">
          <div className="text-[11px] text-slate-400">GHG Emissions</div>
          <div className="text-lg font-bold text-white font-mono">{vessel.ghg_emissions_day} tCO₂e/day</div>
          <div className="text-[10px] text-emerald-400 font-medium">CII Rating: {vessel.cii_rating}</div>
        </div>

        <div className="glass-panel rounded-xl p-3 space-y-1">
          <div className="text-[11px] text-slate-400">Average Speed</div>
          <div className="text-lg font-bold text-white font-mono">{vessel.speed_knots} knots</div>
          <div className="text-[10px] text-slate-400 font-mono">Planned: {vessel.opt_speed_knots} kn</div>
        </div>

        <div className="glass-panel rounded-xl p-3 space-y-1">
          <div className="text-[11px] text-slate-400">Engine Status</div>
          <div className="text-lg font-bold text-white font-mono">{vessel.engine_status}</div>
          <div className="text-[10px] text-emerald-400 font-medium">Health: {vessel.engine_health_pct}%</div>
        </div>

        <div className="glass-panel rounded-xl p-3 space-y-1">
          <div className="text-[11px] text-slate-400">Weather Enroute</div>
          <div className="text-lg font-bold text-amber-400 font-mono text-sm truncate">{vessel.weather_enroute}</div>
          <div className="text-[10px] text-slate-400">Wind 18 kn • Wave 2.1m</div>
        </div>
      </div>

      {/* AI Recommendation Banner matching Frame 3 */}
      <div className="glass-panel-glow rounded-xl p-4 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 mt-0.5">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>QIEA AI Dynamic Speed & Routing Recommendation</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Recommended Action
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Current speed is 14.3 kn. Reducing speed to <strong className="text-cyan-400">13.8 knots</strong> via Waypoint Corridor #3 will save <strong className="text-emerald-400">3.2 MT/day bunker fuel ($2,048/day)</strong> while meeting the Dubai arrival deadline with 4.5 hours buffer.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToOptimization(vessel.id)}
          className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          Execute Re-Plan
        </button>
      </div>

      {/* 3 Bottom Performance Charts matching Frame 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fuel Consumption (Actual vs Predicted) */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white">Fuel Consumption (Actual vs Predicted)</h3>
            <span className="text-[10px] text-slate-400 font-mono">Last 7 Days</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelActualVsPredicted}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} domain={[22, 28]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
                <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={2} dot={{ r: 2 }} name="Actual (MT/d)" />
                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" name="Predicted (MT/d)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speed Profile */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white">Speed Profile (Actual vs Planned)</h3>
            <span className="text-[10px] text-slate-400 font-mono">Last 7 Days</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedProfile}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} domain={[12, 16]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
                <Line type="monotone" dataKey="actualSpeed" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} name="Actual Speed (kn)" />
                <Line type="monotone" dataKey="plannedSpeed" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" name="Planned Speed (kn)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emissions Trend */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white">Emissions Trend (tCO₂e / day)</h3>
            <span className="text-[10px] text-slate-400 font-mono">Last 5 Days</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emissionsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} domain={[70, 90]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
                <Line type="monotone" dataKey="co2" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="CO2e (t/day)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
