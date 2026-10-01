import React, { useState } from 'react';
import { OptimizationRun } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { FleetMap } from '../common/FleetMap';
import {
  RotateCcw
} from 'lucide-react';

interface Screen15Props {
  runs?: OptimizationRun[];
  selectedRunId?: string;
  onSelectRun: (runId: string) => void;
  onNavigateToStudioWithRun: (run: OptimizationRun) => void;
}

const defaultRuns: OptimizationRun[] = [
  {
    run_id: 'OPT-2026-048',
    scenario_name: 'Singapore to Dubai Green Fleet Optimization',
    date_time: 'Today, 14:20 UTC',
    vessels_count: 4,
    vessels: ['MV Ocean Star', 'SS Pacific Voyager', 'MV Arctic Pioneer', 'MV Global Carrier'],
    route: 'SIN -> DXB (3,400 nm)',
    algorithm: 'Quantum-Inspired QIEA',
    objective: 'Multi-Objective (Fuel + Cost + GHG + ETA)',
    status: 'Completed',
    runtime_seconds: 1.2,
    pareto_solutions_count: 10,
    baseline_fuel_mt: 5420,
    optimized_fuel_mt: 4650,
    fuel_saving_pct: 14.2,
    baseline_cost_usd: 2800000,
    optimized_cost_usd: 2300000,
    cost_saving_pct: 17.9,
    baseline_ghg_tco2e: 16230,
    optimized_ghg_tco2e: 13950,
    ghg_saving_pct: 14.1,
    avg_eta_days: 11.9,
    feasibility: 'Optimal & Feasible'
  },
  {
    run_id: 'OPT-2026-047',
    scenario_name: 'Shanghai to Mumbai Weather Avoidance',
    date_time: 'Yesterday, 09:15 UTC',
    vessels_count: 2,
    vessels: ['SS Pacific Voyager', 'MV Ocean Star'],
    route: 'SHA -> BOM (4,200 nm)',
    algorithm: 'Conventional Genetic (GA)',
    objective: 'Fuel & Weather Risk Minimization',
    status: 'Completed',
    runtime_seconds: 4.8,
    pareto_solutions_count: 8,
    baseline_fuel_mt: 4100,
    optimized_fuel_mt: 3780,
    fuel_saving_pct: 7.8,
    baseline_cost_usd: 2100000,
    optimized_cost_usd: 1940000,
    cost_saving_pct: 7.6,
    baseline_ghg_tco2e: 12200,
    optimized_ghg_tco2e: 11300,
    ghg_saving_pct: 7.4,
    avg_eta_days: 13.2,
    feasibility: 'Feasible'
  },
  {
    run_id: 'OPT-2026-046',
    scenario_name: 'Colombo to Rotterdam Dual Fuel Dispatch',
    date_time: '28 Oct 2026, 18:30 UTC',
    vessels_count: 1,
    vessels: ['MV Arctic Pioneer'],
    route: 'CMB -> RTM (6,800 nm)',
    algorithm: 'Particle Swarm (PSO)',
    objective: 'CII Carbon Intensity Minimization',
    status: 'Completed',
    runtime_seconds: 3.1,
    pareto_solutions_count: 6,
    baseline_fuel_mt: 6200,
    optimized_fuel_mt: 5640,
    fuel_saving_pct: 9.0,
    baseline_cost_usd: 3400000,
    optimized_cost_usd: 3120000,
    cost_saving_pct: 8.2,
    baseline_ghg_tco2e: 18500,
    optimized_ghg_tco2e: 16800,
    ghg_saving_pct: 9.2,
    avg_eta_days: 18.5,
    feasibility: 'Feasible'
  }
];

