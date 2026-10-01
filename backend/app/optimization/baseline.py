from typing import Dict, Any, List
from app.optimization.objectives import objective_evaluator
from app.optimization.constraints import constraint_validator

class DeterministicBaselineOptimizer:
    """
    Standard maritime rule-based baseline:
    - Fixed design cruising speed (14.5 kn)
    - Default heavy fuel oil (HFO/VLSFO)
    - Standard rhumb line path without weather routing
    - No shore power cold ironing
    """
    def run_baseline(
        self,
        vessel: Dict[str, Any],
        cargo_tonnes: float,
        cargo_teu: int,
        distance_nm: float,
        departure_timestamp: float,
        arrival_deadline_timestamp: float,
        weather_wind_knots: float = 18.0,
        weather_wave_m: float = 2.4,
        ocean_current_knots: float = 0.5
    ) -> Dict[str, Any]:
        
        baseline_speed = vessel.get("opt_speed_knots", 14.5)
        default_fuel = "VLSFO"
        shore_power = False
        
        is_feasible, violations = constraint_validator.validate_plan(
            vessel=vessel,
            cargo_tonnes=cargo_tonnes,
            cargo_teu=cargo_teu,
            speed_knots=baseline_speed,
            fuel_type=default_fuel,
            departure_timestamp=departure_timestamp,
            arrival_deadline_timestamp=arrival_deadline_timestamp,
            total_distance_nm=distance_nm
        )
        
        metrics = objective_evaluator.evaluate_candidate(
            vessel=vessel,
            cargo_tonnes=cargo_tonnes,
            cargo_teu=cargo_teu,
            speed_knots=baseline_speed,
            fuel_type=default_fuel,
            distance_nm=distance_nm,
            shore_power_used=shore_power,
            weather_wind_knots=weather_wind_knots,
            weather_wave_m=weather_wave_m,
            ocean_current_knots=ocean_current_knots
        )
        
        return {
            "algorithm": "Rule-Based Baseline (Deterministic)",
            "speed_knots": baseline_speed,
            "fuel_type": default_fuel,
            "shore_power": shore_power,
            "is_feasible": is_feasible,
            "violations": violations,
            "runtime_seconds": 0.05,
            "iterations": 1,
            "metrics": metrics
        }

baseline_optimizer = DeterministicBaselineOptimizer()
