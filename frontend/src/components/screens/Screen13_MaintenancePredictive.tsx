import React, { useState } from 'react';
import { Vessel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Wrench,
  AlertTriangle,
  Activity,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Cpu,
  Shield,
  Gauge
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Screen13Props {
  vessels: Vessel[];
}

const vibrationData = [
  { day: 'Day 1', vibration: 2.1, threshold: 4.5 },
  { day: 'Day 5', vibration: 2.3, threshold: 4.5 },
  { day: 'Day 10', vibration: 2.2, threshold: 4.5 },
  { day: 'Day 15', vibration: 2.6, threshold: 4.5 },
  { day: 'Day 20', vibration: 3.1, threshold: 4.5 },
  { day: 'Day 25', vibration: 3.4, threshold: 4.5 }
];

const exhaustData = [
  { cyl: 'Cyl 1', temp: 415, limit: 450 },
  { cyl: 'Cyl 2', temp: 418, limit: 450 },
  { cyl: 'Cyl 3', temp: 420, limit: 450 },
  { cyl: 'Cyl 4', temp: 435, limit: 450 },
  { cyl: 'Cyl 5', temp: 417, limit: 450 },
  { cyl: 'Cyl 6', temp: 419, limit: 450 }
];

export const Screen13_MaintenancePredictive: React.FC<Screen13Props> = ({ vessels }) => {
  const [selectedVesselId, setSelectedVesselId] = useState<string>(vessels[0]?.id || 'V001');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Vessel Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Maintenance & Predictive Health</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              ML Anomaly Detector
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor vessel mechanical health, detect sensor anomalies and predict equipment failure times before breakdown.
          </p>
        </div>

        <select
          value={selectedVesselId}
          onChange={(e) => setSelectedVesselId(e.target.value)}
          aria-label="Select vessel for maintenance details"
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          {vessels.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.vessel_type})
            </option>
          ))}
        </select>
      </div>

      {/* Top 5 KPI Cards matching Frame 13 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">Overall Vessel Health</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">87%</div>
          <div className="text-[10px] text-emerald-400 font-medium">● Good Operational State</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">Active Maintenance Alerts</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">3 Alerts</div>
          <div className="text-[10px] text-rose-400">1 Critical Cylinder Variation</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">ML Predicted Failures (30d)</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">2 Warnings</div>
          <div className="text-[10px] text-slate-400">Turbocharger bearing inspect</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">Upcoming Maintenance</div>
          <div className="text-2xl font-extrabold text-white font-mono">4 Scheduled</div>
          <div className="text-[10px] text-slate-400">Next port dry dock at Dubai</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400">Maintenance Cost (YTD)</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">$1.24M</div>
          <div className="text-[10px] text-emerald-400">-12.5% vs preventive budget</div>
        </div>
      </div>

      {/* Middle Grid: Component Health Status Table (7 Cols) + Engine Sensor Parameters (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Component Health Table matching Frame 13 */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>Component Health Status & ML Failure Predictions</span>
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono">Anomaly Scan Live</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2 px-2">Component</th>
                  <th className="py-2 px-2">Health</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Failure Probability</th>
                  <th className="py-2 px-2">Est. Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                <tr>
                  <td className="py-2.5 px-2 font-medium text-white">Main Engine Cylinders</td>
                  <td className="py-2.5 px-2 font-mono text-emerald-400">89%</td>
                  <td className="py-2.5 px-2"><StatusBadge status="Good" size="sm" /></td>
                  <td className="py-2.5 px-2 font-mono text-emerald-400">&lt; 2%</td>
                  <td className="py-2.5 px-2 font-mono text-slate-400">&gt; 180 days</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 font-medium text-white">Turbocharger Bearings</td>
                  <td className="py-2.5 px-2 font-mono text-amber-400">74%</td>
                  <td className="py-2.5 px-2"><StatusBadge status="Warning" size="sm" /></td>
                  <td className="py-2.5 px-2 font-mono text-amber-400">18%</td>
                  <td className="py-2.5 px-2 font-mono text-amber-300">~48 days</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 font-medium text-white">Fuel Injection System</td>
                  <td className="py-2.5 px-2 font-mono text-emerald-400">91%</td>
                  <td className="py-2.5 px-2"><StatusBadge status="Good" size="sm" /></td>
                  <td className="py-2.5 px-2 font-mono text-emerald-400">4%</td>
                  <td className="py-2.5 px-2 font-mono text-slate-400">&gt; 120 days</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 font-medium text-white">Cooling Water Exchangers</td>
                  <td className="py-2.5 px-2 font-mono text-emerald-400">85%</td>
                  <td className="py-2.5 px-2"><StatusBadge status="Good" size="sm" /></td>
                  <td className="py-2.5 px-2 font-mono text-emerald-400">5%</td>
                  <td className="py-2.5 px-2 font-mono text-slate-400">&gt; 90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Engine Sensor Readings (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Engine Sensor Parameters (Main Engine)
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono">Real-time Readings</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
              <span className="text-slate-400">Cylinder Peak Pressure</span>
              <span className="font-mono font-bold text-white">145 bar (Normal)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
              <span className="text-slate-400">Exhaust Gas Temperature</span>
              <span className="font-mono font-bold text-amber-400">435°C (Cyl #4 Warning)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
              <span className="text-slate-400">Turbocharger Speed</span>
              <span className="font-mono font-bold text-white">12,000 RPM (Normal)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
              <span className="text-slate-400">Lubricating Oil Pressure</span>
              <span className="font-mono font-bold text-emerald-400">4.2 bar (Normal)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
              <span className="text-slate-400">Cooling Water Temperature</span>
              <span className="font-mono font-bold text-white">76°C (Normal)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts: Vibration Trend & Exhaust Gas Temperature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vibration Trend */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white">Vibration Trend (mm/s vs Safety Limit)</h3>
            <span className="text-[10px] text-slate-400 font-mono">Last 30 Days</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vibrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} domain={[1, 5]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
                <Line type="monotone" dataKey="vibration" stroke="#38bdf8" strokeWidth={2} name="Vibration (mm/s)" />
                <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" name="Threshold Limit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exhaust Gas Temperature */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white">Exhaust Gas Temperature per Cylinder (°C)</h3>
            <span className="text-[10px] text-amber-400 font-mono">Cyl #4 Flagged</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exhaustData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="cyl" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} domain={[400, 460]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Exhaust Temp (°C)" />
                <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" name="Max Limit (450°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
