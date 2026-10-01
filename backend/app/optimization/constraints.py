from typing import Dict, List, Any, Tuple
from app.core.config import config

class ConstraintValidator:
    def validate_plan(
        self,
        vessel: Dict[str, Any],
        cargo_tonnes: float,
        cargo_teu: int,
        speed_knots: float,
        fuel_type: str,
        departure_timestamp: float,
        arrival_deadline_timestamp: float,
        total_distance_nm: float,
        is_eca_zone: bool = False,
        budget_limit_usd: float = None,
        emission_limit_tco2e: float = None
    ) -> Tuple[bool, List[str]]:
        """
        Validates all operational maritime constraints.
        Returns (is_feasible: bool, violations: List[str]).
        """
        violations = []
        
        # 1. Vessel capacity constraint
        if cargo_teu > vessel.get("capacity_teu", 0):
            violations.append(f"Cargo TEU ({cargo_teu}) exceeds vessel capacity ({vessel['capacity_teu']} TEU)")
            
        if cargo_tonnes > vessel.get("dwt", 0):
            violations.append(f"Cargo mass ({cargo_tonnes:,.0f} MT) exceeds vessel Deadweight ({vessel['dwt']:,.0f} DWT)")
            
        # 2. Speed limits constraint
        min_speed = 8.0
        max_speed = vessel.get("max_speed_knots", 22.0)
        if speed_knots < min_speed:
            violations.append(f"Speed ({speed_knots:.1f} kn) is below minimum steerage speed ({min_speed} kn)")
        if speed_knots > max_speed:
            violations.append(f"Speed ({speed_knots:.1f} kn) exceeds vessel maximum rated speed ({max_speed} kn)")
            
        # 3. Schedule / Deadline constraint
        travel_hours = total_distance_nm / max(1.0, speed_knots)
        available_hours = (arrival_deadline_timestamp - departure_timestamp) / 3600.0
        if travel_hours > available_hours:
            delay_hrs = travel_hours - available_hours
            violations.append(f"Arrival ETA exceeds deadline by {delay_hrs:.1f} hours at speed {speed_knots:.1f} kn")
            
        # 4. Fuel compatibility constraint
        fuel_spec = config.FUEL_SPECS.get(fuel_type)
        if not fuel_spec:
            violations.append(f"Unknown fuel type: {fuel_type}")
        else:
            vessel_type = vessel.get("vessel_type", "")
            if not any(t in vessel_type for t in fuel_spec.compatible_types):
                violations.append(f"Fuel '{fuel_type}' is technically incompatible with vessel type '{vessel_type}'")
                
        # 5. Emission Control Area (ECA) sulfur limit constraint
        if is_eca_zone and fuel_spec and fuel_spec.sulfur_content_pct > 0.1:
            violations.append(f"Fuel '{fuel_type}' sulfur content ({fuel_spec.sulfur_content_pct}%) exceeds IMO ECA limit of 0.1%")
            
        # 6. Budget cap constraint (if set)
        # Note: Checked in objective evaluations
        
        is_feasible = len(violations) == 0
        return is_feasible, violations

constraint_validator = ConstraintValidator()