export const Screen15_OptimizationRunHistory: React.FC<Screen15Props> = ({
  runs = defaultRuns,
  selectedRunId = 'OPT-2026-048',
  onSelectRun,
  onNavigateToStudioWithRun
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [algorithmFilter, setAlgorithmFilter] = useState('All');

  const safeRuns = Array.isArray(runs) && runs.length > 0 ? runs : defaultRuns;

  const filteredRuns = safeRuns.filter((r) => {
    const matchesSearch =
      r.run_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.scenario_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.route.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAlg =
      algorithmFilter === 'All'
        ? true
        : r.algorithm.toLowerCase().includes(algorithmFilter.toLowerCase());

    return matchesSearch && matchesAlg;
  });

  const selectedRun = safeRuns.find((r) => r.run_id === selectedRunId) || safeRuns[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900 flex items-center gap-2.5">
            <span>Optimization Run History</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-950 light:bg-cyan-100 text-cyan-300 light:text-cyan-800 border border-cyan-500/30 light:border-cyan-300">
              Audit Trail
            </span>
          </h1>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Complete audit trail of all previous fleet optimization runs, parameter inputs, algorithm benchmarks and resulting savings.
          </p>
        </div>
      </div>

      {/* Main Grid: Run History Table (3/5) + Selected Run Details (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Filter & Runs Table (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel rounded-xl p-4 space-y-3">
            {/* Search & Filter Bar */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search run ID, scenario or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <select
                value={algorithmFilter}
                onChange={(e) => setAlgorithmFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Algorithms</option>
                <option value="Quantum">Quantum (QIEA)</option>
                <option value="Genetic">Genetic (GA)</option>
                <option value="Particle">PSO</option>
              </select>
            </div>

            {/* Runs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 light:text-slate-600 text-[10px] border-b border-slate-800 light:border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Run ID</th>
                    <th className="py-2.5 px-3">Scenario</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Algorithm</th>
                    <th className="py-2.5 px-3">Runtime</th>
                    <th className="py-2.5 px-3">Saving %</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 light:divide-slate-200 text-slate-300 light:text-slate-700">
                  {filteredRuns.map((r) => {
                    const isSelected = r.run_id === selectedRun?.run_id;
                    return (
                      <tr
                        key={r.run_id}
                        onClick={() => onSelectRun(r.run_id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/40 light:bg-cyan-50 border-l-2 border-cyan-400'
                            : 'hover:bg-slate-900/50 light:hover:bg-slate-100'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-cyan-400 light:text-cyan-700">{r.run_id}</td>
                        <td className="py-3 px-3 font-medium text-white light:text-slate-900 max-w-[130px] truncate">{r.scenario_name}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400 light:text-slate-500">{r.route}</td>
                        <td className="py-3 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 light:bg-purple-100 text-purple-300 light:text-purple-800 font-mono text-[10px]">
                            {r.algorithm.split(' ')[0]}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400 light:text-slate-500 text-[11px]">{r.runtime_seconds}s</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400 light:text-emerald-600">-{r.fuel_saving_pct}%</td>
                        <td className="py-3 px-3">
                          <StatusBadge status={r.status} size="sm" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Run Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedRun && (
            <div className="glass-panel-glow rounded-xl p-5 space-y-4 border border-slate-700/80 light:border-slate-200 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white light:text-slate-900 text-base font-mono">{selectedRun.run_id}</span>
                    <StatusBadge status={selectedRun.status} size="sm" />
                  </div>
                  <div className="text-xs text-slate-400 light:text-slate-500 mt-0.5">{selectedRun.scenario_name}</div>
                </div>

                <button
                  onClick={() => onNavigateToStudioWithRun(selectedRun)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950 light:bg-cyan-100 border border-cyan-500/40 light:border-cyan-300 text-cyan-300 light:text-cyan-800 hover:bg-cyan-900/40 text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Re-run</span>
                </button>
              </div>

              {/* Map Route Comparison Preview */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 light:text-slate-500 mb-1.5">
                  <span>Route Trajectory Comparison</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-rose-400">● Baseline</span>
                    <span className="text-cyan-400 light:text-cyan-600 font-bold">● QIEA Optimized</span>
                  </div>
                </div>
                <div className="h-44 rounded-lg overflow-hidden border border-slate-800 light:border-slate-200">
                  <FleetMap vessels={[]} height="100%" showRoutes={true} />
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1">
                  <div className="text-slate-400 light:text-slate-500 text-[11px]">Bunker Fuel Saved</div>
                  <div className="text-base font-bold text-emerald-400 light:text-emerald-600 font-mono">
                    {(selectedRun.baseline_fuel_mt - selectedRun.optimized_fuel_mt).toLocaleString()} MT
                  </div>
                  <div className="text-[10px] text-emerald-400 light:text-emerald-600 font-semibold">-{selectedRun.fuel_saving_pct}% reduction</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1">
                  <div className="text-slate-400 light:text-slate-500 text-[11px]">Cost Savings</div>
                  <div className="text-base font-bold text-cyan-400 light:text-cyan-600 font-mono">
                    ${((selectedRun.baseline_cost_usd - selectedRun.optimized_cost_usd) / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-cyan-400 light:text-cyan-600 font-semibold">-{selectedRun.cost_saving_pct}% vs baseline</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
