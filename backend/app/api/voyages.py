from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from app.database.mock_data import db

router = APIRouter(prefix="/voyages", tags=["Voyages"])

class VoyageCreateRequest(BaseModel):
    vessel_id: str
    cargo_type: str
    cargo_quantity_teu: int
    cargo_weight_mt: float
    cargo_priority: str
    origin_id: str
    destination_id: str
    departure_date: str
    arrival_deadline: str

@router.get("")
async def get_voyages(status: Optional[str] = None):
    if status and status.lower() != "all":
        return [v for v in db.voyages if v["status"].lower() == status.lower()]
    return db.voyages

@router.get("/{voyage_id}")
async def get_voyage_by_id(voyage_id: str):
    voyage = next((v for v in db.voyages if v["id"] == voyage_id), None)
    if not voyage:
        raise HTTPException(status_code=404, detail="Voyage not found")
    return voyage

@router.post("")
async def create_voyage(req: VoyageCreateRequest):
    vessel = next((v for v in db.vessels if v["id"] == req.vessel_id), db.vessels[0])
    new_id = f"VY-{1000 + len(db.voyages) + 1}"
    
    new_voyage = {
        "id": new_id,
        "vessel_id": vessel["id"],
        "vessel_name": vessel["name"],
        "cargo_type": req.cargo_type,
        "cargo_quantity_teu": req.cargo_quantity_teu,
        "cargo_weight_mt": req.cargo_weight_mt,
        "cargo_priority": req.cargo_priority,
        "origin_id": req.origin_id,
        "origin_name": f"Port of {req.origin_id}",
        "destination_id": req.destination_id,
        "destination_name": f"Port of {req.destination_id}",
        "departure_date": req.departure_date,
        "arrival_deadline": req.arrival_deadline,
        "estimated_arrival": req.arrival_deadline,
        "total_distance_nm": 3200,
        "distance_travelled_nm": 0,
        "distance_remaining_nm": 3200,
        "avg_speed_knots": vessel.get("opt_speed_knots", 14.0),
        "progress_pct": 0,
        "status": "Upcoming",
        "fuel_consumed_mt": 0.0,
        "estimated_total_fuel_mt": 64.0,
        "total_cost_usd": 42000,
        "total_ghg_tco2e": 140.0
    }
    db.voyages.append(new_voyage)
    return new_voyage
