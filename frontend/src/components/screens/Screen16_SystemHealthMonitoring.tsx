import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import {
  Server,
  Activity,
  Cpu,
  Database,
  HardDrive,
  Radio,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const cpuTrend = [
  { time: '10:00', cpu: 28, memory: 45 },
  { time: '10:05', cpu: 34, memory: 46 },
  { time: '10:10', cpu: 32, memory: 48 },
  { time: '10:15', cpu: 45, memory: 52 },
  { time: '10:20', cpu: 38, memory: 49 },
  { time: '10:25', cpu: 32, memory: 48 }
];

export const Screen16_SystemHealthMonitoring: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getSystemHealth();
      setHealthData(res);
    } catch (e) {
      console.error('Error fetching system health:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>System Health & Technical Control Room</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              Uptime 99.98%
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor platform microservices, AI inference engines, quantum-inspired background workers and real-time streaming WebSocket health.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Health Metrics</span>
        </button>
      </div>

      {/* Top Status Bar matching Frame 16 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400">System Status</div>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Healthy</span>
          </div>
          <div className="text-[10px] text-slate-400">Zero service outages</div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400">Service Status</div>
          <div className="text-lg font-bold text-white font-mono">12 / 12</div>
          <div className="text-[10px] text-emerald-400">Operational</div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400">Data Sources</div>
          <div className="text-lg font-bold text-cyan-400 font-mono">6 / 6</div>
          <div className="text-[10px] text-slate-400">Connected & Ingesting</div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400">API Gateway</div>
          <div className="text-lg font-bold text-white font-mono">28 / 28</div>
          <div className="text-[10px] text-emerald-400">Endpoints Healthy</div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400">QIEA Worker Engine</div>
          <div className="text-lg font-bold text-purple-400 flex items-center gap-1">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span>Running</span>
          </div>
          <div className="text-[10px] text-slate-400">Queue: 0 pending</div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400">Platform Uptime</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">99.98%</div>
          <div className="text-[10px] text-slate-400">Since Oct 2025</div>
        </div>
      </div>

      {/* Main Grid: Left Service Health Table (3/5), Right Infrastructure CPU/Memory + Events (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Service Health Table */}
        <div className="lg:col-span-3 glass-panel rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>Microservices & Pipeline Status</span>
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono">All 12 Online</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Service Name</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Uptime</th>
                  <th className="py-2.5 px-3">Last Ping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                {healthData?.services?.map((svc: any) => (
                  <tr key={svc.name} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-medium text-white">{svc.name}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={svc.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">{svc.response_time_ms} ms</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">{svc.uptime_pct}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[10px]">{svc.last_check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Infrastructure Charts & System Events */}
        <div className="lg:col-span-2 space-y-4">
          {/* Infrastructure Metrics Chart */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span>Infrastructure Utilization</span>
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">CPU: 32% • RAM: 48%</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">CPU Load</div>
                <div className="font-bold text-cyan-400 font-mono text-sm">32.4%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Memory</div>
                <div className="font-bold text-purple-400 font-mono text-sm">48.2%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Disk I/O</div>
                <div className="font-bold text-emerald-400 font-mono text-sm">62.0%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Network</div>
                <div className="font-bold text-blue-400 font-mono text-sm">85 Mbps</div>
              </div>
            </div>

            <div className="h-36 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpuTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} domain={[20, 60]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="cpu" stroke="#38bdf8" strokeWidth={2} name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={2} name="RAM %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent System Events Log matching Frame 16 */}
          <div className="glass-panel rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Recent System Events</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Live Stream</span>
            </div>

            <div className="space-y-2 text-[11px]">
              {healthData?.recent_events?.map((ev: any, idx: number) => (
                <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white">{ev.service}</div>
                    <div className="text-slate-400">{ev.event}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
