from typing import List, Dict, Any

class ParetoFrontierExtractor:
    def extract_pareto_front(self, solutions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extracts non-dominated Pareto frontier solutions based on (Fuel, Cost, GHG, Duration).
        """
        if not solutions:
            return []
            
        pareto_front = []
        
        for i, cand in enumerate(solutions):
            dominated = False
            for j, other in enumerate(solutions):
                if i == j:
                    continue
                # Check if other dominates cand
                # (other is <= cand in all 4 objectives and strictly < in at least 1)
                other_better_or_equal = (
                    other["total_fuel_mt"] <= cand["total_fuel_mt"] and
                    other["total_cost_usd"] <= cand["total_cost_usd"] and
                    other["total_ghg_tco2e"] <= cand["total_ghg_tco2e"] and
                    other["duration_days"] <= cand["duration_days"]
                )
                
                other_strictly_better = (
                    other["total_fuel_mt"] < cand["total_fuel_mt"] or
                    other["total_cost_usd"] < cand["total_cost_usd"] or
                    other["total_ghg_tco2e"] < cand["total_ghg_tco2e"] or
                    other["duration_days"] < cand["duration_days"]
                )
                
                if other_better_or_equal and other_strictly_better:
                    dominated = True
                    break
                    
            if not dominated:
                pareto_front.append(cand)
                
        # Sort pareto front by total fuel
        pareto_front.sort(key=lambda x: x["total_fuel_mt"])
        return pareto_front

    def categorize_tradeoff_solutions(self, pareto_solutions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Extracts distinct archetype solutions from the Pareto front:
        - Solution A (Fuel Optimal)
        - Solution B (Cost Optimal)
        - Solution C (Green / Low Emissions)
        - Solution D (Fast ETA / High Schedule Reliability)
        """
        if not pareto_solutions:
            return {}
            
        fuel_opt = min(pareto_solutions, key=lambda x: x["total_fuel_mt"])
        cost_opt = min(pareto_solutions, key=lambda x: x["total_cost_usd"])
        ghg_opt = min(pareto_solutions, key=lambda x: x["total_ghg_tco2e"])
        fast_opt = min(pareto_solutions, key=lambda x: x["duration_days"])
        
        return {
            "solution_a_fuel": {
                "name": "Solution A — Fuel Efficient",
                "badge": "Min Fuel",
                "description": "Prioritizes minimal metric tonnes of bunker fuel consumption",
                "data": fuel_opt
            },
            "solution_b_cost": {
                "name": "Solution B — Low Cost",
                "badge": "Min Cost",
                "description": "Lowest overall voyage OPEX and bunker expenditure",
                "data": cost_opt
            },
            "solution_c_ghg": {
                "name": "Solution C — Low Emission",
                "badge": "Min GHG (CII A)",
                "description": "Decarbonized plan maximizing IMO CII rating & minimizing EU ETS penalty",
                "data": ghg_opt
            },
            "solution_d_fast": {
                "name": "Solution D — Fast Arrival",
                "badge": "Min ETA",
                "description": "Max speed schedule adherence while respecting engine limits",
                "data": fast_opt
            }
        }

pareto_extractor = ParetoFrontierExtractor()
