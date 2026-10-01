import math
import time
import random
import numpy as np
from typing import Dict, List, Any, Tuple
from app.optimization.objectives import objective_evaluator
from app.optimization.constraints import constraint_validator
from app.optimization.pareto import pareto_extractor
from app.core.config import config

class QuantumInspiredEvolutionaryAlgorithm:
    """
    Genuine Quantum-Inspired Evolutionary Algorithm (QIEA):
    - Q-bit chromosome representation: Q_j = [cos(theta_j), sin(theta_j)]
    - Maximum superposition initialization (theta = pi/4)
    - Quantum collapse / observation sampling
    - Quantum Rotation Gate: U(Delta_theta) steering state towards elite Pareto solutions
    - Quantum H-gate / quantum mutation operator for exploratory diversity
    - Multi-objective Pareto Frontier extraction
    """
    def __init__(self, population_size: int = 30, max_iterations: int = 40):
        self.pop_size = population_size
        self.max_iterations = max_iterations
        self.num_qbits = 16 # bits per candidate (speed: 6 bits, fuel: 3 bits, detour: 5 bits, shore_power: 2 bits)
        self.delta_theta = 0.035 * math.pi # Quantum rotation angle step

    def _observe_qbits(self, q_angles: np.ndarray) -> np.ndarray:
        """
        Collapses quantum state into classical binary string based on probability beta^2 = sin^2(theta).
        """
        probabilities = np.sin(q_angles) ** 2
        random_draws = np.random.rand(*q_angles.shape)
        return (random_draws < probabilities).astype(int)

    def _decode_candidate(
        self,
        bitstring: np.ndarray,
        vessel: Dict[str, Any],
        allowed_fuels: List[str]
    ) -> Dict[str, Any]:
        """
        Decodes a 16-bit classical observation into maritime operational parameters.
        """
        # Speed: 6 bits -> min_speed to max_speed
        min_speed = 10.0
        max_speed = vessel.get("max_speed_knots", 21.0)
        speed_int = int("".join(str(b) for b in bitstring[0:6]), 2)
        speed_knots = min_speed + (speed_int / 63.0) * (max_speed - min_speed)
        
        # Fuel type: 3 bits -> index in allowed_fuels
        fuel_int = int("".join(str(b) for b in bitstring[6:9]), 2)
        fuel_idx = fuel_int % len(allowed_fuels)
        fuel_type = allowed_fuels[fuel_idx]
        
        # Route detour / weather avoidance factor: 5 bits -> 1.00 to 1.14
        detour_int = int("".join(str(b) for b in bitstring[9:14]), 2)
        route_detour = 1.0 + (detour_int / 31.0) * 0.14
        
        # Shore power cold ironing: 2 bits
        shore_int = int("".join(str(b) for b in bitstring[14:16]), 2)
        shore_power = (shore_int % 2 == 1) and vessel.get("shore_power_equipped", False)
        
        return {
            "speed_knots": speed_knots,
            "fuel_type": fuel_type,
            "route_detour": route_detour,
            "shore_power": shore_power
        }

    def _apply_rotation_gate(
        self,
        q_angles: np.ndarray,
        current_bits: np.ndarray,
        best_bits: np.ndarray
    ) -> np.ndarray:
        """
        Quantum Rotation Gate lookup table:
        Rotates Q-bit angle theta towards the target state of the elite global solution.
        """
        new_angles = q_angles.copy()
        for i in range(len(q_angles)):
            x_i = current_bits[i]
            b_i = best_bits[i]
            
            # Direction of rotation
            if x_i == 0 and b_i == 1:
                direction = +1.0
            elif x_i == 1 and b_i == 0:
                direction = -1.0
            else:
                direction = 0.0
                
            delta = direction * self.delta_theta
            new_angles[i] += delta
            # Constrain theta within [0, pi/2] for canonical quadrant
            new_angles[i] = max(0.01, min(math.pi / 2 - 0.01, new_angles[i]))
            
        return new_angles

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
            allowed_fuels = ["HFO", "VLSFO", "MGO", "LNG", "Methanol", "Ammonia"]
            
        # Step 1: Initialize population of Q-bit individuals with maximum superposition theta = pi/4
        # Shape: (pop_size, num_qbits)
        q_pop = np.full((self.pop_size, self.num_qbits), math.pi / 4)
        
        all_evaluated_solutions = []
        convergence_history = []
        global_best_candidate = None
        global_best_fitness = float("inf")
        global_best_bits = None
        
        for iteration in range(self.max_iterations):
            # Step 2: Observe each Q-bit individual to obtain classical binary solutions
            observed_bits = self._observe_qbits(q_pop)
            
            iter_solutions = []
            for idx in range(self.pop_size):
                bits = observed_bits[idx]
                decoded = self._decode_candidate(bits, vessel, allowed_fuels)
                
                effective_distance = distance_nm * decoded["route_detour"]
                # Dynamic weather mitigation from optimal detour routing
                eff_wind = weather_wind_knots / (decoded["route_detour"] ** 0.8)
                eff_wave = weather_wave_m / (decoded["route_detour"] ** 0.8)
                
                is_feasible, violations = constraint_validator.validate_plan(
                    vessel=vessel,
                    cargo_tonnes=cargo_tonnes,
                    cargo_teu=cargo_teu,
                    speed_knots=decoded["speed_knots"],
                    fuel_type=decoded["fuel_type"],
                    departure_timestamp=departure_timestamp,
                    arrival_deadline_timestamp=arrival_deadline_timestamp,
                    total_distance_nm=effective_distance
                )
                
                metrics = objective_evaluator.evaluate_candidate(
                    vessel=vessel,
                    cargo_tonnes=cargo_tonnes,
                    cargo_teu=cargo_teu,
                    speed_knots=decoded["speed_knots"],
                    fuel_type=decoded["fuel_type"],
                    distance_nm=effective_distance,
                    shore_power_used=decoded["shore_power"],
                    weather_wind_knots=eff_wind,
                    weather_wave_m=eff_wave,
                    ocean_current_knots=ocean_current_knots,
                    weights=weights
                )
                
                # Penalty for infeasibility
                penalty = 6.0 * len(violations) if not is_feasible else 0.0
                composite_fitness = metrics["composite_fitness"] + penalty
                
                sol = {
                    "bitstring": [int(b) for b in bits],
                    "decoded": decoded,
                    "metrics": metrics,
                    "is_feasible": is_feasible,
                    "violations": violations,
                    "fitness": float(composite_fitness),
                    "total_fuel_mt": float(metrics["total_fuel_mt"]),
                    "total_cost_usd": float(metrics["total_cost_usd"]),
                    "total_ghg_tco2e": float(metrics["total_ghg_tco2e"]),
                    "duration_days": float(metrics["duration_days"])
                }
                iter_solutions.append(sol)
                if is_feasible:
                    all_evaluated_solutions.append(metrics)
                    
            # Identify iteration best
            iter_solutions.sort(key=lambda x: x["fitness"])
            iter_best = iter_solutions[0]
            
            if iter_best["fitness"] < global_best_fitness and iter_best["is_feasible"]:
                global_best_fitness = float(iter_best["fitness"])
                global_best_candidate = iter_best
                global_best_bits = iter_best["bitstring"].copy()
                
            convergence_history.append({
                "iteration": iteration + 1,
                "best_fitness": round(float(global_best_fitness), 4),
                "avg_fitness": round(float(np.mean([x["fitness"] for x in iter_solutions])), 4)
            })
            
            # Step 3: Apply Quantum Rotation Gates towards best solution
            if global_best_bits is not None:
                for idx in range(self.pop_size):
                    q_pop[idx] = self._apply_rotation_gate(
                        q_angles=q_pop[idx],
                        current_bits=observed_bits[idx],
                        best_bits=global_best_bits
                    )
                    
            # Step 4: Quantum mutation / Hadamard catastrophe perturbation for diversity
            if iteration % 8 == 0 and iteration > 0:
                for idx in range(self.pop_size // 4):
                    random_qbit = random.randint(0, self.num_qbits - 1)
                    q_pop[idx, random_qbit] = math.pi / 4 # Re-superpose bit
                    
        runtime = round(time.time() - start_time, 2)
        
        # Step 5: Extract True Multi-Objective Pareto Frontier
        pareto_front = pareto_extractor.extract_pareto_front(all_evaluated_solutions)
        tradeoffs = pareto_extractor.categorize_tradeoff_solutions(pareto_front)
        
        return {
            "algorithm": "Quantum-Inspired Evolutionary Algorithm (QIEA)",
            "runtime_seconds": runtime,
            "iterations": self.max_iterations,
            "population_size": self.pop_size,
            "best_solution": global_best_candidate,
            "pareto_solutions": pareto_front[:15],
            "tradeoff_archetypes": tradeoffs,
            "convergence_history": convergence_history,
            "qubit_dimension": self.num_qbits
        }

quantum_optimizer = QuantumInspiredEvolutionaryAlgorithm()
