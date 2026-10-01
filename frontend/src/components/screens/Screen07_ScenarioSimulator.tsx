import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FleetMap } from '../common/FleetMap';
import { StatusBadge } from '../common/StatusBadge';
import { defaultScenarioData } from '../../services/mockData';
import {
  Sliders,
  Play,
  TrendingUp,
  Flame,
  CloudRain,
  Ship,
  Clock,
  Zap,
  Sparkles
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
  Cell
} from 'recharts';

export const Screen07_ScenarioSimulator: React.FC = () => {
  // Preset scenario selection
  const [activePreset, setActivePreset] = useState<string>('higher_fuel');

  // Sliders & inputs
  const [fuelPriceChange, setFuelPriceChange] = useState<number>(20);
  const [cargoDemandChange, setCargoDemandChange] = useState<number>(0);
  const [weatherSeverity, setWeatherSeverity] = useState<string>('Moderate');
  const [vesselAvailability, setVesselAvailability] = useState<number>(100);
  const [deadlineShiftHours, setDeadlineShiftHours] = useState<number>(0);
  const [fuelType, setFuelType] = useState<string>('Conventional (HFO/VLSFO)');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scenarioData, setScenarioData] = useState<any>(defaultScenarioData);

  // Trigger simulation calculation on state changes
  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await api.simulateScenario({
        scenario_type: activePreset,
        fuel_price_change_pct: fuelPriceChange,
        cargo_demand_change_pct: cargoDemandChange,
        weather_severity: weatherSeverity,
        vessel_availability_pct: vesselAvailability,
        deadline_shift_hours: deadlineShiftHours,
        fuel_type: fuelType
      });
      setScenarioData(res || defaultScenarioData);
    } catch (e) {
      console.error('Scenario simulation error:', e);
      setScenarioData(defaultScenarioData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [fuelPriceChange, cargoDemandChange, weatherSeverity, vesselAvailability, deadlineShiftHours, fuelType]);

  const selectPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    if (presetKey === 'higher_fuel') {
      setFuelPriceChange(20);
      setCargoDemandChange(0);
      setWeatherSeverity('Moderate');
      setVesselAvailability(100);
      setDeadlineShiftHours(0);
      setFuelType('Conventional (HFO/VLSFO)');
    } else if (presetKey === 'cargo_demand') {
      setFuelPriceChange(0);
      setCargoDemandChange(15);
      setWeatherSeverity('Moderate');
      setVesselAvailability(100);
      setDeadlineShiftHours(0);
      setFuelType('Conventional (HFO/VLSFO)');
    } else if (presetKey === 'severe_weather') {
      setFuelPriceChange(0);
      setCargoDemandChange(0);
      setWeatherSeverity('Severe (Cyclone)');
      setVesselAvailability(100);
      setDeadlineShiftHours(0);
      setFuelType('Conventional (HFO/VLSFO)');
    } else if (presetKey === 'vessel_unavailable') {
      setFuelPriceChange(0);
      setCargoDemandChange(0);
      setWeatherSeverity('Moderate');
      setVesselAvailability(75);
      setDeadlineShiftHours(0);
      setFuelType('Conventional (HFO/VLSFO)');
    } else if (presetKey === 'earlier_deadline') {
      setFuelPriceChange(0);
      setCargoDemandChange(0);
      setWeatherSeverity('Moderate');
      setVesselAvailability(100);
      setDeadlineShiftHours(-24);
      setFuelType('Conventional (HFO/VLSFO)');
    } else if (presetKey === 'alternative_fuel') {
      setFuelPriceChange(0);
      setCargoDemandChange(0);
      setWeatherSeverity('Moderate');
      setVesselAvailability(100);
      setDeadlineShiftHours(0);
      setFuelType('Green Methanol');
    }
  };

  const data = scenarioData || defaultScenarioData;

  const costBreakdownData = data.cost_breakdown
    ? [
        { name: 'Fuel', value: data.cost_breakdown.fuel_cost || 1650000, color: '#f59e0b' },
        { name: 'Vessel OPEX', value: data.cost_breakdown.vessel_opex || 820000, color: '#3b82f6' },
        { name: 'Port Charges', value: data.cost_breakdown.port_charges || 430000, color: '#10b981' },
        { name: 'Carbon Tax', value: data.cost_breakdown.carbon_tax || 240000, color: '#a855f7' }
      ]
    : [];

  const emissionsBarData = [
    { name: 'Base Case', emissions: data.base_case?.total_ghg_tco2e || 16230 },
    { name: 'Scenario', emissions: data.scenario_result?.total_ghg_tco2e || 15600 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900 flex items-center gap-2.5">
            <span>Scenario Simulator</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-950 light:bg-cyan-100 text-cyan-300 light:text-cyan-800 border border-cyan-500/30 light:border-cyan-300">
              What-If Intelligence
            </span>
          </h1>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Analyzes how different market, weather and operational conditions affect fleet plans, costs, fuel consumption and emissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
            <span>Recalculate Scenario</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Chips matching Frame 7 */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 light:text-slate-500">
          Predefined Scenarios
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => selectPreset('higher_fuel')}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs space-y-0.5 cursor-pointer ${
              activePreset === 'higher_fuel'
                ? 'bg-cyan-950/70 light:bg-cyan-50 border-cyan-400 text-cyan-300 light:text-cyan-800 shadow-md ring-1 ring-cyan-400 font-semibold'
                : 'bg-slate-900/80 light:bg-white border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 hover:border-slate-700 light:hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-white light:text-slate-900 flex items-center gap-1">
              <Flame className="h-3 w-3 text-amber-400" />
              <span>Higher Fuel Prices</span>
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500">Fuel price +20%</div>
          </button>

          <button
            onClick={() => selectPreset('cargo_demand')}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs space-y-0.5 cursor-pointer ${
              activePreset === 'cargo_demand'
                ? 'bg-cyan-950/70 light:bg-cyan-50 border-cyan-400 text-cyan-300 light:text-cyan-800 shadow-md ring-1 ring-cyan-400 font-semibold'
                : 'bg-slate-900/80 light:bg-white border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 hover:border-slate-700 light:hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-white light:text-slate-900 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-400" />
              <span>Increased Demand</span>
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500">Cargo demand +15%</div>
          </button>

          <button
            onClick={() => selectPreset('severe_weather')}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs space-y-0.5 cursor-pointer ${
              activePreset === 'severe_weather'
                ? 'bg-cyan-950/70 light:bg-cyan-50 border-cyan-400 text-cyan-300 light:text-cyan-800 shadow-md ring-1 ring-cyan-400 font-semibold'
                : 'bg-slate-900/80 light:bg-white border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 hover:border-slate-700 light:hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-white light:text-slate-900 flex items-center gap-1">
              <CloudRain className="h-3 w-3 text-rose-400" />
              <span>Severe Weather</span>
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500">Cyclone waves &gt;4.5m</div>
          </button>

          <button
            onClick={() => selectPreset('vessel_unavailable')}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs space-y-0.5 cursor-pointer ${
              activePreset === 'vessel_unavailable'
                ? 'bg-cyan-950/70 light:bg-cyan-50 border-cyan-400 text-cyan-300 light:text-cyan-800 shadow-md ring-1 ring-cyan-400 font-semibold'
                : 'bg-slate-900/80 light:bg-white border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 hover:border-slate-700 light:hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-white light:text-slate-900 flex items-center gap-1">
              <Ship className="h-3 w-3 text-amber-400" />
              <span>Vessel Outage</span>
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500">Capacity shortage</div>
          </button>

          <button
            onClick={() => selectPreset('earlier_deadline')}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs space-y-0.5 cursor-pointer ${
              activePreset === 'earlier_deadline'
                ? 'bg-cyan-950/70 light:bg-cyan-50 border-cyan-400 text-cyan-300 light:text-cyan-800 shadow-md ring-1 ring-cyan-400 font-semibold'
                : 'bg-slate-900/80 light:bg-white border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 hover:border-slate-700 light:hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-white light:text-slate-900 flex items-center gap-1">
              <Clock className="h-3 w-3 text-purple-400" />
              <span>Earlier Deadline</span>
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500">-24 hours window</div>
          </button>

          <button
            onClick={() => selectPreset('alternative_fuel')}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs space-y-0.5 cursor-pointer ${
              activePreset === 'alternative_fuel'
                ? 'bg-cyan-950/70 light:bg-cyan-50 border-cyan-400 text-cyan-300 light:text-cyan-800 shadow-md ring-1 ring-cyan-400 font-semibold'
                : 'bg-slate-900/80 light:bg-white border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 hover:border-slate-700 light:hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-white light:text-slate-900 flex items-center gap-1">
              <Zap className="h-3 w-3 text-emerald-400" />
              <span>Alternative Fuel</span>
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500">Green Methanol / LNG</div>
          </button>
        </div>
      </div>

      {/* Main 3-Column Grid: Sliders (Left), Map & Fleet Impact (Center), Results & Charts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders (3 Cols) */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-cyan-400 light:text-cyan-600" />
              <span>Scenario Parameters</span>
            </h2>
            <button
              onClick={() => selectPreset('higher_fuel')}
              className="text-[10px] text-slate-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Fuel Price Change */}
            <div>
              <div className="flex justify-between text-slate-300 light:text-slate-700 mb-1">
                <span>Fuel Price Change</span>
                <span className="font-bold text-white light:text-slate-900 font-mono">{fuelPriceChange > 0 ? `+${fuelPriceChange}%` : `${fuelPriceChange}%`}</span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="5"
                value={fuelPriceChange}
                onChange={(e) => setFuelPriceChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Cargo Demand Change */}
            <div>
              <div className="flex justify-between text-slate-300 light:text-slate-700 mb-1">
                <span>Cargo Demand Change</span>
                <span className="font-bold text-white light:text-slate-900 font-mono">{cargoDemandChange > 0 ? `+${cargoDemandChange}%` : `${cargoDemandChange}%`}</span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                step="5"
                value={cargoDemandChange}
                onChange={(e) => setCargoDemandChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Weather Severity */}
            <div>
              <label className="text-slate-400 light:text-slate-600 block mb-1">Weather Severity</label>
              <select
                value={weatherSeverity}
                onChange={(e) => setWeatherSeverity(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
              >
                <option value="Calm">Calm (Waves &lt; 1.0m)</option>
                <option value="Moderate">Moderate (Waves 2.1m)</option>
                <option value="Severe (Cyclone)">Severe (Cyclone &gt; 4.5m)</option>
              </select>
            </div>

            {/* Vessel Availability */}
            <div>
              <div className="flex justify-between text-slate-300 light:text-slate-700 mb-1">
                <span>Vessel Availability</span>
                <span className="font-bold text-white light:text-slate-900 font-mono">{vesselAvailability}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="10"
                value={vesselAvailability}
                onChange={(e) => setVesselAvailability(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Delivery Deadline Shift */}
            <div>
              <div className="flex justify-between text-slate-300 light:text-slate-700 mb-1">
                <span>Deadline Shift (Hours)</span>
                <span className="font-bold text-white light:text-slate-900 font-mono">{deadlineShiftHours > 0 ? `+${deadlineShiftHours}h` : `${deadlineShiftHours}h`}</span>
              </div>
              <input
                type="range"
                min="-48"
                max="48"
                step="6"
                value={deadlineShiftHours}
                onChange={(e) => setDeadlineShiftHours(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-slate-400 light:text-slate-600 block mb-1">Fuel Type Option</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
              >
                <option value="Conventional (HFO/VLSFO)">Conventional (HFO/VLSFO)</option>
                <option value="LNG Cryogenic">LNG Cryogenic</option>
                <option value="Green Methanol">Green Methanol</option>
                <option value="Green Ammonia">Green Ammonia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Center Column: Route Comparison Map & Fleet Impact (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Route Map Preview */}
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2">
              <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider">
                Simulated Route Trajectory
              </h2>
              <span className="text-[10px] text-cyan-400 light:text-cyan-600 font-mono">Dynamic Re-routing</span>
            </div>
            <div className="h-52 rounded-lg overflow-hidden border border-slate-800 light:border-slate-200">
              <FleetMap vessels={[]} height="100%" showRoutes={true} />
            </div>
          </div>

          {/* Fleet Impact Table */}
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-1.5">
              <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider">Fleet Impact Matrix</h2>
              <span className="text-[10px] text-slate-400 light:text-slate-500 font-mono">Per-vessel Allocation</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 light:text-slate-600 text-[10px] border-b border-slate-800 light:border-slate-200">
                  <tr>
                    <th className="py-1.5">Vessel</th>
                    <th className="py-1.5">Status</th>
                    <th className="py-1.5">Base Fuel</th>
                    <th className="py-1.5">Sim Fuel</th>
                    <th className="py-1.5">Delta %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 light:divide-slate-200 text-slate-300 light:text-slate-700 text-[11px]">
                  {(data.fleet_impact || defaultScenarioData.fleet_impact).map((row: any) => (
                    <tr key={row.vessel}>
                      <td className="py-1.5 font-medium text-white light:text-slate-900">{row.vessel}</td>
                      <td className="py-1.5"><StatusBadge status={row.status} size="sm" /></td>
                      <td className="py-1.5 font-mono text-slate-400 light:text-slate-600">{row.base_fuel} MT</td>
                      <td className="py-1.5 font-mono text-cyan-400 light:text-cyan-700 font-semibold">{row.scen_fuel} MT</td>
                      <td className={`py-1.5 font-mono font-bold ${row.delta_pct >= 0 ? 'text-amber-400 light:text-amber-600' : 'text-emerald-400 light:text-emerald-600'}`}>
                        {row.delta_pct >= 0 ? `+${row.delta_pct}%` : `${row.delta_pct}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Key Metrics Table & Charts & Insights (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Key Metrics Comparison Table */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2">
              <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider">
                Key Metrics Comparison
              </h2>
              <span className="text-[10px] text-cyan-400 light:text-cyan-600 font-mono">Base vs Scenario</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-800/60 light:border-slate-200 font-semibold text-slate-400 light:text-slate-600 text-[10px]">
                <span>Metric</span>
                <span className="text-center">Base Case</span>
                <span className="text-right">Scenario (Delta)</span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center">
                <span className="text-slate-300 light:text-slate-700">Total Fuel</span>
                <span className="text-center text-slate-400 light:text-slate-600 font-mono">
                  {(data.base_case?.total_fuel_mt || 5420).toLocaleString()} MT
                </span>
                <span className={`text-right font-mono font-bold ${(data.delta?.fuel_pct || 0) > 0 ? 'text-amber-400 light:text-amber-600' : 'text-emerald-400 light:text-emerald-600'}`}>
                  {(data.scenario_result?.total_fuel_mt || 5210).toLocaleString()} ({(data.delta?.fuel_pct || 0) > 0 ? `+${data.delta?.fuel_pct}%` : `${data.delta?.fuel_pct || -3.8}%`})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center">
                <span className="text-slate-300 light:text-slate-700">Total Cost</span>
                <span className="text-center text-slate-400 light:text-slate-600 font-mono">
                  ${((data.base_case?.total_cost_usd || 2800000) / 1e6).toFixed(2)}M
                </span>
                <span className={`text-right font-mono font-bold ${(data.delta?.cost_pct || 0) > 0 ? 'text-rose-400 light:text-rose-600' : 'text-emerald-400 light:text-emerald-600'}`}>
                  ${((data.scenario_result?.total_cost_usd || 3140000) / 1e6).toFixed(2)}M ({(data.delta?.cost_pct || 0) > 0 ? `+${data.delta?.cost_pct}%` : `${data.delta?.cost_pct || 12.1}%`})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center">
                <span className="text-slate-300 light:text-slate-700">Emissions</span>
                <span className="text-center text-slate-400 light:text-slate-600 font-mono">
                  {(data.base_case?.total_ghg_tco2e || 16230).toLocaleString()}
                </span>
                <span className={`text-right font-mono font-bold ${(data.delta?.ghg_pct || 0) > 0 ? 'text-amber-400 light:text-amber-600' : 'text-emerald-400 light:text-emerald-600'}`}>
                  {(data.scenario_result?.total_ghg_tco2e || 15600).toLocaleString()} ({(data.delta?.ghg_pct || 0) > 0 ? `+${data.delta?.ghg_pct}%` : `${data.delta?.ghg_pct || -3.9}%`})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center">
                <span className="text-slate-300 light:text-slate-700">Average ETA</span>
                <span className="text-center text-slate-400 light:text-slate-600 font-mono">
                  {data.base_case?.avg_eta_days || 12.5} d
                </span>
                <span className="text-right text-white light:text-slate-900 font-mono font-bold">
                  {data.scenario_result?.avg_eta_days || 12.8} d
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1 items-center border-t border-slate-800 light:border-slate-200 pt-2">
                <span className="text-slate-300 light:text-slate-700">Feasibility</span>
                <span className="text-center text-emerald-400 light:text-emerald-600 font-bold">Feasible</span>
                <span className={`text-right font-bold ${(data.scenario_result?.feasibility || 'Feasible').includes('Feasible') ? 'text-emerald-400 light:text-emerald-600' : 'text-rose-400 light:text-rose-600'}`}>
                  {data.scenario_result?.feasibility || 'Feasible (QIEA Verified)'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Insights & Recommendations */}
          <div className="glass-panel-glow rounded-xl p-4 space-y-2 border border-cyan-500/30">
            <h3 className="text-xs font-bold text-white light:text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-400 light:text-cyan-600" />
              <span>AI Insights & Strategy</span>
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-300 light:text-slate-700">
              {(data.insights_and_recommendations || defaultScenarioData.insights_and_recommendations).map((ins: string, idx: number) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 light:text-cyan-600 font-bold">•</span>
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
