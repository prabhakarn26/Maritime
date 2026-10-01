import { Vessel, Voyage, Alert, OptimizationRun, User, DataSource, OptimizationResultsData } from '../types';

export const mockVessels: Vessel[] = [
  {
    id: 'V001',
    name: 'MV Ocean Star',
    imo: '9756432',
    mmsi: '563210987',
    call_sign: '9V1234',
    vessel_type: 'Container Ship',
    capacity_teu: 8500,
    dwt: 95000,
    length_beam: '300m x 48m',
    flag: 'Singapore',
    year_built: 2018,
    engine_power_mw: 24.5,
    max_speed_knots: 22.0,
    opt_speed_knots: 14.2,
    fuel_type: 'HFO / MGO / LNG (Dual Fuel)',
    fuel_capacity_mt: 3800,
    current_fuel_level_mt: 2420,
    fuel_flow_mt_day: 24.5,
    operating_cost_day: 48200,
    ghg_emissions_day: 78.6,
    engine_status: 'Normal',
    engine_health_pct: 94,
    weather_enroute: 'Moderate',
    status: 'On Route',
    current_lat: 12.2410,
    current_lng: 88.7521,
    speed_knots: 14.3,
    heading_deg: 245,
    draft_m: 12.4,
    current_voyage_id: 'VY-1001',
    origin_port: 'Port of Singapore',
    destination_port: 'Port of Jebel Ali (Dubai)',
    eta: '3 Nov 2026, 06:15 UTC',
    shore_power_equipped: true,
    cii_rating: 'A'
  },
  {
    id: 'V002',
    name: 'SS Pacific Voyager',
    imo: '9845120',
    mmsi: '563987123',
    call_sign: '9V5678',
    vessel_type: 'Bulk Carrier',
    capacity_teu: 4200,
    dwt: 68000,
    length_beam: '225m x 32m',
    flag: 'Panama',
    year_built: 2020,
    engine_power_mw: 18.2,
    max_speed_knots: 19.5,
    opt_speed_knots: 13.0,
    fuel_type: 'VLSFO',
    fuel_capacity_mt: 2900,
    current_fuel_level_mt: 1840,
    fuel_flow_mt_day: 19.8,
    operating_cost_day: 36500,
    ghg_emissions_day: 62.4,
    engine_status: 'Normal',
    engine_health_pct: 96,
    weather_enroute: 'Calm',
    status: 'On Route',
    current_lat: 18.9400,
    current_lng: 72.9500,
    speed_knots: 13.2,
    heading_deg: 180,
    draft_m: 11.2,
    current_voyage_id: 'VY-1002',
    origin_port: 'Port of Shanghai',
    destination_port: 'Jawaharlal Nehru Port (Mumbai)',
    eta: '4 Nov 2026, 14:30 UTC',
    shore_power_equipped: true,
    cii_rating: 'A'
  },
  {
    id: 'V003',
    name: 'MV Arctic Pioneer',
    imo: '9678231',
    mmsi: '563456789',
    call_sign: '9V8901',
    vessel_type: 'LNG Tanker',
    capacity_teu: 5500,
    dwt: 82000,
    length_beam: '280m x 42m',
    flag: 'Liberia',
    year_built: 2019,
    engine_power_mw: 22.0,
    max_speed_knots: 20.5,
    opt_speed_knots: 13.8,
    fuel_type: 'LNG Boil-Off / MGO',
    fuel_capacity_mt: 3400,
    current_fuel_level_mt: 2100,
    fuel_flow_mt_day: 21.2,
    operating_cost_day: 52000,
    ghg_emissions_day: 58.1,
    engine_status: 'Warning',
    engine_health_pct: 82,
    weather_enroute: 'Cyclone Warning',
    status: 'Delayed',
    current_lat: 8.5000,
    current_lng: 82.2000,
    speed_knots: 11.4,
    heading_deg: 270,
    draft_m: 11.8,
    current_voyage_id: 'VY-1003',
    origin_port: 'Port of Colombo',
    destination_port: 'Port of Rotterdam',
    eta: '8 Nov 2026, 18:00 UTC',
    shore_power_equipped: false,
    cii_rating: 'B'
  },
  {
    id: 'V004',
    name: 'MV Global Carrier',
    imo: '9912345',
    mmsi: '563112233',
    call_sign: '9V2345',
    vessel_type: 'Container Ship',
    capacity_teu: 12000,
    dwt: 120000,
    length_beam: '366m x 51m',
    flag: 'Marshall Islands',
    year_built: 2021,
    engine_power_mw: 32.0,
    max_speed_knots: 24.0,
    opt_speed_knots: 15.0,
    fuel_type: 'Methanol Dual Fuel',
    fuel_capacity_mt: 4500,
    current_fuel_level_mt: 3600,
    fuel_flow_mt_day: 28.0,
    operating_cost_day: 61000,
    ghg_emissions_day: 42.0,
    engine_status: 'Normal',
    engine_health_pct: 98,
    weather_enroute: 'Calm',
    status: 'At Port',
    current_lat: 1.2900,
    current_lng: 103.8500,
    speed_knots: 0.0,
    heading_deg: 0,
    draft_m: 14.5,
    current_voyage_id: 'VY-1004',
    origin_port: 'Port of Busan',
    destination_port: 'Port of Singapore',
    eta: 'At Berth',
    shore_power_equipped: true,
    cii_rating: 'A'
  }
];

