from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from app.database.mock_data import db

router = APIRouter(prefix="/vessels", tags=["Vessels"])

@router.get("")
async def get_vessels(status: Optional[str] = None):
    if status:
        return [v for v in db.vessels if v["status"].lower() == status.lower()]
    return db.vessels

@router.get("/{vessel_id}")
async def get_vessel_by_id(vessel_id: str):
    vessel = next((v for v in db.vessels if v["id"] == vessel_id), None)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel

@router.get("/{vessel_id}/telemetry")
async def get_vessel_telemetry(vessel_id: str):
    vessel = next((v for v in db.vessels if v["id"] == vessel_id), None)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
        
    return {
        "vessel_id": vessel["id"],
        "vessel_name": vessel["name"],
        "imo": vessel["imo"],
        "mmsi": vessel["mmsi"],
        "call_sign": vessel["call_sign"],
        "status": vessel["status"],
        "position": {
            "lat": vessel["current_lat"],
            "lng": vessel["current_lng"],
            "area": "Indian Ocean / Arabian Sea"
        },
        "speed_sog_knots": vessel["speed_knots"],
        "heading_deg": vessel["heading_deg"],
        "course_deg": vessel["heading_deg"],
        "engine_rpm": 78,
        "fuel_flow_mt_day": vessel["fuel_flow_mt_day"],
        "draft_m": vessel["draft_m"],
        "power_output_mw": round(vessel["engine_power_mw"] * 0.76, 1),
        "hull_stress": "Low (Normal)",
        "engine_parameters": {
            "main_engine_temp_c": 82,
            "aux_engine_temp_c": 78,
            "lubricating_oil_pressure_bar": 4.2,
            "cooling_water_temp_c": 76,
            "cylinder_pressures_bar": [142, 145, 143, 146, 144, 145],
            "exhaust_gas_temps_c": [415, 418, 420, 435, 417, 419]
        },
        "environmental_conditions": {
            "wind_speed_knots": 18,
            "wind_direction": "WSW",
            "wave_height_m": 2.1,
            "ocean_current_knots": 1.2,
            "sea_state": "3 (Slight to Moderate)"
        },
        "fuel_and_emissions_live": {
            "fuel_mt_day": vessel["fuel_flow_mt_day"],
            "co2_emissions_t_day": round(vessel["fuel_flow_mt_day"] * 3.15, 1),
            "so2_emissions_t_day": 0.045,
            "nox_emissions_t_day": 1.24
        },
        "subsystem_status": {
            "main_engine": "Normal",
            "auxiliary_engine": "Normal",
            "navigation_systems": "Normal",
            "communication": "Normal",
            "power_generation": "Normal",
            "hull_and_structure": "Normal"
        }
    }

@router.get("/{vessel_id}/maintenance")
async def get_vessel_maintenance(vessel_id: str):
    vessel = next((v for v in db.vessels if v["id"] == vessel_id), None)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
        
    return {
        "vessel_id": vessel["id"],
        "vessel_name": vessel["name"],
        "overall_health_score_pct": vessel.get("engine_health_pct", 92),
        "health_status": "Good" if vessel.get("engine_health_pct", 92) > 85 else "Warning",
        "active_maintenance_alerts_count": 3 if vessel["id"] == "V002" else 1,
        "predicted_failures_next_30d": 2 if vessel["id"] == "V002" else 0,
        "upcoming_maintenance_count": 4,
        "maintenance_cost_ytd_usd": 1240000,
        "component_health_matrix": [
            {
                "component": "Main Engine (Cylinders & Rings)",
                "health_pct": 89,
                "status": "Good",
                "predicted_failure": "No risk (<180 days)",
                "recommended_action": "Routine inspection at Dubai port"
            },
            {
                "component": "Turbocharger Bearing System",
                "health_pct": 74,
                "status": "Warning",
                "predicted_failure": "Moderate risk (~48 days)",
                "recommended_action": "Inspect lube oil supply & vibration"
            },
            {
                "component": "Fuel Injection System",
                "health_pct": 91,
                "status": "Good",
                "predicted_failure": "No risk (>120 days)",
                "recommended_action": "Clean nozzles next dry dock"
            },
            {
                "component": "Auxiliary Power Generators",
                "health_pct": 96,
                "status": "Excellent",
                "predicted_failure": "None",
                "recommended_action": "Regular filter replacement"
            },
            {
                "component": "Cooling Water Heat Exchangers",
                "health_pct": 85,
                "status": "Good",
                "predicted_failure": "No risk (>90 days)",
                "recommended_action": "Descaling schedule on track"
            },
            {
                "component": "Hull Coating & Biofouling",
                "health_pct": 88,
                "status": "Good",
                "predicted_failure": "Minor frictional penalty (~2%)",
                "recommended_action": "Hull robotic grooming scheduled"
            }
        ],
        "vibration_trend": [
            {"day": "Day 1", "vibration_mm_s": 2.1, "threshold": 4.5},
            {"day": "Day 5", "vibration_mm_s": 2.3, "threshold": 4.5},
            {"day": "Day 10", "vibration_mm_s": 2.2, "threshold": 4.5},
            {"day": "Day 15", "vibration_mm_s": 2.6, "threshold": 4.5},
            {"day": "Day 20", "vibration_mm_s": 3.1, "threshold": 4.5},
            {"day": "Day 25", "vibration_mm_s": 3.4, "threshold": 4.5}
        ]
    }
