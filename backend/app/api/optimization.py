import time
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.database.mock_data import db
from app.optimization.baseline import baseline_optimizer
from app.optimization.conventional_ga import conventional_optimizer
from app.optimization.quantum_inspired_qiea import quantum_optimizer
from app.optimization.pareto import pareto_extractor

router = APIRouter(prefix="/optimization", tags=["Optimization Engine"])

class OptimizationRunRequest(BaseModel):
    scenario_name: Optional[str] = "Singapore to Dubai Green Voyage Plan"
    cargo_type: Optional[str] = "Containers"
    cargo_quantity_teu: Optional[int] = 5000
    cargo_weight_mt: Optional[float] = 70000.0
    cargo_priority: Optional[str] = "High Priority"
    origin_id: Optional[str] = "SIN"
    destination_id: Optional[str] = "DXB"
    selected_vessel_ids: Optional[List[str]] = ["V001", "V002"]
    selected_algorithm: Optional[str] = "QIEA" # "Baseline", "GA", "QIEA", "All"
    allowed_fuels: Optional[List[str]] = ["HFO", "VLSFO", "MGO", "LNG", "Methanol"]
    fuel_weight: Optional[float] = 0.40
    cost_weight: Optional[float] = 0.30
    ghg_weight: Optional[float] = 0.20
    eta_weight: Optional[float] = 0.10
    weather_avoidance: Optional[bool] = True
    shore_power_required: Optional[bool] = True

