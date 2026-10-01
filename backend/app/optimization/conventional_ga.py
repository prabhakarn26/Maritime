import time
import random
import numpy as np
from typing import Dict, List, Any
from app.optimization.objectives import objective_evaluator
from app.optimization.constraints import constraint_validator
from app.core.config import config

class ConventionalGeneticAlgorithm:
    def __init__(self, population_size: int = 40, generations: int = 35):
        self.pop_size = population_size
        self.generations = generations
        self.mutation_rate = 0.15
        self.crossover_rate = 0.80

    def optimize(
        self,
        vessel: Dict[str, Any],
        cargo_tonnes: float,
        cargo_teu: int,
        distance_nm: float,
        departure_timestamp: float,
        arrival_deadline_timestamp: float,
        allowed_fuels: List[str] = None,
        weather_wind_knots: float = 18.0,
        weather_wave_m: float = 2.4,
        ocean_current_knots: float = 0.5,
        weights: Dict[str, float] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        
        if allowed_fuels is None:
            allowed_fuels = ["HFO", "VLSFO", "MGO", "LNG", "Methanol"]
            
        min_speed = 9.5
        max_speed = vessel.get("max_speed_knots", 20.5)
        
        # Initialize population
        population = []
        for _ in range(self.pop_size):
            speed = random.uniform(min_speed, max_speed)
            fuel = random.choice(allowed_fuels)
            shore_power = random.choice([True, False])
            # Weather avoidance detour factor (1.0 = direct, 1.08 = storm bypass)
            route_detour = random.uniform(1.0, 1.12)
            population.append({
                "speed": speed,
                "fuel": fuel,
                "shore_power": shore_power,
                "route_detour": route_detour
            })
            
        convergence_history = []
        all_evaluated_solutions = []
        best_fitness = float("inf")
        best_candidate = None
        
        for gen in range(self.generations):
            # Evaluate fitness
            evaluated_pop = []
            for indiv in population:
                effective_distance = distance_nm * indiv["route_detour"]
                # If detour taken, weather is attenuated
                eff_wind = weather_wind_knots / indiv["route_detour"]
                eff_wave = weather_wave_m / indiv["route_detour"]
                
                is_feasible, violations = constraint_validator.validate_plan(
                    vessel=vessel,
                    cargo_tonnes=cargo_tonnes,
                    cargo_teu=cargo_teu,
                    speed_knots=indiv["speed"],
                    fuel_type=indiv["fuel"],
                    departure_timestamp=departure_timestamp,
                    arrival_deadline_timestamp=arrival_deadline_timestamp,
                    total_distance_nm=effective_distance
                )
                
                metrics = objective_evaluator.evaluate_candidate(
                    vessel=vessel,
                    cargo_tonnes=cargo_tonnes,
                    cargo_teu=cargo_teu,
                    speed_knots=indiv["speed"],
                    fuel_type=indiv["fuel"],
                    distance_nm=effective_distance,
                    shore_power_used=indiv["shore_power"],
                    weather_wind_knots=eff_wind,
                    weather_wave_m=eff_wave,
                    ocean_current_knots=ocean_current_knots,
                    weights=weights
                )
                
                # Constraint penalty if infeasible
                penalty = 5.0 * len(violations) if not is_feasible else 0.0
                raw_fitness = metrics["composite_fitness"] + penalty
                
                sol_entry = {
                    "chromosome": indiv,
                    "metrics": metrics,
                    "is_feasible": is_feasible,
                    "violations": violations,
                    "fitness": raw_fitness,
                    "total_fuel_mt": metrics["total_fuel_mt"],
                    "total_cost_usd": metrics["total_cost_usd"],
                    "total_ghg_tco2e": metrics["total_ghg_tco2e"],
                    "duration_days": metrics["duration_days"]
                }
                evaluated_pop.append(sol_entry)
                all_evaluated_solutions.append(metrics)
                
            evaluated_pop.sort(key=lambda x: x["fitness"])
            current_best = evaluated_pop[0]
            if current_best["fitness"] < best_fitness:
                best_fitness = current_best["fitness"]
                best_candidate = current_best
                
            convergence_history.append({
                "generation": gen + 1,
                "best_fitness": round(best_fitness, 4),
                "avg_fitness": round(float(np.mean([x["fitness"] for x in evaluated_pop])), 4)
            })
            
            # Elitism: retain top 2
            next_pop = [x["chromosome"] for x in evaluated_pop[:2]]
            
            # Tournament selection + Crossover + Mutation
            while len(next_pop) < self.pop_size:
                # Tournament selection
                p1 = min(random.sample(evaluated_pop, 3), key=lambda x: x["fitness"])["chromosome"]
                p2 = min(random.sample(evaluated_pop, 3), key=lambda x: x["fitness"])["chromosome"]
                
                # Crossover
                if random.random() < self.crossover_rate:
                    child_speed = 0.5 * (p1["speed"] + p2["speed"]) + random.uniform(-0.2, 0.2)
                    child_fuel = random.choice([p1["fuel"], p2["fuel"]])
                    child_shore = random.choice([p1["shore_power"], p2["shore_power"]])
                    child_detour = 0.5 * (p1["route_detour"] + p2["route_detour"])
                else:
                    child_speed = p1["speed"]
                    child_fuel = p1["fuel"]
                    child_shore = p1["shore_power"]
                    child_detour = p1["route_detour"]
                    
                # Mutation
                if random.random() < self.mutation_rate:
                    child_speed += random.gauss(0, 0.8)
                    child_speed = max(min_speed, min(max_speed, child_speed))
                if random.random() < self.mutation_rate:
                    child_fuel = random.choice(allowed_fuels)
                if random.random() < self.mutation_rate:
                    child_shore = not child_shore
                if random.random() < self.mutation_rate:
                    child_detour = max(1.0, min(1.15, child_detour + random.gauss(0, 0.03)))
                    
                next_pop.append({
                    "speed": max(min_speed, min(max_speed, child_speed)),
                    "fuel": child_fuel,
                    "shore_power": child_shore,
                    "route_detour": child_detour
                })
                
            population = next_pop
            
        runtime = round(time.time() - start_time, 2)
        
        return {
            "algorithm": "Conventional Genetic Algorithm (GA)",
            "runtime_seconds": runtime,
            "generations": self.generations,
            "population_size": self.pop_size,
            "best_solution": best_candidate,
            "convergence_history": convergence_history,
            "evaluated_solutions": all_evaluated_solutions
        }

conventional_optimizer = ConventionalGeneticAlgorithm()
