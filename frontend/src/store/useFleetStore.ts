import { useState, useEffect } from 'react';
import { Vessel, Voyage, Alert, User, OptimizationResultsData } from '../types';
import { api } from '../services/api';
import { wsService } from '../services/websocket';
import {
  mockVessels,
  mockVoyages,
  mockAlerts,
  mockUsers,
  defaultOptimizationResults
} from '../services/mockData';

export type ScreenId =
  | 'screen_1_login'
  | 'screen_2_fleet_overview'
  | 'screen_3_vessel_details'
  | 'screen_4_voyages'
  | 'screen_5_optimization_studio'
  | 'screen_6_optimization_results'
  | 'screen_7_scenario_simulator'
  | 'screen_8_alerts'
  | 'screen_9_reports'
  | 'screen_10_settings'
  | 'screen_11_live_integrations'
  | 'screen_12_vessel_telemetry'
  | 'screen_13_maintenance'
  | 'screen_14_users'
  | 'screen_15_optimization_history'
  | 'screen_16_system_health';

export function useFleetState() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('screen_2_fleet_overview');
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);

  const [vessels, setVessels] = useState<Vessel[]>(mockVessels);
  const [voyages, setVoyages] = useState<Voyage[]>(mockVoyages);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedVesselId, setSelectedVesselId] = useState<string>('V001');
  const [selectedVoyageId, setSelectedVoyageId] = useState<string>('VY-1001');
  const [selectedRunId, setSelectedRunId] = useState<string>('OPT-2026-048');
  const [lastOptimizationResult, setLastOptimizationResult] = useState<OptimizationResultsData | null>(defaultOptimizationResults);
  const [lastTelemetryTime, setLastTelemetryTime] = useState<string>('Live (1s ago)');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initial load from backend (with automatic fallback)
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [vList, voyList, altList] = await Promise.all([
          api.getVessels(),
          api.getVoyages(),
          api.getAlerts()
        ]);
        if (Array.isArray(vList) && vList.length) setVessels(vList);
        if (Array.isArray(voyList) && voyList.length) setVoyages(voyList);
        if (Array.isArray(altList) && altList.length) setAlerts(altList);
      } catch (e) {
        console.error('Error fetching initial data:', e);
      }
    }
    loadInitialData();

    // Subscribe to WebSocket live updates
    const unsubscribe = wsService.subscribe('FLEET_TELEMETRY_UPDATE', (data: any) => {
      if (data?.timestamp) {
        setLastTelemetryTime(data.timestamp);
      }
      if (data?.vessels && Array.isArray(data.vessels) && data.vessels.length > 0) {
        setVessels((prevVessels) =>
          prevVessels.map((v) => {
            const updated = data.vessels.find((u: any) => u.vessel_id === v.id);
            if (updated) {
              return {
                ...v,
                current_lat: updated.lat ?? v.current_lat,
                current_lng: updated.lng ?? v.current_lng,
                speed_knots: updated.speed_knots ?? v.speed_knots,
                fuel_flow_mt_day: updated.fuel_flow_mt_day ?? v.fuel_flow_mt_day,
                ghg_emissions_day: updated.ghg_emissions_day ?? v.ghg_emissions_day
              };
            }
            return v;
          })
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const navigateToVessel = (vesselId: string, openTelemetry: boolean = false) => {
    setSelectedVesselId(vesselId);
    if (openTelemetry) {
      setCurrentScreen('screen_12_vessel_telemetry');
    } else {
      setCurrentScreen('screen_3_vessel_details');
    }
  };

  const navigateToVoyage = (voyageId: string) => {
    setSelectedVoyageId(voyageId);
    setCurrentScreen('screen_4_voyages');
  };

  const navigateToOptimizationWithScenario = (vesselId?: string) => {
    if (vesselId) setSelectedVesselId(vesselId);
    setCurrentScreen('screen_5_optimization_studio');
  };

  return {
    currentScreen,
    setCurrentScreen,
    currentUser,
    setCurrentUser,
    vessels,
    setVessels,
    voyages,
    setVoyages,
    alerts,
    setAlerts,
    selectedVesselId,
    setSelectedVesselId,
    selectedVoyageId,
    setSelectedVoyageId,
    selectedRunId,
    setSelectedRunId,
    lastOptimizationResult,
    setLastOptimizationResult,
    lastTelemetryTime,
    isLoading,
    setIsLoading,
    navigateToVessel,
    navigateToVoyage,
    navigateToOptimizationWithScenario
  };
}
