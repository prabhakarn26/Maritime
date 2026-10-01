from fastapi import APIRouter, HTTPException
from typing import Optional, List
from app.database.mock_data import db

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])

@router.get("")
async def get_alerts(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    vessel_id: Optional[str] = None
):
    alerts = db.alerts
    if severity and severity.lower() != "all":
        alerts = [a for a in alerts if a["severity"].lower() == severity.lower()]
    if status and status.lower() != "all":
        alerts = [a for a in alerts if a["status"].lower() == status.lower()]
    if vessel_id and vessel_id.lower() != "all":
        alerts = [a for a in alerts if a["vessel_id"] == vessel_id]
    return alerts

@router.post("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    alert = next((a for a in db.alerts if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert["acknowledged"] = True
    alert["status"] = "Acknowledged"
    return {"message": f"Alert {alert_id} acknowledged successfully", "alert": alert}

@router.post("/{alert_id}/recalculate")
async def recalculate_from_alert(alert_id: str):
    alert = next((a for a in db.alerts if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    vessel = next((v for v in db.vessels if v["id"] == alert["vessel_id"]), db.vessels[0])
    
    return {
        "message": "Optimization re-calculation initiated successfully from operational alert trigger",
        "alert_id": alert_id,
        "vessel_name": vessel["name"],
        "recommended_action": "Diverted Route #2 (Southern Corridor Avoidance)",
        "adjusted_speed_knots": 13.8,
        "estimated_fuel_saved_mt": 32.4,
        "hazard_cleared": True,
        "safety_margin_nm": 120
    }