export const mockVoyages: Voyage[] = [
  {
    id: 'VY-1001',
    vessel_id: 'V001',
    vessel_name: 'MV Ocean Star',
    cargo_type: 'High-Value Electronics & Auto Parts',
    cargo_quantity_teu: 7800,
    cargo_weight_mt: 82000,
    cargo_priority: 'Express (Critical SLA)',
    origin_id: 'P01',
    origin_name: 'Port of Singapore',
    destination_id: 'P02',
    destination_name: 'Port of Jebel Ali (Dubai)',
    departure_date: '28 Oct 2026, 04:00 UTC',
    arrival_deadline: '03 Nov 2026, 12:00 UTC',
    estimated_arrival: '03 Nov 2026, 06:15 UTC',
    total_distance_nm: 3400,
    distance_travelled_nm: 2150,
    distance_remaining_nm: 1250,
    avg_speed_knots: 14.3,
    progress_pct: 63,
    status: 'On Route',
    fuel_consumed_mt: 320,
    estimated_total_fuel_mt: 495,
    total_cost_usd: 245000,
    total_ghg_tco2e: 1560
  },
  {
    id: 'VY-1002',
    vessel_id: 'V002',
    vessel_name: 'SS Pacific Voyager',
    cargo_type: 'Refined Industrial Chemicals & Mineral Ore',
    cargo_quantity_teu: 3900,
    cargo_weight_mt: 58000,
    cargo_priority: 'Standard Tier 2',
    origin_id: 'P03',
    origin_name: 'Port of Shanghai',
    destination_id: 'P04',
    destination_name: 'Jawaharlal Nehru Port (Mumbai)',
    departure_date: '25 Oct 2026, 10:00 UTC',
    arrival_deadline: '05 Nov 2026, 00:00 UTC',
    estimated_arrival: '04 Nov 2026, 14:30 UTC',
    total_distance_nm: 4200,
    distance_travelled_nm: 3400,
    distance_remaining_nm: 800,
    avg_speed_knots: 13.2,
    progress_pct: 81,
    status: 'On Route',
    fuel_consumed_mt: 410,
    estimated_total_fuel_mt: 510,
    total_cost_usd: 295000,
    total_ghg_tco2e: 1600
  },
  {
    id: 'VY-1003',
    vessel_id: 'V003',
    vessel_name: 'MV Arctic Pioneer',
    cargo_type: 'Cryogenic Liquefied Natural Gas (LNG)',
    cargo_quantity_teu: 5200,
    cargo_weight_mt: 74000,
    cargo_priority: 'Temperature Sensitive Cold Chain',
    origin_id: 'P05',
    origin_name: 'Port of Colombo',
    destination_id: 'P06',
    destination_name: 'Port of Rotterdam',
    departure_date: '29 Oct 2026, 18:00 UTC',
    arrival_deadline: '07 Nov 2026, 12:00 UTC',
    estimated_arrival: '08 Nov 2026, 18:00 UTC',
    total_distance_nm: 6800,
    distance_travelled_nm: 1800,
    distance_remaining_nm: 5000,
    avg_speed_knots: 11.4,
    progress_pct: 26,
    status: 'Delayed',
    fuel_consumed_mt: 290,
    estimated_total_fuel_mt: 1120,
    total_cost_usd: 680000,
    total_ghg_tco2e: 3500
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-101',
    severity: 'Critical',
    vessel_id: 'V003',
    vessel_name: 'MV Arctic Pioneer',
    alert_type: 'Weather Severe Cyclone Hazard',
    title: 'Severe Cyclone En-Route Waypoint WP-07',
    time: '12 mins ago, 22:45 UTC',
    location: 'Bay of Bengal [Lat 8.5°N, Lng 82.2°E]',
    message: 'Wave height exceeds 4.8m with sustained 42-knot crosswinds. Estimated fuel burn increase +28% if route maintained.',
    impact: 'Estimated 30-hour arrival delay and $42,000 extra bunker fuel burn.',
    recommendation: 'Divert south via waypoint WP-07S. QIEA recommends 1.8-knot speed reduction to skirt periphery.',
    status: 'Active',
    acknowledged: false
  },
  {
    id: 'ALT-102',
    severity: 'Warning',
    vessel_id: 'V001',
    vessel_name: 'MV Ocean Star',
    alert_type: 'Engine Anomaly Predictive',
    title: 'Cylinder #4 Exhaust Gas Temperature Spike',
    time: '45 mins ago, 22:12 UTC',
    location: 'Arabian Sea [Lat 12.2°N, Lng 88.7°E]',
    message: 'Cylinder #4 temp reached 485°C (baseline 440°C). Possible fuel injector fouling.',
    impact: 'Slight fuel flow increase of +0.8 MT/day.',
    recommendation: 'Inspect injector at Jebel Ali port. Maintain current engine RPM limits.',
    status: 'Active',
    acknowledged: false
  },
  {
    id: 'ALT-103',
    severity: 'Info',
    vessel_id: 'V002',
    vessel_name: 'SS Pacific Voyager',
    alert_type: 'ECA Zone Entry',
    title: 'Approaching IMO Emission Control Area',
    time: '2 hours ago, 20:55 UTC',
    location: 'Indian Ocean Coastal Boundary',
    message: 'Vessel will enter 0.1% Sulfur regulated boundary in 4.5 hours.',
    impact: 'Switch to Low-Sulfur MGO required.',
    recommendation: 'Automated fuel switchover protocol armed.',
    status: 'Acknowledged',
    acknowledged: true
  }
];

