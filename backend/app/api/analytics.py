from fastapi import APIRouter
from typing import Optional, List, Dict
from app.database.mock_data import db

router = APIRouter(prefix="/analytics", tags=["Reports & Analytics"])

@router.get("/overview")
async def get_analytics_overview():
    total_fuel = sum(v.get("fuel_consumed_mt", 48.0) for v in db.voyages) * 12.5 # Scaled for fleet
    total_cost = sum(v.get("total_cost_usd", 48000.0) for v in db.voyages) * 11.8
    total_ghg = sum(v.get("total_ghg_tco2e", 150.0) for v in db.voyages) * 12.0
    
    return {
        "total_vessels": len(db.vessels),
        "active_vessels": len([v for v in db.vessels if v["status"] == "On Route"]),
        "at_port_vessels": len([v for v in db.vessels if v["status"] == "At Port"]),
        "delayed_vessels": len([v for v in db.vessels if v["status"] == "Delayed"]),
        "total_active_voyages": len(db.voyages),
        "total_fuel_mt": 45320,
        "total_cost_usd": 22800000,
        "total_ghg_tco2e": 135600,
        "avg_voyage_days": 12.4,
        "fuel_saved_ytd_mt": 6420,
        "cost_saved_ytd_usd": 3850000,
        "ghg_reduction_pct": 14.7,
        "cii_distribution": {"A": 4, "B": 2, "C": 1, "D": 1, "E": 0}
    }

@router.get("/fuel-trends")
async def get_fuel_trends():
    return [
        {"month": "Oct 2025", "actual_mt": 3820, "predicted_mt": 3950, "target_mt": 3700},
        {"month": "Nov 2025", "actual_mt": 4120, "predicted_mt": 4080, "target_mt": 3900},
        {"month": "Dec 2025", "actual_mt": 4450, "predicted_mt": 4390, "target_mt": 4100},
        {"month": "Jan 2026", "actual_mt": 4210, "predicted_mt": 4280, "target_mt": 4000},
        {"month": "Feb 2026", "actual_mt": 3980, "predicted_mt": 4020, "target_mt": 3800},
        {"month": "Mar 2026", "actual_mt": 4350, "predicted_mt": 4310, "target_mt": 4050}
    ]

@router.get("/breakdowns")
async def get_breakdowns():
    return {
        "emissions_breakdown": [
            {"source": "Main Propulsion Engine", "percentage": 62, "tco2e": 84072},
            {"source": "Auxiliary Power Generators", "percentage": 18, "tco2e": 24408},
            {"source": "Port & Hoteling Operations", "percentage": 12, "tco2e": 16272},
            {"source": "Cargo Handling & Reefer", "percentage": 7, "tco2e": 9492},
            {"source": "Boiler & Incinerator", "percentage": 1, "tco2e": 1356}
        ],
        "cost_breakdown": [
            {"category": "Bunker Fuel Cost", "percentage": 48, "amount_usd": 10944000},
            {"category": "Port Dues & Berthing", "percentage": 22, "amount_usd": 5016000},
            {"category": "Crew & Manning", "percentage": 12, "amount_usd": 2736000},
            {"category": "Predictive Maintenance", "percentage": 12, "amount_usd": 2736000},
            {"category": "Insurance & ETS Carbon Tax", "percentage": 6, "amount_usd": 1368000}
        ],
        "voyage_analysis_by_cargo": [
            {"month": "Oct 2025", "Containers": 18, "Bulk": 12, "LNG": 6, "Chemicals": 4},
            {"month": "Nov 2025", "Containers": 20, "Bulk": 14, "LNG": 7, "Chemicals": 5},
            {"month": "Dec 2025", "Containers": 22, "Bulk": 15, "LNG": 8, "Chemicals": 4},
            {"month": "Jan 2026", "Containers": 19, "Bulk": 13, "LNG": 6, "Chemicals": 6},
            {"month": "Feb 2026", "Containers": 21, "Bulk": 14, "LNG": 7, "Chemicals": 5},
            {"month": "Mar 2026", "Containers": 24, "Bulk": 16, "LNG": 8, "Chemicals": 6}
        ]
    }

@router.get("/vessel-performance")
async def get_vessel_performance_summary():
    return [
        {"vessel": "MV Ocean Star", "voyages": 8, "distance_nm": 28400, "fuel_mt": 3800, "cost_usd": 1850000, "emissions_tco2": 11890, "avg_speed": 14.3, "cii": "A", "status": "Compliant"},
        {"vessel": "MV Pacific Dawn", "voyages": 6, "distance_nm": 18200, "fuel_mt": 2540, "cost_usd": 1340000, "emissions_tco2": 7850, "avg_speed": 14.2, "cii": "B", "status": "Compliant"},
        {"vessel": "MV Horizon", "voyages": 7, "distance_nm": 24100, "fuel_mt": 3650, "cost_usd": 1890000, "emissions_tco2": 11540, "avg_speed": 12.8, "cii": "C", "status": "Compliant"},
        {"vessel": "MV Blue Wave", "voyages": 4, "distance_nm": 17800, "fuel_mt": 4780, "cost_usd": 2350000, "emissions_tco2": 15240, "avg_speed": 14.0, "cii": "A", "status": "Compliant"},
        {"vessel": "MV Arctic Breeze", "voyages": 5, "distance_nm": 19500, "fuel_mt": 5120, "cost_usd": 3100000, "emissions_tco2": 16300, "avg_speed": 13.1, "cii": "B", "status": "Compliant"},
        {"vessel": "MV Sea Pioneer", "voyages": 9, "distance_nm": 16400, "fuel_mt": 1450, "cost_usd": 850000, "emissions_tco2": 4500, "avg_speed": 12.5, "cii": "B", "status": "Compliant"},
        {"vessel": "MV Sun Navigator", "voyages": 6, "distance_nm": 22100, "fuel_mt": 3200, "cost_usd": 1620000, "emissions_tco2": 10200, "avg_speed": 14.6, "cii": "A", "status": "Compliant"},
        {"vessel": "MV Explorer", "voyages": 5, "distance_nm": 18900, "fuel_mt": 3400, "cost_usd": 1710000, "emissions_tco2": 10800, "avg_speed": 12.0, "cii": "D", "status": "Review Required"}
    ]