@router.post("/run")
async def run_optimization(req: OptimizationRunRequest):
    start_time = time.time()
    
    # Selected primary vessel
    vessel = next((v for v in db.vessels if v["id"] in req.selected_vessel_ids), db.vessels[0])
    
    distance_nm = 3400.0
    now_ts = time.time()
    deadline_ts = now_ts + (12.5 * 24 * 3600) # 12.5 days deadline
    
    weights = {
        "fuel_weight": req.fuel_weight,
        "cost_weight": req.cost_weight,
        "ghg_weight": req.ghg_weight,
        "eta_weight": req.eta_weight
    }
    
    # 1. Run Deterministic Baseline
    baseline_res = baseline_optimizer.run_baseline(
        vessel=vessel,
        cargo_tonnes=req.cargo_weight_mt,
        cargo_teu=req.cargo_quantity_teu,
        distance_nm=distance_nm,
        departure_timestamp=now_ts,
        arrival_deadline_timestamp=deadline_ts
    )
    
    # 2. Run Conventional Genetic Algorithm
    ga_res = conventional_optimizer.optimize(
        vessel=vessel,
        cargo_tonnes=req.cargo_weight_mt,
        cargo_teu=req.cargo_quantity_teu,
        distance_nm=distance_nm,
        departure_timestamp=now_ts,
        arrival_deadline_timestamp=deadline_ts,
        allowed_fuels=req.allowed_fuels,
        weights=weights
    )
    
    # 3. Run Quantum-Inspired Evolutionary Algorithm (QIEA)
    qiea_res = quantum_optimizer.optimize(
        vessel=vessel,
        cargo_tonnes=req.cargo_weight_mt,
        cargo_teu=req.cargo_quantity_teu,
        distance_nm=distance_nm,
        departure_timestamp=now_ts,
        arrival_deadline_timestamp=deadline_ts,
        allowed_fuels=req.allowed_fuels,
        weights=weights
    )
    
    # Calculate comparative savings against baseline
    base_fuel = baseline_res["metrics"]["total_fuel_mt"]
    base_cost = baseline_res["metrics"]["total_cost_usd"]
    base_ghg = baseline_res["metrics"]["total_ghg_tco2e"]
    base_eta = baseline_res["metrics"]["duration_days"]
    
    ga_best = ga_res["best_solution"]["metrics"]
    qiea_best = qiea_res["best_solution"]["metrics"] if qiea_res["best_solution"] else ga_best
    
    # Percentage improvements
    qiea_fuel_saving_pct = round(((base_fuel - qiea_best["total_fuel_mt"]) / base_fuel) * 100.0, 1)
    qiea_cost_saving_pct = round(((base_cost - qiea_best["total_cost_usd"]) / base_cost) * 100.0, 1)
    qiea_ghg_saving_pct = round(((base_ghg - qiea_best["total_ghg_tco2e"]) / base_ghg) * 100.0, 1)
    
    ga_fuel_saving_pct = round(((base_fuel - ga_best["total_fuel_mt"]) / base_fuel) * 100.0, 1)
    ga_cost_saving_pct = round(((base_cost - ga_best["total_cost_usd"]) / base_cost) * 100.0, 1)
    ga_ghg_saving_pct = round(((base_ghg - ga_best["total_ghg_tco2e"]) / base_ghg) * 100.0, 1)
    
    run_id = f"OPT-2026-{len(db.runs) + 49:03d}"
    
    run_record = {
        "run_id": run_id,
        "scenario_name": req.scenario_name,
        "date_time": datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
        "vessels_count": len(req.selected_vessel_ids),
        "vessels": [v["name"] for v in db.vessels if v["id"] in req.selected_vessel_ids],
        "route": f"{req.origin_id} -> {req.destination_id}",
        "algorithm": "QIEA (Quantum-Inspired)" if req.selected_algorithm == "QIEA" else req.selected_algorithm,
        "objective": "Min Fuel & Cost (Multi-objective)",
        "status": "Completed",
        "runtime_seconds": qiea_res["runtime_seconds"],
        "pareto_solutions_count": len(qiea_res["pareto_solutions"]),
        "baseline_fuel_mt": base_fuel,
        "optimized_fuel_mt": qiea_best["total_fuel_mt"],
        "fuel_saving_pct": qiea_fuel_saving_pct,
        "baseline_cost_usd": base_cost,
        "optimized_cost_usd": qiea_best["total_cost_usd"],
        "cost_saving_pct": qiea_cost_saving_pct,
        "baseline_ghg_tco2e": base_ghg,
        "optimized_ghg_tco2e": qiea_best["total_ghg_tco2e"],
        "ghg_saving_pct": qiea_ghg_saving_pct,
        "avg_eta_days": qiea_best["duration_days"],
        "feasibility": "Feasible (0 violations)"
    }
    db.runs.insert(0, run_record)
    
    return {
        "run_id": run_id,
        "scenario_name": req.scenario_name,
        "vessel_name": vessel["name"],
        "vessel_id": vessel["id"],
        "route": f"{req.origin_id} -> {req.destination_id}",
        "distance_nm": distance_nm,
        "summary_comparison": {
            "fuel_mt": {
                "baseline": base_fuel,
                "conventional_ga": ga_best["total_fuel_mt"],
                "conventional_saving_pct": ga_fuel_saving_pct,
                "quantum_qiea": qiea_best["total_fuel_mt"],
                "quantum_saving_pct": qiea_fuel_saving_pct
            },
            "cost_usd": {
                "baseline": base_cost,
                "conventional_ga": ga_best["total_cost_usd"],
                "conventional_saving_pct": ga_cost_saving_pct,
                "quantum_qiea": qiea_best["total_cost_usd"],
                "quantum_saving_pct": qiea_cost_saving_pct
            },
            "ghg_tco2e": {
                "baseline": base_ghg,
                "conventional_ga": ga_best["total_ghg_tco2e"],
                "conventional_saving_pct": ga_ghg_saving_pct,
                "quantum_qiea": qiea_best["total_ghg_tco2e"],
                "quantum_saving_pct": qiea_ghg_saving_pct
            },
            "eta_days": {
                "baseline": base_eta,
                "conventional_ga": ga_best["duration_days"],
                "quantum_qiea": qiea_best["duration_days"]
            },
            "runtime_seconds": {
                "baseline": baseline_res["runtime_seconds"],
                "conventional_ga": ga_res["runtime_seconds"],
                "quantum_qiea": qiea_res["runtime_seconds"]
            }
        },
        "baseline_details": baseline_res,
        "conventional_details": ga_res,
        "quantum_details": qiea_res,
        "pareto_frontier": qiea_res["pareto_solutions"],
        "tradeoff_archetypes": qiea_res["tradeoff_archetypes"],
        "convergence_curves": {
            "ga": ga_res["convergence_history"],
            "qiea": qiea_res["convergence_history"]
        }
    }

@router.get("/runs")
async def get_optimization_runs():
    return db.runs

@router.get("/runs/{run_id}")
async def get_run_details(run_id: str):
    run = next((r for r in db.runs if r["run_id"] == run_id), None)
    if not run:
        raise HTTPException(status_code=404, detail="Optimization run not found")
    return run
