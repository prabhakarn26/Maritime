import React, { useState } from 'react';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  Download,
  Calendar,
  Fuel,
  DollarSign,
  CloudRain,
  Navigation,
  Clock,
  Share2,
  TrendingDown,
  TrendingUp,
  Table,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const fuelMonthlyData = [
  { month: 'Oct 2025', actual: 7420, predicted: 7600 },
  { month: 'Nov 2025', actual: 8100, predicted: 8050 },
  { month: 'Dec 2025', actual: 8650, predicted: 8500 },
  { month: 'Jan 2026', actual: 7920, predicted: 8100 },
  { month: 'Feb 2026', actual: 7680, predicted: 7800 },
  { month: 'Mar 2026', actual: 8550, predicted: 8450 }
];

const emissionsBreakdown = [
  { name: 'Main Propulsion', value: 62, color: '#38bdf8' },
  { name: 'Auxiliary Power', value: 18, color: '#3b82f6' },
  { name: 'Port Operations', value: 12, color: '#10b981' },
  { name: 'Cargo & Reefer', value: 7, color: '#f59e0b' },
  { name: 'Other', value: 1, color: '#a855f7' }
];

const costBreakdown = [
  { name: 'Bunker Fuel', value: 48, color: '#f59e0b' },
  { name: 'Port Dues', value: 22, color: '#3b82f6' },
  { name: 'Crew & Manning', value: 12, color: '#10b981' },
  { name: 'Maintenance', value: 12, color: '#ef4444' },
  { name: 'Insurance & Tax', value: 6, color: '#a855f7' }
];

const cargoAnalysisData = [
  { month: 'Oct', Containers: 18, Bulk: 12, LNG: 6, Chemicals: 4 },
  { month: 'Nov', Containers: 20, Bulk: 14, LNG: 7, Chemicals: 5 },
  { month: 'Dec', Containers: 22, Bulk: 15, LNG: 8, Chemicals: 4 },
  { month: 'Jan', Containers: 19, Bulk: 13, LNG: 6, Chemicals: 6 },
  { month: 'Feb', Containers: 21, Bulk: 14, LNG: 7, Chemicals: 5 },
  { month: 'Mar', Containers: 24, Bulk: 16, LNG: 8, Chemicals: 6 }
];

export const Screen09_ReportsAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('1 Oct 2025 - 31 Mar 2026');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = (format: string) => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Reports & Analytics</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
              Executive BI
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze fleet performance, fuel consumption, costs and emissions. Generate verified IMO/CII regulatory reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono">{dateRange}</span>
          </div>

          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Executive Green Fleet Audit Report (PDF & CSV) generated and downloaded successfully!</span>
          </div>
        </div>
      )}

      {/* Top 5 KPI Cards matching Frame 9 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Fuel Consumption</span>
            <Fuel className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">45,320 MT</div>
          <div className="text-[11px] text-emerald-400 font-medium">-12.5% vs baseline</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Operating Cost</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">$22.8M</div>
          <div className="text-[11px] text-emerald-400 font-medium">-10.3% vs previous period</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total GHG Emissions</span>
            <CloudRain className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 font-mono">135,600 tCO₂e</div>
          <div className="text-[11px] text-emerald-400 font-medium">-14.7% YoY reduction</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Completed Voyages</span>
            <Navigation className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">42 Voyages</div>
          <div className="text-[11px] text-cyan-400 font-medium">+18.7% completed on time</div>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Voyage Time</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">12.4 days</div>
          <div className="text-[11px] text-emerald-400 font-medium">-0.81 days faster</div>
        </div>
      </div>

      {/* Middle Row: Fuel Consumption Trend (Left 2/5) + Emissions & Cost Donut Breakdowns (Right 3/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fuel Consumption Trend Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Fuel Consumption Trend (MT)
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Actual vs Predicted</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="actual" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Actual MT" />
                <Bar dataKey="predicted" fill="#a855f7" radius={[4, 4, 0, 0]} name="Predicted MT" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emissions Breakdown Donut (3.5 Cols) */}
        <div className="lg:col-span-3.5 glass-panel rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Emissions Breakdown
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono">135.6k tCO₂e</span>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={emissionsBreakdown} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                  {emissionsBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-[10px]">
            {emissionsBreakdown.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                  <span>{e.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Cost Breakdown Donut (3.5 Cols) */}
        <div className="lg:col-span-3.5 glass-panel rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Operating Cost Breakdown
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono">$22.8M</span>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costBreakdown} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-[10px]">
            {costBreakdown.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Vessel Performance Summary Table (7 Cols) + Voyage Analysis by Cargo (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vessel Performance Summary Table matching Frame 9 */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Vessel Performance Summary
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">CII Compliance Ratings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2 px-2">Vessel</th>
                  <th className="py-2 px-2">Voyages</th>
                  <th className="py-2 px-2">Fuel (MT)</th>
                  <th className="py-2 px-2">Cost (USD)</th>
                  <th className="py-2 px-2">Emissions</th>
                  <th className="py-2 px-2">Speed</th>
                  <th className="py-2 px-2">CII Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                <tr>
                  <td className="py-2 px-2 font-medium text-white">MV Ocean Star</td>
                  <td className="py-2 px-2 font-mono">8</td>
                  <td className="py-2 px-2 font-mono">3,800 MT</td>
                  <td className="py-2 px-2 font-mono text-emerald-400">$1.85M</td>
                  <td className="py-2 px-2 font-mono">11,890 t</td>
                  <td className="py-2 px-2 font-mono">14.3 kn</td>
                  <td className="py-2 px-2"><StatusBadge status="A" size="sm" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-medium text-white">MV Pacific Dawn</td>
                  <td className="py-2 px-2 font-mono">6</td>
                  <td className="py-2 px-2 font-mono">2,540 MT</td>
                  <td className="py-2 px-2 font-mono text-emerald-400">$1.34M</td>
                  <td className="py-2 px-2 font-mono">7,850 t</td>
                  <td className="py-2 px-2 font-mono">14.2 kn</td>
                  <td className="py-2 px-2"><StatusBadge status="B" size="sm" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-medium text-white">MV Horizon</td>
                  <td className="py-2 px-2 font-mono">7</td>
                  <td className="py-2 px-2 font-mono">3,650 MT</td>
                  <td className="py-2 px-2 font-mono text-emerald-400">$1.89M</td>
                  <td className="py-2 px-2 font-mono">11,540 t</td>
                  <td className="py-2 px-2 font-mono">12.8 kn</td>
                  <td className="py-2 px-2"><StatusBadge status="C" size="sm" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-medium text-white">MV Blue Wave</td>
                  <td className="py-2 px-2 font-mono">4</td>
                  <td className="py-2 px-2 font-mono">4,780 MT</td>
                  <td className="py-2 px-2 font-mono text-emerald-400">$2.35M</td>
                  <td className="py-2 px-2 font-mono">15,240 t</td>
                  <td className="py-2 px-2 font-mono">14.0 kn</td>
                  <td className="py-2 px-2"><StatusBadge status="A" size="sm" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Voyage Analysis by Cargo Type (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Voyage Analysis by Cargo Type
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Monthly Volumes</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cargoAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Containers" stackId="a" fill="#38bdf8" />
                <Bar dataKey="Bulk" stackId="a" fill="#f59e0b" />
                <Bar dataKey="LNG" stackId="a" fill="#10b981" />
                <Bar dataKey="Chemicals" stackId="a" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
