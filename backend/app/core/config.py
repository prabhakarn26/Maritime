from pydantic import BaseModel
from typing import Dict, List

class FuelSpec(BaseModel):
    name: str
    code: str
    price_per_mt: float  # USD / MT
    co2_factor: float    # tCO2 / MT fuel (IMO standard)
    energy_density: float # MJ / kg (Lower Heating Value)
    sulfur_content_pct: float
    compatible_types: List[str]

class PortInfo(BaseModel):
    id: str
    name: str
    country: str
    lat: float
    lng: float
    has_shore_power: bool
    shore_power_cost_kwh: float
    avg_congestion_hours: float

class AppConfig:
    PROJECT_NAME: str = "Maritime Green Fleet Intelligence Platform"
    VERSION: str = "2.4.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Standard IMO MEPC emission conversion factors (tCO2 / tonne fuel)
    # Plus Well-To-Wake (WTW) lifecycle factors
    FUEL_SPECS: Dict[str, FuelSpec] = {
        "HFO": FuelSpec(
            name="Heavy Fuel Oil (HFO)",
            code="HFO",
            price_per_mt=520.0,
            co2_factor=3.114,
            energy_density=40.2,
            sulfur_content_pct=2.7,
            compatible_types=["Container", "Bulk Carrier", "Tanker"]
        ),
        "VLSFO": FuelSpec(
            name="Very Low Sulfur Fuel Oil (VLSFO)",
            code="VLSFO",
            price_per_mt=640.0,
            co2_factor=3.151,
            energy_density=41.2,
            sulfur_content_pct=0.5,
            compatible_types=["Container", "Bulk Carrier", "Tanker", "LNG Carrier", "Chemical Tanker"]
        ),
        "MGO": FuelSpec(
            name="Marine Gas Oil (MGO)",
            code="MGO",
            price_per_mt=850.0,
            co2_factor=3.206,
            energy_density=42.7,
            sulfur_content_pct=0.1,
            compatible_types=["Container", "Bulk Carrier", "Tanker", "LNG Carrier", "Chemical Tanker"]
        ),
        "LNG": FuelSpec(
            name="Liquefied Natural Gas (LNG)",
            code="LNG",
            price_per_mt=780.0,
            co2_factor=2.750,
            energy_density=49.2,
            sulfur_content_pct=0.0,
            compatible_types=["Container", "LNG Carrier", "Tanker"]
        ),
        "Methanol": FuelSpec(
            name="Green Methanol (e-Methanol)",
            code="Methanol",
            price_per_mt=920.0,
            co2_factor=1.375,  # Net lifecycle factor for green methanol
            energy_density=19.9,
            sulfur_content_pct=0.0,
            compatible_types=["Container", "Chemical Tanker", "Bulk Carrier"]
        ),
        "Ammonia": FuelSpec(
            name="Green Ammonia (NH3)",
            code="Ammonia",
            price_per_mt=1100.0,
            co2_factor=0.250, # Pilot ignition trace only
            energy_density=18.6,
            sulfur_content_pct=0.0,
            compatible_types=["Bulk Carrier", "Tanker"]
        ),
        "Hydrogen": FuelSpec(
            name="Liquid Green Hydrogen (LH2)",
            code="Hydrogen",
            price_per_mt=2400.0,
            co2_factor=0.050,
            energy_density=120.0,
            sulfur_content_pct=0.0,
            compatible_types=["Container"]
        )
    }

    # Major Global Ports
    PORTS: Dict[str, PortInfo] = {
        "SIN": PortInfo(id="SIN", name="Port of Singapore", country="Singapore", lat=1.290270, lng=103.851959, has_shore_power=True, shore_power_cost_kwh=0.18, avg_congestion_hours=3.5),
        "DXB": PortInfo(id="DXB", name="Port of Jebel Ali (Dubai)", country="UAE", lat=24.995000, lng=55.060000, has_shore_power=True, shore_power_cost_kwh=0.15, avg_congestion_hours=4.2),
        "SHA": PortInfo(id="SHA", name="Port of Shanghai", country="China", lat=31.2304, lng=121.4737, has_shore_power=True, shore_power_cost_kwh=0.16, avg_congestion_hours=8.0),
        "RTM": PortInfo(id="RTM", name="Port of Rotterdam", country="Netherlands", lat=51.9244, lng=4.4777, has_shore_power=True, shore_power_cost_kwh=0.22, avg_congestion_hours=2.0),
        "BOM": PortInfo(id="BOM", name="Jawaharlal Nehru Port (Mumbai)", country="India", lat=18.9490, lng=72.9510, has_shore_power=False, shore_power_cost_kwh=0.20, avg_congestion_hours=12.0),
        "LAX": PortInfo(id="LAX", name="Port of Los Angeles", country="USA", lat=33.7432, lng=-118.2673, has_shore_power=True, shore_power_cost_kwh=0.25, avg_congestion_hours=6.5),
        "CMB": PortInfo(id="CMB", name="Port of Colombo", country="Sri Lanka", lat=6.9500, lng=79.8500, has_shore_power=False, shore_power_cost_kwh=0.21, avg_congestion_hours=5.0),
        "HAM": PortInfo(id="HAM", name="Port of Hamburg", country="Germany", lat=53.5488, lng=9.9872, has_shore_power=True, shore_power_cost_kwh=0.24, avg_congestion_hours=3.1)
    }

config = AppConfig()
