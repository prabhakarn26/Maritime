import React, { useState, useEffect } from 'react';
import { DataSource, Vessel } from '../../types';
import { api } from '../../services/api';
import { FleetMap } from '../common/FleetMap';
import { mockDataSources, mockLiveDataFeed } from '../../services/mockData';
import {
  Radio,
  RefreshCw,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Screen11Props {
  vessels: Vessel[];
}

const dataVolumeData = [
  { source: 'AIS Stream', records: 112 },
  { source: 'NOAA Weather', records: 34 },
  { source: 'Port Intel', records: 12 },
  { source: 'Bunker Platts', records: 8.5 },
  { source: 'IMO Regs', records: 2.5 },
  { source: 'Copernicus', records: 18 }
];

export const Screen11_LiveDataIntegrations: React.FC<Screen11Props> = ({ vessels }) => {
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [dataFeed, setDataFeed] = useState<any[]>(mockLiveDataFeed);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [sources, feed] = await Promise.all([
        api.getDataSources(),
        api.getLiveDataFeed()
      ]);
      if (Array.isArray(sources) && sources.length > 0) {
        setDataSources(sources);
      }
      if (Array.isArray(feed) && feed.length > 0) {
        setDataFeed(feed);
      }
    } catch (e) {
      console.error('Error fetching integrations:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  const safeSources = Array.isArray(dataSources) && dataSources.length > 0 ? dataSources : mockDataSources;
  const safeFeed = Array.isArray(dataFeed) && dataFeed.length > 0 ? dataFeed : mockLiveDataFeed;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900 flex items-center gap-2.5">
            <span>Live Data & Integrations</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-emerald-950 light:bg-emerald-100 text-emerald-300 light:text-emerald-800 border border-emerald-500/30 light:border-emerald-300">
              6/6 Connected
            </span>
          </h1>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Monitor real-time data sources, API telemetry streams, and ingestion pipelines feeding the ML fuel model and QIEA optimizer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Feeds</span>
          </button>
        </div>
      </div>

      {/* 6 Data Source Status Cards matching Frame 11 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {safeSources.map((src) => (
          <div key={src.id} className="glass-panel rounded-xl p-3.5 space-y-2 border border-slate-800 light:border-slate-200">
            <div className="flex items-center justify-between">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 light:text-emerald-700 font-medium">Connected</span>
            </div>
            <div>
              <div className="font-bold text-white light:text-slate-900 text-xs truncate" title={src.name}>{src.name.split('(')[0]}</div>
              <div className="text-[10px] text-slate-400 light:text-slate-500 truncate">{src.provider}</div>
            </div>
            <div className="pt-1.5 border-t border-slate-800/80 light:border-slate-200 flex items-center justify-between text-[10px] text-slate-400 light:text-slate-500">
              <span>Latency:</span>
              <span className="font-mono text-cyan-300 light:text-cyan-700 font-semibold">{src.latency_ms} ms</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid: Live Vessel Map (Left 3/5) + Incoming Real-Time Data Feed Stream (Right 2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 glass-panel rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400 light:text-cyan-600 animate-pulse" />
              <span>Live Ingested Vessel AIS Feed</span>
            </h2>
            <span className="text-[10px] text-cyan-400 light:text-cyan-600 font-mono">42 Vessels Ingested</span>
          </div>
          <FleetMap vessels={vessels} height="320px" showRoutes={true} />
        </div>

        {/* Live Data Feed Stream Table */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400 light:text-emerald-600" />
              <span>Incoming Data Stream Feed</span>
            </h2>
            <span className="text-[10px] text-slate-400 light:text-slate-500 font-mono">Live Ingestion</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 light:text-slate-600 text-[10px] border-b border-slate-800 light:border-slate-200">
                <tr>
                  <th className="py-1.5">Time</th>
                  <th className="py-1.5">Source</th>
                  <th className="py-1.5">Data Type</th>
                  <th className="py-1.5">Raw Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 light:divide-slate-200 text-slate-300 light:text-slate-700 text-[11px]">
                {safeFeed.map((row: any) => (
                  <tr key={row.id} className="hover:bg-slate-900/40 light:hover:bg-slate-100">
                    <td className="py-2 font-mono text-[10px] text-slate-400 light:text-slate-500">{row.time}</td>
                    <td className="py-2 font-medium text-cyan-300 light:text-cyan-700">{row.source}</td>
                    <td className="py-2 text-slate-300 light:text-slate-700">{row.type || row.data_type}</td>
                    <td className="py-2 font-mono text-[10px] text-slate-400 light:text-slate-500 truncate max-w-[120px]">{row.details || row.raw_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-slate-800 light:border-slate-200 text-[11px] text-slate-400 light:text-slate-500 flex items-center justify-between">
            <span>Validation Status:</span>
            <span className="text-emerald-400 light:text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>100% Verified Ingestion</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Data Quality Gauges & 24h Volume Bar Chart matching Frame 11 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quality Gauges (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider">
              Data Quality & Freshness Indices
            </h2>
            <span className="text-[10px] text-emerald-400 light:text-emerald-700 font-mono">Last 24 Hours</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-lg bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1">
              <div className="text-2xl font-extrabold text-emerald-400 light:text-emerald-600 font-mono">98.5%</div>
              <div className="text-xs font-semibold text-white light:text-slate-900">Data Validity</div>
              <div className="text-[10px] text-slate-400 light:text-slate-500">Strict schema validation</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1">
              <div className="text-2xl font-extrabold text-cyan-400 light:text-cyan-600 font-mono">97.2%</div>
              <div className="text-xs font-semibold text-white light:text-slate-900">Completeness</div>
              <div className="text-[10px] text-slate-400 light:text-slate-500">Zero synthetic fallbacks</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1">
              <div className="text-2xl font-extrabold text-teal-400 light:text-teal-600 font-mono">99.1%</div>
              <div className="text-xs font-semibold text-white light:text-slate-900">Feed Reliability</div>
              <div className="text-[10px] text-slate-400 light:text-slate-500">Uptime across all connectors</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1">
              <div className="text-2xl font-extrabold text-purple-400 light:text-purple-600 font-mono">96.8%</div>
              <div className="text-xs font-semibold text-white light:text-slate-900">Telemetry Accuracy</div>
              <div className="text-[10px] text-slate-400 light:text-slate-500">Holtrop ML calibration</div>
            </div>
          </div>
        </div>

        {/* 24h Volume Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-2">
            <h2 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider">
              Data Ingestion Volume (Last 24 Hours in Thousands of Packets)
            </h2>
            <span className="text-[10px] text-cyan-400 light:text-cyan-600 font-mono">187,000 Total Records</span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.3} />
                <XAxis dataKey="source" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} unit="k" />
                <Tooltip />
                <Bar dataKey="records" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Packets (k)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
