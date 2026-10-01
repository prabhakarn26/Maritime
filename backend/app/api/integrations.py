from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime
from app.database.mock_data import db

router = APIRouter(prefix="/integrations", tags=["Data Integrations"])

@router.get("/sources")
async def get_data_sources():
    return db.data_sources

@router.get("/feed")
async def get_live_data_feed():
    now_str = datetime.utcnow().strftime("%H:%M:%S UTC")
    return [
        {"id": "F-01", "time": now_str, "source": "AIS Satellite", "vessel": "MV Pacific Dawn", "data_type": "Position Update", "raw_value": "Lat 10.51°N, Lng 72.31°E", "status": "Verified"},
        {"id": "F-02", "time": now_str, "source": "Port Data (SIN)", "vessel": "MV Ocean Star", "data_type": "Berth Confirmation", "raw_value": "Jurong West #4 Confirmed", "status": "Verified"},
        {"id": "F-03", "time": now_str, "source": "NOAA Marine", "vessel": "Fleet Wide", "data_type": "Weather Alert", "raw_value": "Wave Height 4.5m Arabian Sea", "status": "Active Alert"},
        {"id": "F-04", "time": now_str, "source": "IoT Telemetry", "vessel": "MV Ocean Star", "data_type": "Engine Sensor", "raw_value": "RPM: 78.4, Exhaust: 435°C", "status": "Verified"},
        {"id": "F-05", "time": now_str, "source": "Bunker Platts", "vessel": "Port of Singapore", "data_type": "VLSFO Spot Price", "raw_value": "$640.00 / MT", "status": "Indexed"},
        {"id": "F-06", "time": now_str, "source": "Copernicus Marine", "vessel": "Indian Ocean Corridor", "data_type": "Current Vector", "raw_value": "1.2 kn @ 245° Bearing", "status": "Verified"}
    ]