export const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Prabhakar Sharma',
    email: 'prabhakar.admin@maritime.com',
    role: 'Administrator',
    department: 'IT & Operations',
    status: 'Active',
    last_login: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
  },
  {
    id: 'USR-002',
    name: 'Captain Elena Vance',
    email: 'elena.vance@maritime.com',
    role: 'Fleet Analyst',
    department: 'Navigation & Dispatch',
    status: 'Active',
    last_login: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  }
];

export const mockDataSources: DataSource[] = [
  {
    id: 'SRC-01',
    name: 'Spire Global AIS Stream',
    provider: 'Spire Satellite Marine',
    status: 'Connected',
    health: '99.98%',
    latency_ms: 18,
    last_update: '1s ago',
    uptime_pct: 99.98,
    vessels_tracked: 42,
    records_24h: 112000
  },
  {
    id: 'SRC-02',
    name: 'NOAA Global Wave & Ocean Weather',
    provider: 'National Oceanic Atmospheric Admin',
    status: 'Connected',
    health: '99.95%',
    latency_ms: 32,
    last_update: '3s ago',
    uptime_pct: 99.95,
    vessels_tracked: 42,
    records_24h: 34000
  },
  {
    id: 'SRC-03',
    name: 'Port Congestion & Berth APIs',
    provider: 'Global Port Community Systems',
    status: 'Connected',
    health: '99.90%',
    latency_ms: 45,
    last_update: '10s ago',
    uptime_pct: 99.90,
    vessels_tracked: 18,
    records_24h: 12000
  },
  {
    id: 'SRC-04',
    name: 'S&P Platts Bunker Price Index',
    provider: 'S&P Global Commodity Insights',
    status: 'Connected',
    health: '100%',
    latency_ms: 60,
    last_update: '1m ago',
    uptime_pct: 100.0,
    vessels_tracked: 42,
    records_24h: 8500
  },
  {
    id: 'SRC-05',
    name: 'IMO MEPC GISIS Carbon Database',
    provider: 'International Maritime Organization',
    status: 'Connected',
    health: '100%',
    latency_ms: 80,
    last_update: '5m ago',
    uptime_pct: 100.0,
    vessels_tracked: 42,
    records_24h: 2500
  },
  {
    id: 'SRC-06',
    name: 'Copernicus Ocean Current & Wind',
    provider: 'European Space Agency (ESA)',
    status: 'Connected',
    health: '99.92%',
    latency_ms: 40,
    last_update: '2s ago',
    uptime_pct: 99.92,
    vessels_tracked: 42,
    records_24h: 18000
  }
];

