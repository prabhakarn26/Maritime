import math
from typing import Dict, Any, Tuple
from app.core.config import config
from app.ml.fuel_model import fuel_engine
from app.ml.emissions import emissions_engine

class ObjectiveEvaluator:
    def __init__(self):
        # Reference scale constants for normalization
        self.ref_fuel_mt = 5000.0
        self.ref_cost_usd = 2500000.0
        self.ref_ghg_tonnes = 15000.0

    def evaluate_candidate(
        self,
        vessel: Dict[str, Any],
        cargo_tonnes: float,
        cargo_teu: int,
        speed_knots: float,
        fuel_type: str,
        distance_nm: float,
        shore_power_used: bool,
        port_stay_hours: float = 24.0,
        weather_wind_knots: float = 12.0,
        weather_wave_m: float = 1.6,
        ocean_current_knots: float = 0.2,
        weights: Dict[str, float] = None
    ) -> Dict[str, Any]:
        """
        Evaluates fuel, cost, GHG, ETA, and composite multi-objective fitness.
        """
        if weights is None:
            weights = {
                "fuel_weight": 0.40,
                "cost_weight": 0.30,
                "ghg_weight": 0.20,
                "eta_weight": 0.10
            }
            
        # 1. Voyage duration & ETA
        voyage_hours = distance_nm / max(1.0, speed_knots)
        voyage_days = voyage_hours / 24.0
        
        # 2. Voyage fuel consumption from ML engine
        draft_m = vessel.get("draft_m", 12.0)
        vessel_dwt = vessel.get("dwt", 80000)
        
        fuel_res = fuel_engine.predict_voyage_fuel(
            distance_nm=distance_nm,
            speed_knots=speed_knots,
            vessel_dwt=vessel_dwt,
            cargo_tonnes=cargo_tonnes,
            draft_m=draft_m,
            fuel_type=fuel_type,
            wind_speed_knots=weather_wind_knots,
            wave_height_m=weather_wave_m,
            current_knots=ocean_current_knots
        )
        total_fuel_mt = fuel_res["total_fuel_mt"]
        fuel_rate_mt_day = fuel_res["fuel_rate_mt_day"]
        
        # 3. Operational Costs breakdown
        fuel_spec = config.FUEL_SPECS.get(fuel_type, config.FUEL_SPECS["VLSFO"])
        bunker_fuel_cost = total_fuel_mt * fuel_spec.price_per_mt
        
        # Vessel charter / daily OPEX (crew, lube oil, insurance)
        daily_opex = vessel.get("operating_cost_day", 45000.0) * 0.45 # non-fuel OPEX portion
        total_opex_cost = daily_opex * (voyage_days + (port_stay_hours / 24.0))
        
        # Port & shore power costs
        port_base_dues = 15000.0
        if shore_power_used and vessel.get("shore_power_equipped", False):
            shore_power_kwh = port_stay_hours * 1200.0 # 1.2 MW power demand
            shore_power_cost = shore_power_kwh * 0.18 # USD/kWh
            port_aux_fuel_mt = 0.0
        else:
            shore_power_cost = 0.0
            port_aux_fuel_mt = port_stay_hours * 0.15 # MGO auxiliary engine burn
            
        port_aux_fuel_cost = port_aux_fuel_mt * config.FUEL_SPECS["MGO"].price_per_mt
        
        # 4. Lifecycle Emissions & Carbon tax
        emissions_res = emissions_engine.calculate_lifecycle_emissions(
            fuel_consumed_mt=total_fuel_mt,
            fuel_type=fuel_type,
            distance_nm=distance_nm,
            capacity_dwt=vessel_dwt,
            cargo_mt=cargo_tonnes,
            shore_power_hours=port_stay_hours if shore_power_used else 0.0,
            port_fuel_consumed_mt=port_aux_fuel_mt
        )
        total_ghg_tco2e = emissions_res["net_ghg_tonnes"]
        eu_ets_cost = emissions_res["eu_ets_cost_usd"]
        
        # Total voyage cost
        total_cost_usd = bunker_fuel_cost + total_opex_cost + port_base_dues + shore_power_cost + port_aux_fuel_cost + eu_ets_cost
        
        # 5. Composite Normalized Fitness Score J(X)
        norm_fuel = total_fuel_mt / self.ref_fuel_mt
        norm_cost = total_cost_usd / self.ref_cost_usd
        norm_ghg = total_ghg_tco2e / self.ref_ghg_tonnes
        norm_eta = voyage_days / 15.0
        
        composite_fitness = (
            weights.get("fuel_weight", 0.4) * norm_fuel +
            weights.get("cost_weight", 0.3) * norm_cost +
            weights.get("ghg_weight", 0.2) * norm_ghg +
            weights.get("eta_weight", 0.1) * norm_eta
        )
        
        return {
            "speed_knots": round(speed_knots, 2),
            "fuel_type": fuel_type,
            "shore_power_used": shore_power_used,
            "duration_days": round(voyage_days, 2),
            "duration_hours": round(voyage_hours, 1),
            "total_fuel_mt": round(total_fuel_mt, 1),
            "fuel_flow_mt_day": round(fuel_rate_mt_day, 1),
            "bunker_fuel_cost_usd": round(bunker_fuel_cost, 0),
            "total_cost_usd": round(total_cost_usd, 0),
            "total_ghg_tco2e": round(total_ghg_tco2e, 1),
            "cii_rating": emissions_res["cii_rating"],
            "cii_description": emissions_res["cii_description"],
            "sox_tonnes": emissions_res["sox_tonnes"],
            "nox_tonnes": emissions_res["nox_tonnes"],
            "composite_fitness": round(composite_fitness, 4),
            "cost_breakdown": {
                "fuel_cost": round(bunker_fuel_cost, 0),
                "vessel_opex": round(total_opex_cost, 0),
                "port_charges": round(port_base_dues + port_aux_fuel_cost + shore_power_cost, 0),
                "carbon_tax_ets": round(eu_ets_cost, 0)
            }
        }

objective_evaluator = ObjectiveEvaluator()
