import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Vessel } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../context/ThemeContext';
import {
  Navigation,
  Anchor,
  CloudRain,
  Search,
  Crosshair,
  Radio,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';

export type MapTileProvider =
  | 'dark_osm'
  | 'ocean_marine'
  | 'light_osm'
  | 'standard_osm'
  | 'satellite'
  | 'openseamap';

interface FleetMapProps {
  vessels?: Vessel[];
  selectedVesselId?: string;
  onSelectVessel?: (vesselId: string) => void;
  height?: string;
  showRoutes?: boolean;
  showWeatherZones?: boolean;
  showPorts?: boolean;
  showControls?: boolean;
  allowFullscreen?: boolean;
}

// Major international shipping ports
const majorPorts = [
  { id: 'P01', name: 'Port of Singapore', code: 'SIN', lat: 1.2900, lng: 103.8500, country: 'Singapore', status: 'Optimal', berths_free: 6 },
  { id: 'P02', name: 'Port of Jebel Ali', code: 'DXB', lat: 24.9900, lng: 55.0600, country: 'UAE', status: 'Normal', berths_free: 4 },
  { id: 'P03', name: 'Port of Shanghai', code: 'SHA', lat: 31.2300, lng: 121.4700, country: 'China', status: 'Congested', berths_free: 2 },
  { id: 'P04', name: 'Jawaharlal Nehru Port', code: 'BOM', lat: 18.9400, lng: 72.9500, country: 'India', status: 'Normal', berths_free: 5 },
  { id: 'P05', name: 'Port of Colombo', code: 'CMB', lat: 6.9400, lng: 79.8500, country: 'Sri Lanka', status: 'Normal', berths_free: 3 },
  { id: 'P06', name: 'Port of Rotterdam', code: 'RTM', lat: 51.9200, lng: 4.4700, country: 'Netherlands', status: 'Optimal', berths_free: 8 },
  { id: 'P07', name: 'Port of Busan', code: 'PUS', lat: 35.1000, lng: 129.0400, country: 'South Korea', status: 'Normal', berths_free: 7 }
];

export const FleetMap: React.FC<FleetMapProps> = ({
  vessels = [],
  selectedVesselId,
  onSelectVessel,
  height = '500px',
  showRoutes: initialShowRoutes = true,
  showWeatherZones: initialShowWeather = true,
  showPorts: initialShowPorts = true,
  showControls = true,
  allowFullscreen = true
}) => {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  // Tile layer configuration (100% Free & Open-Source, NO API Keys / Watermarks)
  const [selectedProvider, setSelectedProvider] = useState<MapTileProvider>(
    isLight ? 'light_osm' : 'dark_osm'
  );
  const [showRoutes, setShowRoutes] = useState(initialShowRoutes);
  const [showWeather, setShowWeather] = useState(initialShowWeather);
  const [showPorts, setShowPorts] = useState(initialShowPorts);
  const [showSeamarks, setShowSeamarks] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'On Route' | 'At Port' | 'Delayed'>('All');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [telemetryOpen, setTelemetryOpen] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const seamarkLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const portMarkersRef = useRef<L.Marker[]>([]);
  const polylinesRef = useRef<L.Polyline[]>([]);
  const weatherLayersRef = useRef<L.Layer[]>([]);

  // Automatically update default provider on theme change if using default theme-based basemaps
  useEffect(() => {
    if (selectedProvider === 'dark_osm' && isLight) {
      setSelectedProvider('light_osm');
    } else if (selectedProvider === 'light_osm' && !isLight) {
      setSelectedProvider('dark_osm');
    }
  }, [resolvedTheme, isLight]);

  // Tile Layer URL Config
  const getTileConfig = (provider: MapTileProvider) => {
    switch (provider) {
      case 'dark_osm':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          attribution: '© Esri, HERE, DeLorme',
          maxZoom: 16
        };
      case 'ocean_marine':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}',
          attribution: '© Esri, GEBCO, NOAA, National Geographic',
          maxZoom: 13
        };
      case 'light_osm':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          attribution: '© Esri, HERE, Garmin',
          maxZoom: 16
        };
      case 'standard_osm':
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Source: Esri, Maxar, Earthstar Geographics',
          maxZoom: 18
        };
      case 'openseamap':
      default:
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '© OpenStreetMap contributors, OpenSeaMap',
          maxZoom: 18
        };
    }
  };

  // Filter vessels based on status filter and search query
  const filteredVessels = useMemo(() => {
    return vessels.filter((v) => {
      const matchesStatus = statusFilter === 'All' ? true : v.status === statusFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vessel_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.destination_port.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [vessels, statusFilter, searchQuery]);

  // Fit all vessels in view
  const fitFleetBounds = () => {
    if (!mapInstanceRef.current) return;
    if (vessels.length > 0) {
      const bounds = L.latLngBounds(vessels.map((v) => [v.current_lat, v.current_lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 7 });
    } else {
      mapInstanceRef.current.setView([14.0, 78.0], 4);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Center on specific vessel
  const centerOnVessel = (vId: string) => {
    const target = vessels.find((v) => v.id === vId);
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([target.current_lat, target.current_lng], 7, {
        duration: 1.2
      });
      if (markersRef.current[vId]) {
        markersRef.current[vId].openPopup();
      }
    }
  };

  // Initialize and keep Map updated
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [14.0, 78.0],
        zoom: 4,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      // Add base open-source tile layer
      const config = getTileConfig(selectedProvider);
      const baseLayer = L.tileLayer(config.url, {
        maxZoom: config.maxZoom,
        attribution: config.attribution
      }).addTo(map);

      baseTileLayerRef.current = baseLayer;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Invalidate map size multiple times to ensure perfect render
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 200);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    // Update base tile layer if provider changed
    if (baseTileLayerRef.current) {
      const config = getTileConfig(selectedProvider);
      baseTileLayerRef.current.setUrl(config.url);
    }

    // Toggle OpenSeaMap nautical seamarks overlay
    if (showSeamarks || selectedProvider === 'openseamap') {
      if (!seamarkLayerRef.current) {
        seamarkLayerRef.current = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
          maxZoom: 18,
          opacity: 0.95
        }).addTo(map);
      }
    } else if (seamarkLayerRef.current) {
      seamarkLayerRef.current.remove();
      seamarkLayerRef.current = null;
    }

    // Clear old layers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    portMarkersRef.current.forEach((m) => m.remove());
    portMarkersRef.current = [];

    polylinesRef.current.forEach((l) => l.remove());
    polylinesRef.current = [];

    weatherLayersRef.current.forEach((w) => w.remove());
    weatherLayersRef.current = [];

    // 1. Render Weather Hazard Zones
    if (showWeather) {
      // Bay of Bengal Cyclone Hazard Polygon
      const cycloneZone = L.polygon(
        [
          [16.0, 84.0],
          [14.5, 89.5],
          [8.0, 87.0],
          [7.5, 81.5],
          [12.0, 80.5]
        ],
        {
          color: '#f43f5e',
          weight: 1.5,
          fillColor: '#f43f5e',
          fillOpacity: 0.18,
          dashArray: '6, 6'
        }
      ).addTo(map);

      cycloneZone.bindTooltip('⚠️ Cyclone Hazard: 45kn Crosswinds & 4.8m Swells', {
        permanent: false,
        direction: 'center',
        className: 'weather-tooltip'
      });
      weatherLayersRef.current.push(cycloneZone);

      // Arabian Sea Monsoonal Advisory Zone
      const monsoonZone = L.polygon(
        [
          [21.0, 62.0],
          [19.0, 71.0],
          [13.0, 68.0],
          [14.0, 59.0]
        ],
        {
          color: '#f59e0b',
          weight: 1.5,
          fillColor: '#f59e0b',
          fillOpacity: 0.12,
          dashArray: '4, 4'
        }
      ).addTo(map);

      monsoonZone.bindTooltip('🌊 Monsoonal Swell: Headsea Resistance +8%', {
        permanent: false,
        direction: 'center',
        className: 'weather-tooltip'
      });
      weatherLayersRef.current.push(monsoonZone);
    }

    // 2. Render Major Maritime Shipping Lanes
    if (showRoutes) {
      const routes = [
        {
          name: 'Singapore -> Dubai (East-West Trunk)',
          color: isLight ? '#0284c7' : '#38bdf8',
          coords: [
            [1.29, 103.85],
            [5.80, 95.20],
            [6.00, 80.20],
            [9.50, 72.00],
            [22.50, 60.00],
            [24.99, 55.06]
          ] as [number, number][]
        },
        {
          name: 'Shanghai -> Mumbai (Silk Road)',
          color: isLight ? '#7c3aed' : '#a855f7',
          coords: [
            [31.23, 121.47],
            [22.28, 114.17],
            [1.29, 103.85],
            [6.00, 80.20],
            [18.94, 72.95]
          ] as [number, number][]
        },
        {
          name: 'Colombo -> Rotterdam (Suez Corridor)',
          color: isLight ? '#059669' : '#10b981',
          coords: [
            [6.94, 79.85],
            [12.50, 52.00],
            [27.80, 34.20],
            [36.00, 15.00],
            [36.00, -5.00],
            [51.92, 4.47]
          ] as [number, number][]
        }
      ];

      routes.forEach((r) => {
        const line = L.polyline(r.coords, {
          color: r.color,
          weight: 2.5,
          opacity: 0.8,
          dashArray: '6, 8'
        }).addTo(map);

        line.bindTooltip(r.name, { sticky: true, className: 'route-tooltip' });
        polylinesRef.current.push(line);
      });
    }

    // 3. Render Major Hub Ports
    if (showPorts) {
      majorPorts.forEach((port) => {
        const portIcon = L.divIcon({
          className: 'custom-port-marker',
          html: `
            <div class="relative flex items-center justify-center group cursor-pointer">
              <div class="h-6 w-6 rounded-full bg-slate-950/90 border border-cyan-400/80 shadow-md flex items-center justify-center hover:scale-125 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="5" r="3" />
                  <line x1="12" y1="22" x2="12" y2="8" />
                  <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
                </svg>
              </div>
              <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.2 rounded bg-slate-950/90 border border-slate-700 text-[9px] font-mono font-semibold text-cyan-300 shadow">
                ${port.code}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const pMarker = L.marker([port.lat, port.lng], { icon: portIcon }).addTo(map);
        pMarker.bindPopup(`
          <div class="p-2 space-y-1.5 text-xs">
            <div class="font-bold text-cyan-400 text-sm border-b border-slate-700 pb-1">${port.name} (${port.code})</div>
            <div class="text-slate-300">Country: <span class="text-white font-semibold">${port.country}</span></div>
            <div class="text-slate-300">Berth Status: <span class="text-emerald-400 font-semibold">${port.status}</span></div>
            <div class="text-slate-300">Free Berths: <span class="font-mono text-cyan-300 font-bold">${port.berths_free} Available</span></div>
          </div>
        `);
        portMarkersRef.current.push(pMarker);
      });
    }

    // 4. Render Realistic Tactical Frigate Silhouettes with Dynamic Heading
    filteredVessels.forEach((v) => {
      const isSelected = v.id === selectedVesselId;
      const isWarning = v.status === 'Delayed' || v.engine_status === 'Warning';
      const isCritical = (v.weather_enroute && v.weather_enroute.includes('Cyclone')) || v.engine_status === 'Critical';

      const statusColor = isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#10b981';
      const strokeColor = isSelected ? '#38bdf8' : statusColor;

      // Naval frigate hull silhouette SVG
      const frigateSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 70" class="w-full h-full filter drop-shadow-md">
          <!-- Heading Vector Pointer Line -->
          <line x1="20" y1="12" x2="20" y2="0" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="2,2" />
          
          <!-- Outer Hydrodynamic Frigate Hull Profile -->
          <path d="M20,6 C26,16 32,34 32,54 C32,62 28,66 20,66 C12,66 8,62 8,54 C8,34 14,16 20,6 Z" 
                fill="${isLight ? '#ffffff' : '#091322'}" 
                stroke="${strokeColor}" 
                stroke-width="2.5" />
          
          <!-- Vessel Deck Hatch -->
          <path d="M16,22 L24,22 L26,44 L14,44 Z" 
                fill="${strokeColor}35" 
                stroke="${strokeColor}" 
                stroke-width="1.2" />
          
          <!-- Bridge Tower / Radar Superstructure -->
          <rect x="17" y="46" width="6" height="8" rx="1.5" fill="${strokeColor}" />
          <circle cx="20" cy="50" r="1.5" fill="#ffffff" />
          
          <!-- Twin Propeller Wake Bubbles -->
          <circle cx="15" cy="68" r="1.5" fill="${strokeColor}" opacity="0.6" />
          <circle cx="25" cy="68" r="1.5" fill="${strokeColor}" opacity="0.6" />
        </svg>
      `;

      // Radar sonar ripple ring for selected or critical frigate
      const radarPingRing = (isSelected || isCritical)
        ? `<div class="absolute -inset-3 rounded-full border-2 border-cyan-400 opacity-75 animate-ping pointer-events-none"></div>`
        : '';

      const vesselMarkerIcon = L.divIcon({
        className: 'frigate-vessel-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
            ${radarPingRing}
            
            <!-- Rotating Frigate Silhouette matching True Heading -->
            <div class="w-8 h-12 flex items-center justify-center transition-transform duration-300 hover:scale-125 ${
              isSelected ? 'scale-125' : ''
            }" style="transform: rotate(${v.heading_deg}deg);">
              ${frigateSvg}
            </div>
            
            <!-- Speed Badge -->
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold shadow-md ${
              isLight ? 'bg-white text-slate-800 border border-slate-300' : 'bg-slate-950 text-cyan-300 border border-cyan-500/50'
            }">
              ${v.speed_knots} kn
            </div>
            
            <!-- Vessel Label -->
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-semibold tracking-tight shadow-md border ${
              isSelected
                ? 'bg-cyan-500 text-white border-cyan-400 font-bold scale-105'
                : isLight
                ? 'bg-white/95 text-slate-900 border-slate-300'
                : 'bg-slate-950/95 text-slate-200 border-slate-700'
            }">
              ${v.name}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([v.current_lat, v.current_lng], { icon: vesselMarkerIcon }).addTo(map);

      // Interactive Tactical Popup
      const popupHtml = `
        <div class="p-2.5 space-y-2 text-xs font-sans min-w-[240px]">
          <div class="flex items-center justify-between border-b ${isLight ? 'border-slate-200' : 'border-slate-700'} pb-2">
            <div>
              <div class="font-extrabold ${isLight ? 'text-cyan-700' : 'text-cyan-400'} text-sm flex items-center gap-1.5">
                <span>${v.name}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">${v.id}</span>
              </div>
              <div class="text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}">${v.vessel_type} • IMO: ${v.imo}</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
              v.status === 'On Route'
                ? (isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40')
                : (isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-950 text-amber-300 border border-amber-500/40')
            }">${v.status}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}">
            <div class="flex justify-between border-b ${isLight ? 'border-slate-100' : 'border-slate-800'} pb-1">
              <span>Speed (SOG):</span>
              <span class="font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${v.speed_knots} kn</span>
            </div>
            <div class="flex justify-between border-b ${isLight ? 'border-slate-100' : 'border-slate-800'} pb-1">
              <span>Heading:</span>
              <span class="font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}">${v.heading_deg}°</span>
            </div>
            <div class="flex justify-between border-b ${isLight ? 'border-slate-100' : 'border-slate-800'} pb-1">
              <span>Fuel Burn:</span>
              <span class="font-mono font-bold text-amber-500">${v.fuel_flow_mt_day} MT/d</span>
            </div>
            <div class="flex justify-between border-b ${isLight ? 'border-slate-100' : 'border-slate-800'} pb-1">
              <span>CII Rating:</span>
              <span class="font-bold text-emerald-500">Grade ${v.cii_rating}</span>
            </div>
          </div>

          <div class="space-y-1 text-[11px] ${isLight ? 'text-slate-600 bg-slate-50' : 'text-slate-300 bg-slate-900/80'} p-2 rounded-lg border ${isLight ? 'border-slate-200' : 'border-slate-800'}">
            <div class="flex justify-between">
              <span class="text-slate-400">Destination:</span>
              <span class="font-semibold text-right ${isLight ? 'text-slate-900' : 'text-white'}">${v.destination_port}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">ETA:</span>
              <span class="font-mono font-bold ${isLight ? 'text-slate-900' : 'text-cyan-300'}">${v.eta}</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectVessel) {
          onSelectVessel(v.id);
        }
      });

      markersRef.current[v.id] = marker;
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [
    vessels,
    filteredVessels,
    selectedVesselId,
    selectedProvider,
    showRoutes,
    showWeather,
    showPorts,
    showSeamarks,
    isLight
  ]);

  // Handle Container Resizing automatically
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const selectedVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0];

  return (
    <div
      ref={mapWrapperRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 light:border-slate-300 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none h-screen w-screen' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="w-full h-full bg-[#0a1122]" />

      {/* Top Floating Operations HUD */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Left HUD: Search & Status Filter Chips */}
          <div className="flex items-center flex-wrap gap-1.5 pointer-events-auto bg-slate-950/90 light:bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 light:border-slate-300 shadow-lg">
            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fleet / port..."
                className="pl-8 pr-6 py-1 text-xs rounded-lg bg-slate-900 light:bg-slate-100 border border-slate-700/60 light:border-slate-300 text-white light:text-slate-900 placeholder-slate-500 w-36 sm:w-44 focus:w-52 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 border-l border-slate-800 light:border-slate-200 pl-1.5">
              {(['All', 'On Route', 'At Port', 'Delayed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Right HUD: Basemap Selector + Layer Toggles + Zoom / Fullscreen */}
          <div className="flex items-center flex-wrap gap-1.5 pointer-events-auto bg-slate-950/90 light:bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 light:border-slate-300 shadow-lg">
            {/* Basemap Selector */}
            <div className="relative flex items-center">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as MapTileProvider)}
                aria-label="Map Basemap Provider"
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 light:bg-slate-100 border border-slate-700/60 light:border-slate-300 text-white light:text-slate-900 focus:outline-none cursor-pointer appearance-none pr-6"
              >
                <option value="dark_osm">🌙 Dark Slate</option>
                <option value="ocean_marine">🌊 Ocean Depth</option>
                <option value="light_osm">☀️ Daylight</option>
                <option value="standard_osm">🗺️ OpenStreetMap</option>
                <option value="satellite">🛰️ Satellite</option>
                <option value="openseamap">⚓ OpenSeaMap</option>
              </select>
              <ChevronDown className="absolute right-2 h-3 w-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-1 border-l border-slate-800 light:border-slate-200 pl-1.5">
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  showRoutes
                    ? 'bg-cyan-500/25 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Toggle Shipping Corridors"
              >
                <Navigation className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setShowWeather(!showWeather)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  showWeather
                    ? 'bg-rose-500/25 text-rose-400 border border-rose-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Toggle Weather Cyclone & Swell Hazards"
              >
                <CloudRain className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setShowPorts(!showPorts)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  showPorts
                    ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Toggle Major Hub Ports"
              >
                <Anchor className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={fitFleetBounds}
                className="p-1.5 rounded-lg text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200"
                title="Re-center all vessels"
              >
                <Crosshair className="h-3.5 w-3.5" />
              </button>

              {/* Dedicated Custom Zoom Buttons */}
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200"
                title="Zoom In"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200"
                title="Zoom Out"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              {/* Fullscreen Toggle */}
              {allowFullscreen && (
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-200"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Left Telemetry Summary HUD */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 light:bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 light:border-slate-300 shadow-xl max-w-xs sm:max-w-sm hidden sm:block">
        <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-1.5 mb-2">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white light:text-slate-900">Live Frigate AIS Telemetry</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 light:text-cyan-700 font-bold">
            {filteredVessels.length} Tracking
          </span>
        </div>

        {selectedVessel ? (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 light:text-cyan-700">{selectedVessel.name}</span>
              <button
                onClick={() => centerOnVessel(selectedVessel.id)}
                className="text-[10px] text-cyan-400 light:text-cyan-600 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Crosshair className="h-2.5 w-2.5" />
                <span>Locate</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-300 light:text-slate-700">
              <div>SPD: <span className="text-white light:text-slate-900 font-bold">{selectedVessel.speed_knots} kn</span></div>
              <div>HDG: <span className="text-white light:text-slate-900 font-bold">{selectedVessel.heading_deg}°</span></div>
              <div>FUEL: <span className="text-amber-400 font-bold">{selectedVessel.fuel_flow_mt_day} t/d</span></div>
            </div>
            <div className="text-[10px] text-slate-400 light:text-slate-500 truncate">
              Dest: <span className="text-slate-200 light:text-slate-800 font-medium">{selectedVessel.destination_port}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400">Click any vessel frigate icon on map to lock tracking</div>
        )}
      </div>

      {/* Floating Bottom Right Legend Box */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-950/90 light:bg-white/95 backdrop-blur-md border border-slate-700/80 light:border-slate-300 rounded-xl p-2.5 text-xs text-slate-300 light:text-slate-700 space-y-1 shadow-xl">
        <div className="font-bold text-white light:text-slate-900 border-b border-slate-800 light:border-slate-200 pb-1 flex items-center justify-between gap-4 text-[11px]">
          <span>Fleet Legend</span>
          <span className="text-[9px] font-mono text-cyan-400">OpenSource</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>On Route ({vessels.filter((v) => v.status === 'On Route').length})</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2 w-2 rounded-full bg-amber-400"></span>
          <span>At Port ({vessels.filter((v) => v.status === 'At Port').length})</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse"></span>
          <span>Delayed / Caution ({vessels.filter((v) => v.status === 'Delayed').length})</span>
        </div>
      </div>
    </div>
  );
};
