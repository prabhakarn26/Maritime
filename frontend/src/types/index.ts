export interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  call_sign: string;
  vessel_type: string;
  capacity_teu: number;
  dwt: number;
  length_beam: string;
  flag: string;
  year_built: number;
  engine_power_mw: number;
  max_speed_knots: number;
  opt_speed_knots: number;
  fuel_type: string;
  fuel_capacity_mt: number;
  current_fuel_level_mt: number;
  fuel_flow_mt_day: number;
  operating_cost_day: number;
  ghg_emissions_day: number;
  engine_status: 'Normal' | 'Warning' | 'Critical';
  engine_health_pct: number;
  weather_enroute: string;
  status: 'On Route' | 'At Port' | 'Delayed' | 'Maintenance';
  current_lat: number;
  current_lng: number;
  speed_knots: number;
  heading_deg: number;
  draft_m: number;
  current_voyage_id: string;
  origin_port: string;
  destination_port: string;
  eta: string;
  shore_power_equipped: boolean;
  cii_rating: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Voyage {
  id: string;
  vessel_id: string;
  vessel_name: string;
  cargo_type: string;
  cargo_quantity_teu: number;
  cargo_weight_mt: number;
  cargo_priority: string;
  origin_id: string;
  origin_name: string;
  destination_id: string;
  destination_name: string;
  departure_date: string;
  arrival_deadline: string;
  estimated_arrival: string;
  total_distance_nm: number;
  distance_travelled_nm: number;
  distance_remaining_nm: number;
  avg_speed_knots: number;
  progress_pct: number;
  status: 'On Route' | 'At Port' | 'Delayed' | 'Upcoming' | 'Completed';
  fuel_consumed_mt: number;
  estimated_total_fuel_mt: number;
  total_cost_usd: number;
  total_ghg_tco2e: number;
}

export interface Alert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  vessel_id: string;
  vessel_name: string;
  alert_type: string;
  title: string;
  time: string;
  location: string;
  message: string;
  impact: string;
  recommendation: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  acknowledged: boolean;
}

export interface OptimizationRun {
  run_id: string;
  scenario_name: string;
  date_time: string;
  vessels_count: number;
  vessels: string[];
  route: string;
  algorithm: string;
  objective: string;
  status: string;
  runtime_seconds: number;
  pareto_solutions_count: number;
  baseline_fuel_mt: number;
  optimized_fuel_mt: number;
  fuel_saving_pct: number;
  baseline_cost_usd: number;
  optimized_cost_usd: number;
  cost_saving_pct: number;
  baseline_ghg_tco2e: number;
  optimized_ghg_tco2e: number;
  ghg_saving_pct: number;
  avg_eta_days: number;
  feasibility: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  last_login: string;
  avatar: string;
}

export interface DataSource {
  id: string;
  name: string;
  provider: string;
  status: string;
  health: string;
  latency_ms: number;
  last_update: string;
  uptime_pct: number;
  vessels_tracked: number;
  records_24h: number;
}

export interface OptimizationResultsData {
  run_id: string;
  scenario_name: string;
  vessel_name: string;
  vessel_id: string;
  route: string;
  distance_nm: number;
  summary_comparison: {
    fuel_mt: {
      baseline: number;
      conventional_ga: number;
      conventional_saving_pct: number;
      quantum_qiea: number;
      quantum_saving_pct: number;
    };
    cost_usd: {
      baseline: number;
      conventional_ga: number;
      conventional_saving_pct: number;
      quantum_qiea: number;
      quantum_saving_pct: number;
    };
    ghg_tco2e: {
      baseline: number;
      conventional_ga: number;
      conventional_saving_pct: number;
      quantum_qiea: number;
      quantum_saving_pct: number;
    };
    eta_days: {
      baseline: number;
      conventional_ga: number;
      quantum_qiea: number;
    };
    runtime_seconds: {
      baseline: number;
      conventional_ga: number;
      quantum_qiea: number;
    };
  };
  pareto_frontier: any[];
  tradeoff_archetypes: any;
  convergence_curves: {
    ga: any[];
    qiea: any[];
  };
}
