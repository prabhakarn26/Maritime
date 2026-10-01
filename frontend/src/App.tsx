import React from 'react';
import { useFleetState } from './store/useFleetStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// 16 Screen Components
import { Screen01_Login } from './components/screens/Screen01_Login';
import { Screen02_FleetOverview } from './components/screens/Screen02_FleetOverview';
import { Screen03_VesselDetails } from './components/screens/Screen03_VesselDetails';
import { Screen04_VoyagesCargo } from './components/screens/Screen04_VoyagesCargo';
import { Screen05_OptimizationStudio } from './components/screens/Screen05_OptimizationStudio';
import { Screen06_OptimizationResults } from './components/screens/Screen06_OptimizationResults';
import { Screen07_ScenarioSimulator } from './components/screens/Screen07_ScenarioSimulator';
import { Screen08_AlertsNotifications } from './components/screens/Screen08_AlertsNotifications';
import { Screen09_ReportsAnalytics } from './components/screens/Screen09_ReportsAnalytics';
import { Screen10_Settings } from './components/screens/Screen10_Settings';
import { Screen11_LiveDataIntegrations } from './components/screens/Screen11_LiveDataIntegrations';
import { Screen12_VesselTelemetry } from './components/screens/Screen12_VesselTelemetry';
import { Screen13_MaintenancePredictive } from './components/screens/Screen13_MaintenancePredictive';
import { Screen14_UserManagement } from './components/screens/Screen14_UserManagement';
import { Screen15_OptimizationRunHistory } from './components/screens/Screen15_OptimizationRunHistory';
import { Screen16_SystemHealthMonitoring } from './components/screens/Screen16_SystemHealthMonitoring';

import { api } from './services/api';

export function App() {
  const {
    currentScreen,
    setCurrentScreen,
    currentUser,
    vessels,
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
    navigateToVessel,
    navigateToVoyage,
    navigateToOptimizationWithScenario
  } = useFleetState();

  const selectedVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0] || {
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
  };

  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  // Handlers
  const handleAcknowledgeAlert = async (alertId: string) => {
    await api.acknowledgeAlert(alertId);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, status: 'Acknowledged' } : a))
    );
  };

  const handleRecalculateRoute = async (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      setSelectedVesselId(alert.vessel_id);
      setCurrentScreen('screen_5_optimization_studio');
    }
  };

  const handleCreateVoyage = async (newVoyageData: any) => {
    const created = await api.createVoyage(newVoyageData);
    setVoyages((prev) => [created, ...prev]);
    setSelectedVoyageId(created.id);
  };

  const handleOptimizationComplete = (results: any) => {
    setLastOptimizationResult(results);
    setCurrentScreen('screen_6_optimization_results');
  };

  // If user is on Screen 1 (Login Screen)
  if (currentScreen === 'screen_1_login') {
    return <Screen01_Login onLoginSuccess={() => setCurrentScreen('screen_2_fleet_overview')} />;
  }

  return (
    <div className="app-container flex h-screen bg-[var(--bg-app)] text-[var(--text-main)] overflow-hidden font-sans antialiased transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Global Header */}
        <Header
          currentUser={currentUser}
          lastTelemetryTime={lastTelemetryTime}
          activeAlertsCount={activeAlertsCount}
          onNavigateToAlerts={() => setCurrentScreen('screen_8_alerts')}
          onNavigateToSystemHealth={() => setCurrentScreen('screen_16_system_health')}
          onNavigateToScreen={(s) => setCurrentScreen(s)}
        />

        {/* Screen Routing */}
        <main className="flex-1 pb-12">
          {currentScreen === 'screen_2_fleet_overview' && (
            <Screen02_FleetOverview
              vessels={vessels}
              voyages={voyages}
              alerts={alerts}
              onNavigateToScreen={(s) => setCurrentScreen(s)}
              onSelectVessel={(vId) => navigateToVessel(vId)}
              onSelectVoyage={(voyId) => navigateToVoyage(voyId)}
            />
          )}

          {currentScreen === 'screen_3_vessel_details' && (
            <Screen03_VesselDetails
              vessel={selectedVessel}
              allVessels={vessels}
              onBackToFleet={() => setCurrentScreen('screen_2_fleet_overview')}
              onNavigateToTelemetry={(vId) => navigateToVessel(vId, true)}
              onNavigateToOptimization={(vId) => navigateToOptimizationWithScenario(vId)}
              onSelectVessel={(vId) => setSelectedVesselId(vId)}
            />
          )}

          {currentScreen === 'screen_4_voyages' && (
            <Screen04_VoyagesCargo
              voyages={voyages}
              vessels={vessels}
              selectedVoyageId={selectedVoyageId}
              onSelectVoyage={(voyId) => setSelectedVoyageId(voyId)}
              onNavigateToOptimization={(vId) => navigateToOptimizationWithScenario(vId)}
              onCreateVoyage={handleCreateVoyage}
            />
          )}

          {currentScreen === 'screen_5_optimization_studio' && (
            <Screen05_OptimizationStudio
              vessels={vessels}
              selectedVesselId={selectedVesselId}
              onOptimizationComplete={handleOptimizationComplete}
            />
          )}

          {currentScreen === 'screen_6_optimization_results' && (
            <Screen06_OptimizationResults
              results={lastOptimizationResult}
              onBackToStudio={() => setCurrentScreen('screen_5_optimization_studio')}
              onSaveResult={() => setCurrentScreen('screen_15_optimization_history')}
            />
          )}

          {currentScreen === 'screen_7_scenario_simulator' && (
            <Screen07_ScenarioSimulator />
          )}

          {currentScreen === 'screen_8_alerts' && (
            <Screen08_AlertsNotifications
              alerts={alerts}
              vessels={vessels}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onRecalculateRoute={handleRecalculateRoute}
              onSelectVessel={(vId) => navigateToVessel(vId)}
            />
          )}

          {currentScreen === 'screen_9_reports' && (
            <Screen09_ReportsAnalytics />
          )}

          {currentScreen === 'screen_10_settings' && (
            <Screen10_Settings />
          )}

          {currentScreen === 'screen_11_live_integrations' && (
            <Screen11_LiveDataIntegrations vessels={vessels} />
          )}

          {currentScreen === 'screen_12_vessel_telemetry' && (
            <Screen12_VesselTelemetry
              vessel={selectedVessel}
              onBackToVessel={() => setCurrentScreen('screen_3_vessel_details')}
              onNavigateToOptimization={(vId) => navigateToOptimizationWithScenario(vId)}
            />
          )}

          {currentScreen === 'screen_13_maintenance' && (
            <Screen13_MaintenancePredictive vessels={vessels} />
          )}

          {currentScreen === 'screen_14_users' && (
            <Screen14_UserManagement
              users={currentUser ? [currentUser] : []}
              onAddUser={async (userData) => {
                await api.addUser(userData);
              }}
            />
          )}

          {currentScreen === 'screen_15_optimization_history' && (
            <Screen15_OptimizationRunHistory
              runs={[]}
              selectedRunId={selectedRunId}
              onSelectRun={(runId) => setSelectedRunId(runId)}
              onNavigateToStudioWithRun={(run) => {
                setCurrentScreen('screen_5_optimization_studio');
              }}
            />
          )}

          {currentScreen === 'screen_16_system_health' && (
            <Screen16_SystemHealthMonitoring />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
