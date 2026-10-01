from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ml.fuel_model import fuel_engine
from app.ml.emissions import emissions_engine
from app.database.mock_data import db

router = APIRouter(prefix="/predictions", tags=["ML Predictions"])

class FuelPredictionRequest(BaseModel):
    vessel_id: Optional[str] = "V001"
    distance_nm: float = 3400.0
    speed_knots: float = 14.2
    cargo_tonnes: float = 70000.0
    draft_m: float = 12.4
    fuel_type: str = "VLSFO"
    wind_speed_knots: float = 18.0
    wave_height_m: float = 2.1
    current_knots: float = 0.5

@router.post("/fuel")
async def predict_fuel(req: FuelPredictionRequest):
    vessel = next((v for v in db.vessels if v["id"] == req.vessel_id), db.vessels[0])
    
    rate_pred = fuel_engine.predict_fuel_consumption(
        vessel_dwt=vessel["dwt"],
        speed_knots=req.speed_knots,
        draft_m=req.draft_m,
        cargo_tonnes=req.cargo_tonnes,
        wind_speed_knots=req.wind_speed_knots,
        wave_height_m=req.wave_height_m,
        current_knots=req.current_knots,
        fuel_type=req.fuel_type,
        engine_rated_power_mw=vessel.get("engine_power_mw", 20.0)
    )
    
    voyage_pred = fuel_engine.predict_voyage_fuel(
        distance_nm=req.distance_nm,
        speed_knots=req.speed_knots,
        vessel_dwt=vessel["dwt"],
        cargo_tonnes=req.cargo_tonnes,
        draft_m=req.draft_m,
        fuel_type=req.fuel_type,
        wind_speed_knots=req.wind_speed_knots,
        wave_height_m=req.wave_height_m,
        current_knots=req.current_knots
    )
    
    emissions_pred = emissions_engine.calculate_lifecycle_emissions(
        fuel_consumed_mt=voyage_pred["total_fuel_mt"],
        fuel_type=req.fuel_type,
        distance_nm=req.distance_nm,
        capacity_dwt=vessel["dwt"],
        cargo_mt=req.cargo_tonnes
    )
    
    return {
        "vessel_id": vessel["id"],
        "vessel_name": vessel["name"],
        "fuel_rate_mt_day": rate_pred["fuel_mt_day"],
        "ci_lower": rate_pred["ci_lower"],
        "ci_upper": rate_pred["ci_upper"],
        "confidence_score": rate_pred["confidence_score"],
        "engine_load_pct": rate_pred["engine_load_pct"],
        "total_power_mw": rate_pred["total_power_mw"],
        "total_fuel_mt": voyage_pred["total_fuel_mt"],
        "total_fuel_cost_usd": voyage_pred["total_fuel_cost_usd"],
        "total_co2_emissions_t": emissions_pred["voyage_co2_tonnes"],
        "cii_rating": emissions_pred["cii_rating"],
        "feature_importance": rate_pred["feature_importance"],
        "model_version": rate_pred["model_version"],
        "r2_score": rate_pred["r2_score"]
    }

@router.get("/speed-profile")
async def get_speed_profile(vessel_id: str = "V001"):
    vessel = next((v for v in db.vessels if v["id"] == vessel_id), db.vessels[0])
    
    speeds = [10.0, 11.0, 12.0, 13.0, 14.0, 14.5, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0]
    profile = []
    
    for s in speeds:
        pred = fuel_engine.predict_fuel_consumption(
            vessel_dwt=vessel["dwt"],
            speed_knots=s,
            draft_m=vessel["draft_m"],
            cargo_tonnes=vessel["dwt"] * 0.75,
            wind_speed_knots=12.0,
            wave_height_m=1.5
        )
        profile.append({
            "speed_knots": s,
            "fuel_mt_day": pred["fuel_mt_day"],
            "power_mw": pred["total_power_mw"],
            "engine_load_pct": pred["engine_load_pct"],
            "co2_tonnes_day": round(pred["fuel_mt_day"] * 3.15, 1)
        })
        
    return {
        "vessel_id": vessel["id"],
        "vessel_name": vessel["name"],
        "speed_profile": profile
    }
