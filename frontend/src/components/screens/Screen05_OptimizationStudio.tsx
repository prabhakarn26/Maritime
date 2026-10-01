import React, { useState } from 'react';
import { Vessel, OptimizationResultsData } from '../../types';
import { api } from '../../services/api';
import { FleetMap } from '../common/FleetMap';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Shield,
  Zap,
  Ship,
  MapPin,
  CheckCircle2,
  Cpu,
  Flame,
  DollarSign,
  Leaf,
  Clock,
  ArrowRight
} from 'lucide-react';

interface Screen05Props {
  vessels: Vessel[];
  selectedVesselId: string;
  onOptimizationComplete: (results: OptimizationResultsData) => void;
}

export const Screen05_OptimizationStudio: React.FC<Screen05Props> = ({
  vessels,
  selectedVesselId,
  onOptimizationComplete
}) => {
  // Step 1: Cargo
  const [cargoType, setCargoType] = useState('Containers');
  const [cargoQuantityTeu, setCargoQuantityTeu] = useState(5000);
  const [cargoWeightMt, setCargoWeightMt] = useState(70000);
  const [cargoPriority, setCargoPriority] = useState('High Priority');
  const [specialReefer, setSpecialReefer] = useState(true);

  // Step 2: Route
  const [originPort, setOriginPort] = useState('SIN');
  const [destPort, setDestPort] = useState('DXB');
  const [routeMode, setRouteMode] = useState('Fuel Efficient');
  const [departureDate, setDepartureDate] = useState('1 Nov 2026');
  const [arrivalDeadline, setArrivalDeadline] = useState('3 Nov 2026');

  // Step 3: Vessels
  const [selectedVessels, setSelectedVessels] = useState<string[]>([selectedVesselId, 'V002']);

  // Step 4: Objectives Weights
  const [primaryObjective, setPrimaryObjective] = useState<'fuel' | 'cost' | 'ghg'>('fuel');
  const [fuelWeight, setFuelWeight] = useState(40);
  const [costWeight, setCostWeight] = useState(30);
  const [ghgWeight, setGhgWeight] = useState(20);
  const [etaWeight, setEtaWeight] = useState(10);
  const [shorePowerRequired, setShorePowerRequired] = useState(true);

  // Step 5: Constraints
  const [speedLimitMin, setSpeedLimitMin] = useState(10);
  const [speedLimitMax, setSpeedLimitMax] = useState(21);
  const [fuelCompatibilityEnforce, setFuelCompatibilityEnforce] = useState(true);
  const [portRestrictionsEnforce, setPortRestrictionsEnforce] = useState(true);
  const [ecaSulfurEnforce, setEcaSulfurEnforce] = useState(true);

  // Step 6: Algorithm Selection
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'Baseline' | 'GA' | 'QIEA'>('QIEA');

  // Execution state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizingStepText, setOptimizingStepText] = useState('');
  const [optimizingProgress, setOptimizingProgress] = useState(0);

  const toggleVessel = (vId: string) => {
    if (selectedVessels.includes(vId)) {
      if (selectedVessels.length > 1) {
        setSelectedVessels(selectedVessels.filter((id) => id !== vId));
      }
    } else {
      setSelectedVessels([...selectedVessels, vId]);
    }
  };

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    setOptimizingProgress(15);
    setOptimizingStepText('Initializing Q-bit superpositions (θ = π/4) & Hydrodynamic constraints...');

    setTimeout(() => {
      setOptimizingProgress(45);
      setOptimizingStepText('Evaluating XGBoost ML fuel resistance & weather wave vectors...');
    }, 400);

    setTimeout(() => {
      setOptimizingProgress(75);
      setOptimizingStepText('Applying Quantum Rotation Gates & Non-dominated Pareto sorting...');
    }, 800);

    try {
      const results = await api.runOptimization({
        scenario_name: `${originPort} to ${destPort} Green Fleet Optimization`,
        cargo_type: cargoType,
        cargo_quantity_teu: cargoQuantityTeu,
        cargo_weight_mt: cargoWeightMt,
        cargo_priority: cargoPriority,
        origin_id: originPort,
        destination_id: destPort,
        selected_vessel_ids: selectedVessels,
        selected_algorithm: selectedAlgorithm,
        fuel_weight: fuelWeight / 100.0,
        cost_weight: costWeight / 100.0,
        ghg_weight: ghgWeight / 100.0,
        eta_weight: etaWeight / 100.0,
        shore_power_required: shorePowerRequired
      });

      setOptimizingProgress(100);
      setOptimizingStepText('Optimization Complete! Feasible Pareto solutions extracted.');

      setTimeout(() => {
        setIsOptimizing(false);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onOptimizationComplete(results);
      }, 500);
    } catch (e) {
      console.error('Optimization error:', e);
      setIsOptimizing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Optimization Studio</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40">
              QIEA Engine
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Find the optimal fleet plan for your cargo, route and constraints using advanced quantum-inspired optimization algorithms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFuelWeight(40);
              setCostWeight(30);
              setGhgWeight(20);
              setEtaWeight(10);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Weights</span>
          </button>

          <button
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-xs font-bold hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {isOptimizing ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
            <span>{isOptimizing ? 'Optimizing Fleet...' : 'Run Optimization'}</span>
          </button>
        </div>
      </div>

      {/* Progress modal / banner during optimization */}
      {isOptimizing && (
        <div className="glass-panel-glow rounded-xl p-4 border border-cyan-500/50 space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-400 flex items-center gap-2">
              <Cpu className="h-4 w-4 animate-spin" />
              <span>{optimizingStepText}</span>
            </span>
            <span className="font-mono font-bold text-white">{optimizingProgress}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 transition-all duration-300"
              style={{ width: `${optimizingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 2-Column Studio Layout matching Frame 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Inputs & Configuration - 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Cargo Details */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">1</span>
                <span>Cargo Details</span>
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">Singapore to Dubai Lane</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400">Cargo Type</label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Containers">Containers</option>
                  <option value="Dry Bulk">Dry Bulk</option>
                  <option value="Crude Oil">Crude Oil</option>
                  <option value="LNG Cryogenic">LNG Cryogenic</option>
                  <option value="Chemicals">Chemicals</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400">Quantity (TEU)</label>
                <input
                  type="number"
                  value={cargoQuantityTeu}
                  onChange={(e) => setCargoQuantityTeu(Number(e.target.value))}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400">Weight (MT)</label>
                <input
                  type="number"
                  value={cargoWeightMt}
                  onChange={(e) => setCargoWeightMt(Number(e.target.value))}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400">Cargo Priority</label>
                <select
                  value={cargoPriority}
                  onChange={(e) => setCargoPriority(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Critical">Critical</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
              <input
                type="checkbox"
                id="reefer"
                checked={specialReefer}
                onChange={(e) => setSpecialReefer(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="reefer" className="cursor-pointer">
                Temperature-Controlled Reefer Monitoring (+1.2 MW Hoteling Load)
              </label>
            </div>
          </div>

          {/* Section 2: Route Information */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">2</span>
                <span>Route Information</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Distance: ~3,400 NM</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400">Origin Port</label>
                <select
                  value={originPort}
                  onChange={(e) => setOriginPort(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="SIN">Singapore (SIN)</option>
                  <option value="SHA">Shanghai (SHA)</option>
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="CMB">Colombo (CMB)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400">Destination Port</label>
                <select
                  value={destPort}
                  onChange={(e) => setDestPort(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="DXB">Dubai (DXB)</option>
                  <option value="RTM">Rotterdam (RTM)</option>
                  <option value="LAX">Los Angeles (LAX)</option>
                  <option value="HAM">Hamburg (HAM)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400">Departure Date</label>
                <input
                  type="text"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400">Arrival Deadline</label>
                <input
                  type="text"
                  value={arrivalDeadline}
                  onChange={(e) => setArrivalDeadline(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vessel Selection */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">3</span>
                <span>Vessel Selection ({selectedVessels.length} Selected)</span>
              </h2>
              <span className="text-[10px] text-slate-400">Check vessels to evaluate in pool</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-48 overflow-y-auto pr-1">
              {vessels.slice(0, 6).map((v) => {
                const isChecked = selectedVessels.includes(v.id);
                return (
                  <div
                    key={v.id}
                    onClick={() => toggleVessel(v.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                      />
                      <div>
                        <div className="font-semibold text-white">{v.name}</div>
                        <div className="text-[10px] text-slate-400">{v.vessel_type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-cyan-400 text-[11px] font-semibold">{v.capacity_teu} TEU</div>
                      <div className="text-[10px] text-emerald-400 font-medium">CII {v.cii_rating}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Objectives, Constraints & Algorithm - 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 4: Optimization Objectives (Sliders) */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">4</span>
                <span>Multi-Objective Weights</span>
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">Total: {fuelWeight + costWeight + ghgWeight + etaWeight}%</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Fuel Weight */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span>Minimize Fuel Consumption</span>
                  </span>
                  <span className="font-mono font-bold text-white">{fuelWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fuelWeight}
                  onChange={(e) => setFuelWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Cost Weight */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Minimize Total OPEX Cost</span>
                  </span>
                  <span className="font-mono font-bold text-white">{costWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={costWeight}
                  onChange={(e) => setCostWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* GHG Weight */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Minimize GHG Lifecycle Emissions</span>
                  </span>
                  <span className="font-mono font-bold text-white">{ghgWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ghgWeight}
                  onChange={(e) => setGhgWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* ETA Reliability */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-purple-400" />
                    <span>Schedule Reliability & Buffer</span>
                  </span>
                  <span className="font-mono font-bold text-white">{etaWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={etaWeight}
                  onChange={(e) => setEtaWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Shore Power (Cold Ironing) at Dubai:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shorePowerRequired}
                  onChange={(e) => setShorePowerRequired(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-emerald-400 font-semibold">Enabled</span>
              </label>
            </div>
          </div>

          {/* Section 5: Algorithm Selection (Frame 5) */}
          <div className="glass-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">5</span>
                <span>Algorithm Selection</span>
              </h2>
              <span className="text-[10px] text-purple-400 font-mono">Benchmark Mode Available</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* Baseline */}
              <button
                type="button"
                onClick={() => setSelectedAlgorithm('Baseline')}
                className={`p-3 rounded-lg border text-left space-y-1 transition-all ${
                  selectedAlgorithm === 'Baseline'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-[11px]">Rule-Based</div>
                <div className="text-[10px] text-slate-400">Baseline</div>
              </button>

              {/* Conventional GA */}
              <button
                type="button"
                onClick={() => setSelectedAlgorithm('GA')}
                className={`p-3 rounded-lg border text-left space-y-1 transition-all ${
                  selectedAlgorithm === 'GA'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-[11px]">Conventional</div>
                <div className="text-[10px] text-slate-400">Genetic (GA)</div>
              </button>

              {/* Quantum QIEA */}
              <button
                type="button"
                onClick={() => setSelectedAlgorithm('QIEA')}
                className={`p-3 rounded-lg border text-left space-y-1 transition-all relative overflow-hidden ${
                  selectedAlgorithm === 'QIEA'
                    ? 'bg-gradient-to-br from-cyan-950 to-purple-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-cyan-300 text-[11px] flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                  <span>QIEA</span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium">Quantum-Inspired</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
