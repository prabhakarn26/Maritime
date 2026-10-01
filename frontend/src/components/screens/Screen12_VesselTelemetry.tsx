import React, { useState, useEffect } from 'react';
import { Vessel } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { FleetMap } from '../common/FleetMap';
import {
  Activity,
  Gauge,
  Thermometer,
  Zap,
  Ship,
  Wind,
  CloudRain,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Screen12Props {
  vessel: Vessel;
  onBackToVessel: () => void;
  onNavigateToOptimization: (vesselId: string) => void;
}

const liveFuelStreamData = [
  { time: '00:00', mainEngine: 22.1, auxEngine: 2.4, total: 24.5 },
  { time: '04:00', mainEngine: 22.8, auxEngine: 2.4, total: 25.2 },
  { time: '08:00', mainEngine: 22.0, auxEngine: 2.3, total: 24.3 },
  { time: '12:00', mainEngine: 23.2, auxEngine: 2.4, total: 25.6 },
  { time: '16:00', mainEngine: 22.5, auxEngine: 2.4, total: 24.9 },
  { time: '20:00', mainEngine: 22.2, auxEngine: 2.3, total: 24.5 }
];

export const Screen12_VesselTelemetry: React.FC<Screen12Props> = ({
  vessel,
  onBackToVessel,
  onNavigateToOptimization
}) => {
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const data = await api.getVesselTelemetry(vessel.id);
        setTelemetry(data);
      } catch (e) {
        console.error('Error loading telemetry:', e);
      }
    }
    loadTelemetry();
  }, [vessel.id]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Vessel Header matching Frame 12 */}
      <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToVessel}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white">{vessel.name}</h1>
                <StatusBadge status={vessel.status} />
                <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                  MMSI: {vessel.mmsi} • Call Sign: {vessel.call_sign}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {vessel.vessel_type} • Capacity: {vessel.capacity_teu.toLocaleString()} TEU • Voyage: {vessel.current_voyage_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="text-slate-400">Current Position:</div>
              <div className="font-bold text-white font-mono">
                {vessel.current_lat.toFixed(4)}°N, {vessel.current_lng.toFixed(4)}°E
              </div>
            </div>
            <button
              onClick={() => onNavigateToOptimization(vessel.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Optimize</span>
            </button>
          </div>
        </div>

        {/* 6 Key Real-Time Telemetry Cards matching Frame 12 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Speed (SOG)</div>
            <div className="text-xl font-bold text-white font-mono">{vessel.speed_knots} kn</div>
            <div className="text-[10px] text-emerald-400 font-mono">+0.3 kn surge</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Engine RPM</div>
            <div className="text-xl font-bold text-white font-mono">78 RPM</div>
            <div className="text-[10px] text-emerald-400">● Normal Range</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Fuel Flow Rate</div>
            <div className="text-xl font-bold text-cyan-400 font-mono">{vessel.fuel_flow_mt_day} MT/d</div>
            <div className="text-[10px] text-amber-400 font-mono">+3.2% vs target</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Draft (Mean)</div>
            <div className="text-xl font-bold text-white font-mono">{vessel.draft_m} m</div>
            <div className="text-[10px] text-slate-400">Trim: 0.2m by stern</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Power Output</div>
            <div className="text-xl font-bold text-white font-mono">
              {(vessel.engine_power_mw * 0.76).toFixed(1)} MW
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">62% Engine Load</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400">Hull Stress</div>
            <div className="text-xl font-bold text-emerald-400">Low</div>
            <div className="text-[10px] text-slate-400">● Normal limits</div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Engine Gauges (Left) + Live Fuel Consumption Area Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Engine Parameters Dials (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Gauge className="h-4 w-4 text-cyan-400" />
              <span>Engine Sensor Parameters</span>
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono">Sensors Calibrated</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-2xl font-bold text-cyan-400 font-mono">82°C</div>
              <div className="text-xs font-semibold text-white">Main Engine Temp</div>
              <div className="text-[10px] text-slate-400 font-mono">Limit: 60 - 92°C</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-2xl font-bold text-cyan-400 font-mono">78°C</div>
              <div className="text-xs font-semibold text-white">Aux Engine Temp</div>
              <div className="text-[10px] text-slate-400 font-mono">Limit: 60 - 85°C</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-2xl font-bold text-emerald-400 font-mono">4.2 bar</div>
              <div className="text-xs font-semibold text-white">Oil Pressure</div>
              <div className="text-[10px] text-slate-400 font-mono">Limit: 3.0 - 5.2 bar</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-2xl font-bold text-emerald-400 font-mono">76°C</div>
              <div className="text-xs font-semibold text-white">Coolant Temp</div>
              <div className="text-[10px] text-slate-400 font-mono">Limit: 70 - 82°C</div>
            </div>
          </div>
        </div>

        {/* Live Fuel Flow Chart (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Fuel Flow Breakdown (MT/day)
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono">25.6 MT/day Total</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveFuelStreamData}>
                <defs>
                  <linearGradient id="mainEngGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} domain={[20, 30]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="total" stroke="#38bdf8" fillOpacity={1} fill="url(#mainEngGrad)" name="Total Flow (MT/d)" />
                <Area type="monotone" dataKey="mainEngine" stroke="#10b981" fill="none" strokeWidth={1.5} name="Main Engine" />
                <Area type="monotone" dataKey="auxEngine" stroke="#f59e0b" fill="none" strokeWidth={1.5} name="Aux Engine" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Environmental Conditions Live Bar matching Frame 12 */}
      <div className="glass-panel rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
            <Wind className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Wind Velocity</div>
            <div className="text-sm font-bold text-white font-mono">18 knots (WSW)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-blue-400">
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Significant Wave Height</div>
            <div className="text-sm font-bold text-white font-mono">2.1 m (West swell)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Ocean Current Vector</div>
            <div className="text-sm font-bold text-white font-mono">1.2 knots @ 245°</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Sea State Index</div>
            <div className="text-sm font-bold text-white font-mono">State 3 (Moderate)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
