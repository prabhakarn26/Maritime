import React, { useState } from 'react';
import { Voyage, Vessel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { FleetMap } from '../common/FleetMap';
import {
  Navigation,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Box,
  Anchor,
  Clock
} from 'lucide-react';

interface Screen04Props {
  voyages: Voyage[];
  vessels: Vessel[];
  selectedVoyageId: string;
  onSelectVoyage: (voyageId: string) => void;
  onNavigateToOptimization: (vesselId?: string) => void;
  onCreateVoyage: (newVoyageData: any) => void;
}

export const Screen04_VoyagesCargo: React.FC<Screen04Props> = ({
  voyages,
  vessels,
  selectedVoyageId,
  onSelectVoyage,
  onNavigateToOptimization,
  onCreateVoyage
}) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Upcoming' | 'Completed' | 'All'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New voyage modal form state
  const [newVesselId, setNewVesselId] = useState('V001');
  const [newCargoType, setNewCargoType] = useState('Containers');
  const [newCargoTeu, setNewCargoTeu] = useState(5000);
  const [newCargoWeight, setNewCargoWeight] = useState(70000);
  const [newOrigin, setNewOrigin] = useState('SIN');
  const [newDestination, setNewDestination] = useState('DXB');
  const [newDeparture, setNewDeparture] = useState('01 Nov 2026');
  const [newDeadline, setNewDeadline] = useState('03 Nov 2026');

  const filteredVoyages = voyages.filter((v) => {
    const matchesTab =
      activeTab === 'All'
        ? true
        : activeTab === 'Active'
        ? v.status === 'On Route' || v.status === 'At Port' || v.status === 'Delayed'
        : v.status.toLowerCase() === activeTab.toLowerCase();

    const matchesSearch =
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vessel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.cargo_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.origin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.destination_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const selectedVoyage = voyages.find((v) => v.id === selectedVoyageId) || voyages[0] || null;
  const activeVessel = vessels.find((v) => v.id === selectedVoyage?.vessel_id) || vessels[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateVoyage({
      vessel_id: newVesselId,
      cargo_type: newCargoType,
      cargo_quantity_teu: Number(newCargoTeu),
      cargo_weight_mt: Number(newCargoWeight),
      cargo_priority: 'High Priority',
      origin_id: newOrigin,
      destination_id: newDestination,
      departure_date: newDeparture,
      arrival_deadline: newDeadline
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Create Voyage action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Voyages & Cargo</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Operations
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage active, upcoming and completed voyages. Track cargo, routes, schedules and status.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Voyage</span>
        </button>
      </div>

      {/* Tabs matching Frame 4 */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {(['Active', 'Upcoming', 'Completed', 'All'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab} Voyages ({tab === 'Active' ? '12' : tab === 'Upcoming' ? '6' : tab === 'Completed' ? '24' : '42'})
          </button>
        ))}
      </div>

      {/* Main Grid: Left Voyages Table (3/5), Right Voyage Details Drawer (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Search Filter + Table */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search voyage ID, vessel name, cargo type, or port..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Voyages List Table */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Voyage ID</th>
                    <th className="py-2.5 px-3">Vessel</th>
                    <th className="py-2.5 px-3">Cargo</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">ETA</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredVoyages.map((v) => {
                    const isSelected = v.id === selectedVoyage?.id;
                    return (
                      <tr
                        key={v.id}
                        onClick={() => onSelectVoyage(v.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                            : 'hover:bg-slate-900/50'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-cyan-400">{v.id}</td>
                        <td className="py-3 px-3 font-medium text-white">{v.vessel_name}</td>
                        <td className="py-3 px-3 text-slate-400">{v.cargo_type}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                          {v.origin_id} → {v.destination_id}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-300 font-mono">
                          {v.estimated_arrival.split(',')[0]}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={v.status} size="sm" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="w-20">
                            <div className="text-[10px] text-right font-mono mb-1">{v.progress_pct}%</div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                style={{ width: `${v.progress_pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Voyage Details matching Frame 4 */}
        <div className="lg:col-span-2 space-y-4">
          {selectedVoyage ? (
            <div className="glass-panel rounded-xl p-5 space-y-4 sticky top-20">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base font-mono">{selectedVoyage.id}</span>
                    <StatusBadge status={selectedVoyage.status} size="sm" />
                  </div>
                  <div className="text-xs text-cyan-400 font-medium">{selectedVoyage.vessel_name}</div>
                </div>

                <button
                  onClick={() => onNavigateToOptimization(selectedVoyage.vessel_id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow transition-all active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Optimize</span>
                </button>
              </div>

              {/* Map Route Preview */}
              <div className="rounded-lg overflow-hidden border border-slate-800">
                <FleetMap
                  vessels={[activeVessel]}
                  selectedVesselId={activeVessel.id}
                  height="180px"
                  showRoutes={true}
                />
              </div>

              {/* Route Waypoints */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3 text-cyan-400" />
                    <span>Origin</span>
                  </div>
                  <div className="font-bold text-white mt-0.5">{selectedVoyage.origin_name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedVoyage.departure_date}</div>
                </div>

                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ArrowRight className="h-4 w-4 text-cyan-400" />
                  <span className="text-[10px] font-mono mt-0.5">3,400 NM</span>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    <span>Destination</span>
                  </div>
                  <div className="font-bold text-white mt-0.5">{selectedVoyage.destination_name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{selectedVoyage.arrival_deadline}</div>
                </div>
              </div>

              {/* Cargo Information */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Box className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Cargo Information</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 text-[10px] font-semibold">
                    {selectedVoyage.cargo_priority}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400">Cargo Type:</span>
                    <div className="font-semibold text-white">{selectedVoyage.cargo_type}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Quantity:</span>
                    <div className="font-semibold text-white font-mono">
                      {selectedVoyage.cargo_quantity_teu.toLocaleString()} TEU
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Weight:</span>
                    <div className="font-semibold text-white font-mono">
                      {selectedVoyage.cargo_weight_mt.toLocaleString()} MT
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Est. Total Fuel:</span>
                    <div className="font-semibold text-cyan-400 font-mono">
                      {selectedVoyage.estimated_total_fuel_mt} MT
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Progress Metrics */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Voyage Progress</span>
                  <span className="font-bold text-cyan-400 font-mono">{selectedVoyage.progress_pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    style={{ width: `${selectedVoyage.progress_pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400 pt-1">
                  <div>
                    <span>Travelled:</span>
                    <div className="font-bold text-white font-mono">{selectedVoyage.distance_travelled_nm} NM</div>
                  </div>
                  <div>
                    <span>Remaining:</span>
                    <div className="font-bold text-white font-mono">{selectedVoyage.distance_remaining_nm} NM</div>
                  </div>
                  <div>
                    <span>Avg Speed:</span>
                    <div className="font-bold text-white font-mono">{selectedVoyage.avg_speed_knots} kn</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-8 text-center text-slate-400 text-xs">
              Select a voyage to view schedule and cargo telemetry.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Voyage */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel-glow rounded-2xl w-full max-w-lg p-6 space-y-4 border border-cyan-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Anchor className="h-5 w-5 text-cyan-400" />
                <span>Schedule New Voyage</span>
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Assign Vessel</label>
                  <select
                    value={newVesselId}
                    onChange={(e) => setNewVesselId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {vessels.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.vessel_type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Cargo Type</label>
                  <input
                    type="text"
                    value={newCargoType}
                    onChange={(e) => setNewCargoType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Cargo TEU</label>
                  <input
                    type="number"
                    value={newCargoTeu}
                    onChange={(e) => setNewCargoTeu(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Cargo Weight (MT)</label>
                  <input
                    type="number"
                    value={newCargoWeight}
                    onChange={(e) => setNewCargoWeight(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Origin Port</label>
                  <select
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SIN">Port of Singapore (SIN)</option>
                    <option value="SHA">Port of Shanghai (SHA)</option>
                    <option value="BOM">Jawaharlal Nehru Port (BOM)</option>
                    <option value="CMB">Port of Colombo (CMB)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Destination Port</label>
                  <select
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="DXB">Port of Jebel Ali (Dubai - DXB)</option>
                    <option value="RTM">Port of Rotterdam (RTM)</option>
                    <option value="LAX">Port of Los Angeles (LAX)</option>
                    <option value="HAM">Port of Hamburg (HAM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Departure Date</label>
                  <input
                    type="text"
                    value={newDeparture}
                    onChange={(e) => setNewDeparture(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Arrival Deadline</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
