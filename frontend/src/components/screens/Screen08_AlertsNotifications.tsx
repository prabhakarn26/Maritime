import React, { useState } from 'react';
import { Alert, Vessel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { FleetMap } from '../common/FleetMap';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  Ship,
  Filter,
  ArrowRight
} from 'lucide-react';

interface Screen08Props {
  alerts: Alert[];
  vessels: Vessel[];
  onAcknowledgeAlert: (alertId: string) => void;
  onRecalculateRoute: (alertId: string) => void;
  onSelectVessel: (vesselId: string) => void;
}

export const Screen08_AlertsNotifications: React.FC<Screen08Props> = ({
  alerts,
  vessels,
  onAcknowledgeAlert,
  onRecalculateRoute,
  onSelectVessel
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id || 'ALT-001');

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === 'All') return true;
    return a.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0] || null;
  const activeVessel = vessels.find((v) => v.id === selectedAlert?.vessel_id) || vessels[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Filter Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Alerts & Risk Monitoring</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
              Live Risk Engine
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time operational risks, severe weather warnings, fuel surge anomalies, and schedule delays across the fleet.
          </p>
        </div>
      </div>

      {/* Severity Filter Tabs matching Frame 8 */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setSeverityFilter('All')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            severityFilter === 'All'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setSeverityFilter('Critical')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            severityFilter === 'Critical'
              ? 'bg-rose-950 text-rose-300 border border-rose-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Critical ({alerts.filter((a) => a.severity === 'Critical').length})</span>
        </button>
        <button
          onClick={() => setSeverityFilter('Warning')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            severityFilter === 'Warning'
              ? 'bg-amber-950 text-amber-300 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Warning ({alerts.filter((a) => a.severity === 'Warning').length})</span>
        </button>
        <button
          onClick={() => setSeverityFilter('Info')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            severityFilter === 'Info'
              ? 'bg-blue-950 text-blue-300 border border-blue-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Info ({alerts.filter((a) => a.severity === 'Info').length})</span>
        </button>
      </div>

      {/* Main Grid: Left Alerts Table (3/5), Right Map & Details Drawer (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Alerts List Table */}
        <div className="lg:col-span-3 glass-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Vessel</th>
                  <th className="py-2.5 px-3">Alert Type</th>
                  <th className="py-2.5 px-3">Message</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredAlerts.map((alt) => {
                  const isSelected = alt.id === selectedAlert?.id;
                  return (
                    <tr
                      key={alt.id}
                      onClick={() => setSelectedAlertId(alt.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                        {alt.time.split(',')[0]}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={alt.severity} size="sm" />
                      </td>
                      <td className="py-3 px-3 font-medium text-white">{alt.vessel_name}</td>
                      <td className="py-3 px-3 font-semibold text-cyan-300">{alt.alert_type}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                        {alt.title}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            alt.acknowledged
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/30 font-bold'
                          }`}
                        >
                          {alt.acknowledged ? 'Acknowledged' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Alert Location Map & Alert Details Drawer matching Frame 8 */}
        <div className="lg:col-span-2 space-y-4">
          {selectedAlert ? (
            <div className="glass-panel-glow rounded-xl p-5 space-y-4 border border-slate-700/80 sticky top-20">
              {/* Alert Location Map */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    <span>Hazard Location Map</span>
                  </h2>
                  <span className="text-[10px] text-rose-400 font-mono">Pinned Storm Zone</span>
                </div>
                <div className="h-44 rounded-lg overflow-hidden border border-slate-800">
                  <FleetMap
                    vessels={[activeVessel]}
                    selectedVesselId={activeVessel.id}
                    height="100%"
                  />
                </div>
              </div>

              {/* Alert Details Card */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedAlert.title}</h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Ship className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="font-semibold text-white">{selectedAlert.vessel_name}</span>
                      <span>• {selectedAlert.time}</span>
                    </div>
                  </div>
                  <StatusBadge status={selectedAlert.severity} />
                </div>

                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-semibold">Location & Environment:</span>
                    <div className="font-mono text-cyan-300 mt-0.5">{selectedAlert.location}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold">Operational Message:</span>
                    <div className="mt-0.5 text-slate-200">{selectedAlert.message}</div>
                  </div>

                  <div>
                    <span className="text-rose-400 font-semibold">Impact Assessment:</span>
                    <div className="mt-0.5 text-rose-200 bg-rose-950/40 p-2 rounded border border-rose-500/30">
                      {selectedAlert.impact}
                    </div>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-semibold">AI Recommendation:</span>
                    <div className="mt-0.5 text-emerald-200 bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                      {selectedAlert.recommendation}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  {!selectedAlert.acknowledged && (
                    <button
                      onClick={() => onAcknowledgeAlert(selectedAlert.id)}
                      className="w-1/2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
                    >
                      Acknowledge Alert
                    </button>
                  )}
                  <button
                    onClick={() => onRecalculateRoute(selectedAlert.id)}
                    className={`${
                      selectedAlert.acknowledged ? 'w-full' : 'w-1/2'
                    } py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Recalculate Route</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-8 text-center text-slate-400 text-xs">
              Select an alert from the table to view location map, telemetry impact and recalculate diversion routes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
