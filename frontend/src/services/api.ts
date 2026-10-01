import { Vessel, Voyage, Alert, OptimizationRun, User, DataSource, OptimizationResultsData } from '../types';
import {
  mockVessels,
  mockVoyages,
  mockAlerts,
  mockUsers,
  mockDataSources,
  mockLiveDataFeed,
  defaultScenarioData,
  defaultOptimizationResults
} from './mockData';

const API_BASE = '/api/v1';

async function safeFetch<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return data as T;
  } catch (err) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    return safeFetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      },
      { success: true, user: mockUsers[0], token: 'mock-jwt-token' }
    );
  },
  getUsers: async (): Promise<User[]> => {
    return safeFetch<User[]>(`${API_BASE}/auth/users`, undefined, mockUsers);
  },
  addUser: async (userData: any) => {
    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-3)}`,
      name: userData.name || 'New User',
      email: userData.email || 'user@maritime.com',
      role: userData.role || 'Fleet Analyst',
      department: userData.department || 'Operations',
      status: 'Active',
      last_login: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    };
    return safeFetch(`${API_BASE}/auth/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }, newUser);
  },

  // Vessels
  getVessels: async (): Promise<Vessel[]> => {
    return safeFetch<Vessel[]>(`${API_BASE}/vessels`, undefined, mockVessels);
  },
  getVesselById: async (id: string): Promise<Vessel> => {
    const defaultVessel = mockVessels.find(v => v.id === id) || mockVessels[0];
    return safeFetch<Vessel>(`${API_BASE}/vessels/${id}`, undefined, defaultVessel);
  },
  getVesselTelemetry: async (id: string) => {
    return safeFetch(`${API_BASE}/vessels/${id}/telemetry`, undefined, {
      rpm: 84,
      exhaust_temp_c: 435,
      fuel_flow_rate_kgh: 1020,
      vibration_mms: 2.1,
      lube_oil_pressure_bar: 4.2,
      cooling_water_temp_c: 78
    });
  },
  getVesselMaintenance: async (id: string) => {
    return safeFetch(`${API_BASE}/vessels/${id}/maintenance`, undefined, {
      overall_health_score: 94,
      components: [
        { name: 'Main Engine Cylinder Liners', health: 92, status: 'Normal', next_service: '1,200 hrs' },
        { name: 'Turbocharger Bearings', health: 96, status: 'Normal', next_service: '2,800 hrs' },
        { name: 'Fuel Injector Nozzles', health: 84, status: 'Warning', next_service: '240 hrs' },
        { name: 'Cooling Water Heat Exchanger', health: 98, status: 'Normal', next_service: '3,400 hrs' }
      ]
    });
  },

  // Voyages
  getVoyages: async (status?: string): Promise<Voyage[]> => {
    const url = status ? `${API_BASE}/voyages?status=${status}` : `${API_BASE}/voyages`;
    return safeFetch<Voyage[]>(url, undefined, mockVoyages);
  },
  createVoyage: async (voyageData: any): Promise<Voyage> => {
    const newVoy: Voyage = {
      id: `VY-${Math.floor(1000 + Math.random() * 9000)}`,
      vessel_id: voyageData.vessel_id || 'V001',
      vessel_name: voyageData.vessel_name || 'MV Ocean Star',
      cargo_type: voyageData.cargo_type || 'General Cargo',
      cargo_quantity_teu: voyageData.cargo_quantity_teu || 5000,
      cargo_weight_mt: voyageData.cargo_weight_mt || 60000,
      cargo_priority: voyageData.cargo_priority || 'Standard',
      origin_id: voyageData.origin_id || 'P01',
      origin_name: voyageData.origin_name || 'Port of Singapore',
      destination_id: voyageData.destination_id || 'P02',
      destination_name: voyageData.destination_name || 'Port of Jebel Ali',
      departure_date: voyageData.departure_date || 'Today',
      arrival_deadline: voyageData.arrival_deadline || 'In 7 days',
      estimated_arrival: voyageData.estimated_arrival || 'In 6.5 days',
      total_distance_nm: voyageData.total_distance_nm || 3400,
      distance_travelled_nm: 0,
      distance_remaining_nm: voyageData.total_distance_nm || 3400,
      avg_speed_knots: 14.0,
      progress_pct: 0,
      status: 'Upcoming',
      fuel_consumed_mt: 0,
      estimated_total_fuel_mt: 480,
      total_cost_usd: 240000,
      total_ghg_tco2e: 1512
    };
    return safeFetch(`${API_BASE}/voyages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voyageData)
    }, newVoy);
  },

  // Predictions
  predictFuel: async (params: any) => {
    return safeFetch(`${API_BASE}/predictions/fuel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, {
      predicted_fuel_mt_day: 24.2,
      confidence_interval_95: [22.8, 25.6],
      ghg_emissions_tco2e_day: 76.2
    });
  },
  getSpeedProfile: async (vesselId: string) => {
    return safeFetch(`${API_BASE}/predictions/speed-profile?vessel_id=${vesselId}`, undefined, [
      { speed: 10, fuel_rate: 12.5 },
      { speed: 12, fuel_rate: 16.8 },
      { speed: 14, fuel_rate: 23.4 },
      { speed: 16, fuel_rate: 32.1 },
      { speed: 18, fuel_rate: 45.0 }
    ]);
  },

  // Optimization
  runOptimization: async (params: any): Promise<OptimizationResultsData> => {
    return safeFetch<OptimizationResultsData>(`${API_BASE}/optimization/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, defaultOptimizationResults);
  },
  getOptimizationRuns: async (): Promise<OptimizationRun[]> => {
    const runs: OptimizationRun[] = [
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
      }
    ];
    return safeFetch<OptimizationRun[]>(`${API_BASE}/optimization/runs`, undefined, runs);
  },
  getOptimizationRunDetails: async (runId: string) => {
    return safeFetch(`${API_BASE}/optimization/runs/${runId}`, undefined, defaultOptimizationResults);
  },

  // Scenarios
  simulateScenario: async (scenarioData: any) => {
    return safeFetch(`${API_BASE}/scenarios/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenarioData)
    }, defaultScenarioData);
  },

  // Alerts
  getAlerts: async (severity?: string, status?: string, vesselId?: string): Promise<Alert[]> => {
    let url = `${API_BASE}/alerts?`;
    if (severity) url += `severity=${severity}&`;
    if (status) url += `status=${status}&`;
    if (vesselId) url += `vessel_id=${vesselId}&`;
    return safeFetch<Alert[]>(url, undefined, mockAlerts);
  },
  acknowledgeAlert: async (alertId: string) => {
    return safeFetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: 'POST' }, { success: true, alertId });
  },
  recalculateFromAlert: async (alertId: string) => {
    return safeFetch(`${API_BASE}/alerts/${alertId}/recalculate`, { method: 'POST' }, { success: true, alertId });
  },

  // Analytics
  getAnalyticsOverview: async () => {
    return safeFetch(`${API_BASE}/analytics/overview`, undefined, {
      total_fuel_saved_mt: 1420,
      total_cost_saved_usd: 780000,
      total_ghg_avoided_tco2e: 4470,
      cii_rating_average: 'A'
    });
  },
  getFuelTrends: async () => {
    return safeFetch(`${API_BASE}/analytics/fuel-trends`, undefined, [
      { month: 'Jan', baseline: 5400, actual: 4800 },
      { month: 'Feb', baseline: 5350, actual: 4720 },
      { month: 'Mar', baseline: 5500, actual: 4750 },
      { month: 'Apr', baseline: 5420, actual: 4650 }
    ]);
  },
  getBreakdowns: async () => {
    return safeFetch(`${API_BASE}/analytics/breakdowns`, undefined, {
      by_fuel_type: [
        { name: 'HFO/VLSFO', value: 58 },
        { name: 'LNG', value: 26 },
        { name: 'Methanol', value: 16 }
      ]
    });
  },
  getVesselPerformance: async () => {
    return safeFetch(`${API_BASE}/analytics/vessel-performance`, undefined, mockVessels);
  },

  // Settings
  getSettings: async () => {
    return safeFetch(`${API_BASE}/settings`, undefined, {
      organization_name: 'Maritime Optimizer Global Fleet',
      timezone: '(UTC+08:00) Singapore',
      date_format: 'DD MMM YYYY',
      default_currency: 'USD ($)',
      default_algorithm: 'Quantum-Inspired (QIEA)',
      default_pareto_solutions: 10,
      auto_refresh_sec: 4,
      email_notifications: true,
      in_app_notifications: true
    });
  },
  updateSettings: async (settings: any) => {
    return safeFetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }, { success: true, settings });
  },

  // Integrations
  getDataSources: async (): Promise<DataSource[]> => {
    return safeFetch<DataSource[]>(`${API_BASE}/integrations/sources`, undefined, mockDataSources);
  },
  getLiveDataFeed: async () => {
    return safeFetch(`${API_BASE}/integrations/feed`, undefined, mockLiveDataFeed);
  },

  // System Health
  getSystemHealth: async () => {
    return safeFetch(`${API_BASE}/system/health`, undefined, {
      status: 'All Systems Operational',
      uptime: '99.98%',
      active_microservices: 12,
      quantum_optimizer_queue: 0,
      db_connection: 'Healthy (4ms)',
      redis_cache: 'Connected (1ms)'
    });
  }
};
