from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.ml.fuel_model import fuel_engine
from app.ml.emissions import emissions_engine
from app.database.mock_data import db

router = APIRouter(prefix="/scenarios", tags=["Scenario Simulator"])

class ScenarioRequest(BaseModel):
    scenario_type: Optional[str] = "custom" # "higher_fuel", "cargo_demand", "severe_weather", "vessel_unavailable", "earlier_deadline", "alternative_fuel", "custom"
    fuel_price_change_pct: Optional[float] = 20.0
    cargo_demand_change_pct: Optional[float] = 0.0
    weather_severity: Optional[str] = "Moderate" # "Calm", "Moderate", "Severe (Cyclone)"
    vessel_availability_pct: Optional[float] = 100.0
    deadline_shift_hours: Optional[float] = 0.0
    fuel_type: Optional[str] = "Conventional (HFO/VLSFO)"

@router.post("/simulate")
async def simulate_scenario(req: ScenarioRequest):
    # Base Case Figures
    base_fuel_mt = 5420.0
    base_cost_usd = 2800000.0
    base_ghg_tco2e = 16230.0
    base_eta_days = 12.5
    base_vessels = 16
    
    # Dynamic Perturbation calculations
    # 1. Weather Impact
    weather_factor = 1.0
    if "Severe" in req.weather_severity:
        weather_factor = 1.18 # 18% fuel surge due to waves/wind
    elif "Calm" in req.weather_severity:
        weather_factor = 0.94
        
    # 2. Cargo Demand Impact
    cargo_factor = 1.0 + (req.cargo_demand_change_pct / 100.0) * 0.65
    
    # 3. Fuel Type & Price Impact
    fuel_price_factor = 1.0 + (req.fuel_price_change_pct / 100.0)
    
    ghg_multiplier = 1.0
    cost_multiplier = 1.0
    if "Methanol" in req.fuel_type:
        ghg_multiplier = 0.44
        cost_multiplier = 1.25
    elif "LNG" in req.fuel_type:
        ghg_multiplier = 0.78
        cost_multiplier = 1.10
    elif "Ammonia" in req.fuel_type:
        ghg_multiplier = 0.10
        cost_multiplier = 1.60
        
    # Recalculated values
    sim_fuel_mt = round(base_fuel_mt * weather_factor * cargo_factor, 0)
    sim_cost_usd = round(base_cost_usd * weather_factor * cargo_factor * fuel_price_factor * cost_multiplier, 0)
    sim_ghg_tco2e = round(base_ghg_tco2e * weather_factor * cargo_factor * ghg_multiplier, 0)
    
    eta_shift = 0.0
    if "Severe" in req.weather_severity:
        eta_shift += 0.8
    if req.deadline_shift_hours < 0:
        eta_shift -= abs(req.deadline_shift_hours) / 24.0
    sim_eta_days = round(max(8.0, base_eta_days + eta_shift), 1)
    
    sim_vessels = int(round(base_vessels * (req.vessel_availability_pct / 100.0)))
    is_feasible = sim_vessels >= 12
    
    # Percentage Deltas
    delta_fuel_pct = round(((sim_fuel_mt - base_fuel_mt) / base_fuel_mt) * 100.0, 1)
    delta_cost_pct = round(((sim_cost_usd - base_cost_usd) / base_cost_usd) * 100.0, 1)
    delta_ghg_pct = round(((sim_ghg_tco2e - base_ghg_tco2e) / base_ghg_tco2e) * 100.0, 1)
    delta_eta_pct = round(((sim_eta_days - base_eta_days) / base_eta_days) * 100.0, 1)
    
    # Generate AI Insights & Recommendations
    insights = []
    if delta_cost_pct > 10.0:
        insights.append(f"Fuel price surge of {req.fuel_price_change_pct}% increases total voyage operating cost by ${sim_cost_usd - base_cost_usd:,.0f} (+{delta_cost_pct}%).")
    if "Severe" in req.weather_severity:
        insights.append("Severe cyclone pattern induces hydrodynamic added resistance. Re-routing via alternate southern corridor saves 8.4% fuel compared to direct storm heading.")
    if delta_ghg_pct < -20.0:
        insights.append(f"Decarbonization strategy successfully reduces GHG lifecycle footprint by {abs(delta_ghg_pct)}%, achieving IMO CII rating 'A'.")
    if not is_feasible:
        insights.append("Warning: Vessel availability constraint is violated for current cargo commitments. Recommend chartering spot capacity.")
    else:
        insights.append("Recommended Operating Policy: Adopt QIEA slow-steaming speed profile (13.8 knots) to absorb bunker price shocks without missing contractual port windows.")
        
    return {
        "scenario_type": req.scenario_type,
        "parameters": req.model_dump(),
        "base_case": {
            "total_fuel_mt": base_fuel_mt,
            "total_cost_usd": base_cost_usd,
            "total_ghg_tco2e": base_ghg_tco2e,
            "avg_eta_days": base_eta_days,
            "vessels_count": base_vessels,
            "feasibility": "Feasible"
        },
        "scenario_result": {
            "total_fuel_mt": sim_fuel_mt,
            "total_cost_usd": sim_cost_usd,
            "total_ghg_tco2e": sim_ghg_tco2e,
            "avg_eta_days": sim_eta_days,
            "vessels_count": sim_vessels,
            "feasibility": "Feasible" if is_feasible else "Infeasible (Capacity Shortage)"
        },
        "delta": {
            "fuel_pct": delta_fuel_pct,
            "cost_pct": delta_cost_pct,
            "ghg_pct": delta_ghg_pct,
            "eta_pct": delta_eta_pct
        },
        "cost_breakdown": {
            "fuel_cost": round(sim_cost_usd * 0.62, 0),
            "vessel_opex": round(sim_cost_usd * 0.22, 0),
            "port_charges": round(sim_cost_usd * 0.11, 0),
            "carbon_tax": round(sim_cost_usd * 0.05, 0)
        },
        "insights_and_recommendations": insights,
        "fleet_impact": [
            {"vessel": "MV Ocean Star", "status": "Optimized", "base_fuel": 680, "scen_fuel": round(680 * weather_factor, 1), "delta_pct": delta_fuel_pct},
            {"vessel": "MV Pacific Dawn", "status": "Re-routed", "base_fuel": 540, "scen_fuel": round(540 * weather_factor, 1), "delta_pct": delta_fuel_pct},
            {"vessel": "MV Horizon", "status": "Optimized", "base_fuel": 480, "scen_fuel": round(480 * weather_factor, 1), "delta_pct": delta_fuel_pct},
            {"vessel": "MV Blue Wave", "status": "Shore Power", "base_fuel": 620, "scen_fuel": round(620 * weather_factor, 1), "delta_pct": delta_fuel_pct}
        ]
    }