export const mockLiveDataFeed = [
  { id: '1', time: '14:32:01', source: 'AIS Stream', type: 'Position Telemetry', details: 'MV Ocean Star Lat 12.24, Lng 88.75 (14.3 kn)', status: 'Success' },
  { id: '2', time: '14:31:58', source: 'NOAA Weather', type: 'Wave Grid Update', details: 'Bay of Bengal Sector 4: 2.1m swell, 18kn NE', status: 'Success' },
  { id: '3', time: '14:31:54', source: 'IoT Engine Stream', type: 'RPM & Temp', details: 'SS Pacific Voyager Main Engine: 82 RPM, 432°C', status: 'Success' },
  { id: '4', time: '14:31:50', source: 'Port Intel', type: 'Berth Window', details: 'Port of Jebel Ali: Berth #3 cleared for VY-1001', status: 'Success' }
];

export const defaultScenarioData = {
  scenario_type: 'higher_fuel',
  base_case: {
    total_fuel_mt: 5420,
    total_cost_usd: 2800000,
    total_ghg_tco2e: 16230,
    avg_eta_days: 12.5,
    on_time_reliability_pct: 94.0
  },
  scenario_result: {
    total_fuel_mt: 5210,
    total_cost_usd: 3140000,
    total_ghg_tco2e: 15600,
    avg_eta_days: 12.8,
    feasibility: 'Feasible (QIEA Verified)',
    on_time_reliability_pct: 92.5
  },
  delta: {
    fuel_pct: -3.8,
    cost_pct: 12.1,
    ghg_pct: -3.9
  },
  cost_breakdown: {
    fuel_cost: 1650000,
    vessel_opex: 820000,
    port_charges: 430000,
    carbon_tax: 240000
  },
  fleet_impact: [
    { vessel: 'MV Ocean Star', status: 'On Route', base_fuel: 495, scen_fuel: 468, delta_pct: -5.4 },
    { vessel: 'SS Pacific Voyager', status: 'On Route', base_fuel: 510, scen_fuel: 492, delta_pct: -3.5 },
    { vessel: 'MV Arctic Pioneer', status: 'Delayed', base_fuel: 1120, scen_fuel: 1080, delta_pct: -3.6 }
  ],
  insights_and_recommendations: [
    'Reducing cruising speed by 1.2 knots along Malacca Strait yields 3.8% bunker fuel savings.',
    'Engage Cold Ironing (shore power) at destination port to offset 18.5 MT auxiliary fuel.',
    'Re-route through southern Sri Lanka waypoint to avoid heavy monsoonal swell resistance.'
  ]
};

export const defaultOptimizationResults: OptimizationResultsData = {
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
      baseline: 12.8,
      conventional_ga: 12.2,
      quantum_qiea: 11.9
    },
    runtime_seconds: {
      baseline: 0.1,
      conventional_ga: 4.8,
      quantum_qiea: 1.2
    }
  },
  pareto_frontier: [
    { id: 'Sol-1', fuel_mt: 4650, cost_usd: 2300000, ghg_tco2e: 13950, eta_days: 11.9, label: 'Balanced Optimum (QIEA)' },
    { id: 'Sol-2', fuel_mt: 4520, cost_usd: 2420000, ghg_tco2e: 13560, eta_days: 12.4, label: 'Eco Minimum GHG' },
    { id: 'Sol-3', fuel_mt: 4890, cost_usd: 2210000, ghg_tco2e: 14670, eta_days: 11.2, label: 'Speed Priority' }
  ],
  tradeoff_archetypes: {
    balanced: { name: 'QIEA Balanced Pareto #1', fuel: 4650, cost: 2.30, emissions: 13950, speed: 14.2 },
    eco: { name: 'Green Decarbonization #2', fuel: 4520, cost: 2.42, emissions: 13560, speed: 13.5 },
    speed: { name: 'Express Schedule #3', fuel: 4890, cost: 2.21, emissions: 14670, speed: 15.6 }
  },
  convergence_curves: {
    ga: [
      { gen: 0, fitness: 120 }, { gen: 20, fitness: 85 }, { gen: 40, fitness: 62 }, { gen: 60, fitness: 52 }, { gen: 80, fitness: 48 }, { gen: 100, fitness: 46 }
    ],
    qiea: [
      { gen: 0, fitness: 120 }, { gen: 20, fitness: 58 }, { gen: 40, fitness: 39 }, { gen: 60, fitness: 32 }, { gen: 80, fitness: 29 }, { gen: 100, fitness: 28 }
    ]
  }
};
