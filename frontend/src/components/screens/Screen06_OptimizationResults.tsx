import React, { useState } from 'react';
import { OptimizationResultsData } from '../../types';
import { FleetMap } from '../common/FleetMap';
import { StatusBadge } from '../common/StatusBadge';
import {
  ArrowLeft,
  Save,
  Download,
  Share2,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Clock,
  Cpu,
  Layers,
  Fuel,
  DollarSign,
  Leaf
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Screen06Props {
  results: OptimizationResultsData | null;
  onBackToStudio: () => void;
  onSaveResult?: () => void;
}

// Fallback rich mock results if no run executed yet
const fallbackResults: OptimizationResultsData = {
  run_id: 'OPT-2026-048',
  scenario_name: 'Singapore to Dubai Green Fleet Optimization',
  vessel_name: 'MV Ocean Star',
  vessel_id: 'V001',
  route: 'SIN -> DXB',
  distance_nm: 3400,
  summary_comparison: {
    fuel_mt: {
      baseline: 5420,
      conventional_ga: 4980,
      conventional_saving_pct: 8.1,
      quantum_qiea: 4650,
      quantum_saving_pct: 14.2
    },
    cost_usd: {
      baseline: 2800000,
      conventional_ga: 2500000,
      conventional_saving_pct: 10.7,
      quantum_qiea: 2300000,
      quantum_saving_pct: 17.9
    },
    ghg_tco2e: {
      baseline: 16230,
      conventional_ga: 14820,
      conventional_saving_pct: 8.7,
      quantum_qiea: 13950,
      quantum_saving_pct: 14.1
    },
    eta_days: {
      baseline: 12.5,
      conventional_ga: 12.1,
      quantum_qiea: 11.6
    },
    runtime_seconds: {
      baseline: 0.05,
      conventional_ga: 42.3,
      quantum_qiea: 38.7
    }
  },
  pareto_frontier: [
    { total_fuel_mt: 4520, total_cost_usd: 2450000, name: 'Sol A (Fuel Optimal)' },
    { total_fuel_mt: 4650, total_cost_usd: 2300000, name: 'Sol B (QIEA Recommended)' },
    { total_fuel_mt: 4800, total_cost_usd: 2200000, name: 'Sol C (Cost Optimal)' },
    { total_fuel_mt: 4980, total_cost_usd: 2500000, name: 'Conventional GA' },
    { total_fuel_mt: 5420, total_cost_usd: 2800000, name: 'Baseline' }
  ],
  tradeoff_archetypes: {},
  convergence_curves: {
    ga: [],
    qiea: []
  }
};

const barComparisonData = [
  { metric: 'Fuel (MT / 100)', Baseline: 54.2, Conventional: 49.8, 'Quantum-Inspired': 46.5 },
  { metric: 'Cost ($100k)', Baseline: 28.0, Conventional: 25.0, 'Quantum-Inspired': 23.0 },
  { metric: 'GHG (ktCO₂e)', Baseline: 16.2, Conventional: 14.8, 'Quantum-Inspired': 13.9 },
  { metric: 'ETA (Days)', Baseline: 12.5, Conventional: 12.1, 'Quantum-Inspired': 11.6 }
];

export const Screen06_OptimizationResults: React.FC<Screen06Props> = ({
  results,
  onBackToStudio,
  onSaveResult
}) => {
  const data = results || fallbackResults;
  const [selectedSolutionTab, setSelectedSolutionTab] = useState<'qiea' | 'ga' | 'baseline'>('qiea');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Save Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStudio}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Optimization Results</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Run ID: {data.run_id}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Comparison of fleet plans generated using different algorithms for the selected scenario.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSaveResult}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Result Plan</span>
          </button>
        </div>
      </div>

      {/* Scenario Metadata Banner matching Frame 6 */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div>
          <span className="text-slate-500">Scenario: </span>
          <span className="font-semibold text-white font-mono">Singapore → Dubai (3,400 NM)</span>
        </div>
        <div>
          <span className="text-slate-500">Cargo: </span>
          <span className="font-semibold text-cyan-400 font-mono">5,000 TEU (70,000 MT Containers)</span>
        </div>
        <div>
          <span className="text-slate-500">Departure: </span>
          <span className="font-semibold text-white font-mono">1 Nov 2026</span>
        </div>
        <div>
          <span className="text-slate-500">Arrival Deadline: </span>
          <span className="font-semibold text-emerald-400 font-mono">3 Nov 2026</span>
        </div>
        <div>
          <span className="text-slate-500">Objective: </span>
          <span className="font-semibold text-purple-400 font-mono">Minimize Fuel & Cost (Multi-objective)</span>
        </div>
      </div>

      {/* 4 Comparative Cards matching Frame 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fuel Comparison */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Fuel (MT)</span>
            <Fuel className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-xl font-extrabold text-cyan-400 font-mono">
                {data.summary_comparison.fuel_mt.quantum_qiea.toLocaleString()} MT
              </div>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <TrendingDown className="h-3 w-3" />
                <span>-{data.summary_comparison.fuel_mt.quantum_saving_pct}% vs Baseline</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono space-y-0.5">
              <div>GA: {data.summary_comparison.fuel_mt.conventional_ga} MT</div>
              <div>Base: {data.summary_comparison.fuel_mt.baseline} MT</div>
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Cost (USD)</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                ${(data.summary_comparison.cost_usd.quantum_qiea / 1e6).toFixed(2)}M
              </div>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <TrendingDown className="h-3 w-3" />
                <span>-{data.summary_comparison.cost_usd.quantum_saving_pct}% vs Baseline</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono space-y-0.5">
              <div>GA: ${(data.summary_comparison.cost_usd.conventional_ga / 1e6).toFixed(2)}M</div>
              <div>Base: ${(data.summary_comparison.cost_usd.baseline / 1e6).toFixed(2)}M</div>
            </div>
          </div>
        </div>

        {/* Emissions Comparison */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Emissions (tCO₂e)</span>
            <Leaf className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-xl font-extrabold text-purple-400 font-mono">
                {data.summary_comparison.ghg_tco2e.quantum_qiea.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <TrendingDown className="h-3 w-3" />
                <span>-{data.summary_comparison.ghg_tco2e.quantum_saving_pct}% vs Baseline</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono space-y-0.5">
              <div>GA: {data.summary_comparison.ghg_tco2e.conventional_ga.toLocaleString()}</div>
              <div>Base: {data.summary_comparison.ghg_tco2e.baseline.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* ETA Comparison */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average ETA (Days)</span>
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-xl font-extrabold text-blue-400 font-mono">
                {data.summary_comparison.eta_days.quantum_qiea} days
              </div>
              <div className="text-[11px] text-cyan-300 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" />
                <span>Arrives 18h Ahead of Deadline</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono space-y-0.5">
              <div>GA: {data.summary_comparison.eta_days.conventional_ga} d</div>
              <div>Base: {data.summary_comparison.eta_days.baseline} d</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle 3-Column Grid: Map Comparison (Left), Pareto Frontier (Center), Solution Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Comparison Map (4 Cols) */}
        <div className="lg:col-span-4 glass-panel rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Route Comparison</h2>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-rose-400">● Baseline</span>
              <span className="text-amber-400">● GA</span>
              <span className="text-cyan-400 font-bold">● QIEA</span>
            </div>
          </div>
          <div className="h-60 rounded-lg overflow-hidden border border-slate-800">
            <FleetMap vessels={[]} height="100%" showRoutes={true} />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Route Details (Quantum QIEA Optimal):</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 font-mono">
              <div>Distance: 3,420 NM</div>
              <div>ETA: 11.6 Days</div>
              <div>Fuel: 4,650 MT</div>
              <div>Cost: $2.30M</div>
            </div>
          </div>
        </div>

        {/* Pareto Frontier Scatter Chart (4 Cols) */}
        <div className="lg:col-span-4 glass-panel rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Pareto Frontier (Fuel vs Cost)
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono">12 Non-dominated Solutions</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="total_fuel_mt"
                  name="Fuel (MT)"
                  domain={[4400, 5600]}
                  stroke="#64748b"
                  fontSize={9}
                />
                <YAxis
                  type="number"
                  dataKey="total_cost_usd"
                  name="Cost ($)"
                  domain={[2100000, 2900000]}
                  stroke="#64748b"
                  fontSize={9}
                  tickFormatter={(val) => `$${(val / 1e6).toFixed(1)}M`}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Scatter name="Solutions" data={data.pareto_frontier} fill="#38bdf8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>◄ Lower Fuel Optimal</span>
            <span className="text-cyan-400 font-bold">Pareto Optimal Frontier</span>
            <span>Lower Cost Optimal ►</span>
          </div>
        </div>

        {/* Solution Details Drawer (4 Cols) */}
        <div className="lg:col-span-4 glass-panel-glow rounded-xl p-4 space-y-3 border border-cyan-500/40 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Selected Solution Details</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
              QIEA Optimal
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Fuel (MT):</span>
              <span className="font-bold text-white font-mono">{data.summary_comparison.fuel_mt.quantum_qiea} MT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Operating Cost:</span>
              <span className="font-bold text-emerald-400 font-mono">
                ${(data.summary_comparison.cost_usd.quantum_qiea / 1e6).toFixed(2)}M
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">GHG Lifecycle Footprint:</span>
              <span className="font-bold text-purple-400 font-mono">
                {data.summary_comparison.ghg_tco2e.quantum_qiea.toLocaleString()} tCO₂e
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Estimated Voyage Duration:</span>
              <span className="font-bold text-white font-mono">{data.summary_comparison.eta_days.quantum_qiea} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Feasibility Status:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>100% Feasible (0 Violations)</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Algorithm Runtime:</span>
              <span className="font-bold text-cyan-300 font-mono">
                {data.summary_comparison.runtime_seconds.quantum_qiea} seconds
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Q-bit Iterations:</span>
              <span className="font-bold text-white font-mono">600 evaluations</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pareto Convergence:</span>
              <span className="font-bold text-emerald-400 font-mono">Achieved (ε &lt; 0.001)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={onSaveResult}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:from-cyan-400 hover:to-blue-500 shadow transition-all active:scale-95"
            >
              Deploy Fleet Operating Plan
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Vessel Allocation Table & Algorithm Performance Benchmark Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vessel Allocation Table (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Fleet Vessel Allocation & Schedules
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Multi-vessel Dispatch</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2 px-2">Vessel</th>
                  <th className="py-2 px-2">Cargo</th>
                  <th className="py-2 px-2">Route</th>
                  <th className="py-2 px-2">Speed</th>
                  <th className="py-2 px-2">Fuel</th>
                  <th className="py-2 px-2">Cost</th>
                  <th className="py-2 px-2">Emissions</th>
                  <th className="py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                <tr>
                  <td className="py-2 px-2 font-medium text-white">MV Ocean Star</td>
                  <td className="py-2 px-2">5,000 TEU</td>
                  <td className="py-2 px-2 font-mono">SIN → DXB</td>
                  <td className="py-2 px-2 font-mono text-cyan-400">14.2 kn</td>
                  <td className="py-2 px-2 font-mono">680 MT</td>
                  <td className="py-2 px-2 font-mono">$435k</td>
                  <td className="py-2 px-2 font-mono">2,140 t</td>
                  <td className="py-2 px-2"><StatusBadge status="On Route" size="sm" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-medium text-white">MV Pacific Dawn</td>
                  <td className="py-2 px-2">6,000 TEU</td>
                  <td className="py-2 px-2 font-mono">CMB → DXB</td>
                  <td className="py-2 px-2 font-mono text-cyan-400">13.8 kn</td>
                  <td className="py-2 px-2 font-mono">540 MT</td>
                  <td className="py-2 px-2 font-mono">$389k</td>
                  <td className="py-2 px-2 font-mono">1,620 t</td>
                  <td className="py-2 px-2"><StatusBadge status="On Route" size="sm" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-medium text-white">MV Horizon</td>
                  <td className="py-2 px-2">4,200 TEU</td>
                  <td className="py-2 px-2 font-mono">SHA → BOM</td>
                  <td className="py-2 px-2 font-mono text-cyan-400">12.5 kn</td>
                  <td className="py-2 px-2 font-mono">480 MT</td>
                  <td className="py-2 px-2 font-mono">$310k</td>
                  <td className="py-2 px-2 font-mono">1,480 t</td>
                  <td className="py-2 px-2"><StatusBadge status="On Route" size="sm" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-medium text-white">MV Blue Wave</td>
                  <td className="py-2 px-2">5,200 TEU</td>
                  <td className="py-2 px-2 font-mono">SIN → RTM</td>
                  <td className="py-2 px-2 font-mono text-cyan-400">13.5 kn</td>
                  <td className="py-2 px-2 font-mono">620 MT</td>
                  <td className="py-2 px-2 font-mono">$490k</td>
                  <td className="py-2 px-2 font-mono">1,820 t</td>
                  <td className="py-2 px-2"><StatusBadge status="At Port" size="sm" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Algorithm Benchmarking Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Performance Benchmark Comparison
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono">Baseline vs GA vs QIEA</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="metric" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Baseline" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Conventional" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Quantum-Inspired" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
