import math
from typing import Dict, Any
from app.core.config import config

class MaritimeEmissionsCalculator:
    def __init__(self):
        self.eu_ets_carbon_price_usd_per_tonne = 92.0 # Current EU allowance price

    def calculate_lifecycle_emissions(
        self,
        fuel_consumed_mt: float,
        fuel_type: str,
        distance_nm: float,
        capacity_dwt: float,
        cargo_mt: float,
        shore_power_hours: float = 0.0,
        port_fuel_consumed_mt: float = 0.0
    ) -> Dict[str, Any]:
        """
        Calculates Scope 1, Scope 2, Well-To-Wake GHG, CII rating, and EEOI.
        """
        fuel_spec = config.FUEL_SPECS.get(fuel_type, config.FUEL_SPECS["VLSFO"])
        
        # Voyage CO2 (Scope 1 direct)
        voyage_co2_tonnes = fuel_consumed_mt * fuel_spec.co2_factor
        
        # Methane slip & N2O GWP equivalents
        ch4_factor = 0.015 if fuel_type == "LNG" else 0.0001
        n2o_factor = 0.0002
        co2_equivalent_tonnes = voyage_co2_tonnes * (1.0 + ch4_factor * 28 + n2o_factor * 265)
        
        # SOx and NOx emissions
        sox_tonnes = fuel_consumed_mt * (fuel_spec.sulfur_content_pct / 100.0) * 2.0 * 0.98
        nox_tonnes = fuel_consumed_mt * 0.078 # IMO Tier II standard approximation
        
        # Shore power cold ironing reduction at berth
        # Auxiliary engine at port burns ~0.15 MT/hour of MGO = ~0.48 tCO2/hour
        port_baseline_fuel_mt = shore_power_hours * 0.15
        port_baseline_co2_tonnes = port_baseline_fuel_mt * config.FUEL_SPECS["MGO"].co2_factor
        
        # Grid electricity at port: ~0.35 kg CO2 / kWh
        port_kwh_consumed = shore_power_hours * 1200.0 # 1.2 MW hoteling load
        port_shore_power_co2_tonnes = (port_kwh_consumed * 0.35) / 1000.0
        
        port_co2_saved_tonnes = max(0.0, port_baseline_co2_tonnes - port_shore_power_co2_tonnes)
        net_ghg_tonnes = max(0.0, co2_equivalent_tonnes - port_co2_saved_tonnes)
        
        # IMO Carbon Intensity Indicator (CII) in gCO2 / (DWT * nm)
        total_co2_grams = voyage_co2_tonnes * 1e6
        transport_work = max(1.0, capacity_dwt * distance_nm)
        attained_cii = total_co2_grams / transport_work
        
        # Reference CII baseline (IMO 2026 trajectory)
        reference_cii = 4.2 # gCO2 / (DWT*nm) baseline for container/bulk
        ratio = attained_cii / reference_cii
        
        if ratio < 0.82:
            cii_rating = "A"
            cii_description = "Superior (Rating A - Net Zero Ready)"
        elif ratio < 0.93:
            cii_rating = "B"
            cii_description = "Good (Rating B - Highly Compliant)"
        elif ratio < 1.07:
            cii_rating = "C"
            cii_description = "Moderate (Rating C - Baseline Compliant)"
        elif ratio < 1.20:
            cii_rating = "D"
            cii_description = "Inferior (Rating D - Corrective Plan Needed)"
        else:
            cii_rating = "E"
            cii_description = "Non-compliant (Rating E - Penalties Apply)"
            
        # EEOI in gCO2 / (tonne cargo * nm)
        cargo_work = max(1.0, cargo_mt * distance_nm)
        eeoi = total_co2_grams / cargo_work
        
        # EU ETS Carbon Cost estimate
        eu_ets_cost_usd = net_ghg_tonnes * self.eu_ets_carbon_price_usd_per_tonne
        
        return {
            "voyage_co2_tonnes": round(voyage_co2_tonnes, 2),
            "net_ghg_tonnes": round(net_ghg_tonnes, 2),
            "sox_tonnes": round(sox_tonnes, 3),
            "nox_tonnes": round(nox_tonnes, 3),
            "attained_cii": round(attained_cii, 2),
            "cii_rating": cii_rating,
            "cii_description": cii_description,
            "eeoi": round(eeoi, 2),
            "port_co2_saved_tonnes": round(port_co2_saved_tonnes, 2),
            "eu_ets_cost_usd": round(eu_ets_cost_usd, 2)
        }

emissions_engine = MaritimeEmissionsCalculator()
