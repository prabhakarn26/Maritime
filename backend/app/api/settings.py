from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from app.database.mock_data import db

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("")
async def get_settings():
    return db.settings

@router.put("")
async def update_settings(new_settings: Dict[str, Any]):
    db.settings.update(new_settings)
    return {"message": "Settings updated successfully", "settings": db.settings}
