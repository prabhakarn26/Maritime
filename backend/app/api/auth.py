from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.database.mock_data import db

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: str
    status: str
    avatar: str

@router.post("/login")
async def login(req: LoginRequest):
    # Search for user or default to Admin
    user = next((u for u in db.users if u["email"].lower() == req.email.lower()), None)
    if not user:
        # Default mock login for demo ease
        user = db.users[0]
        
    return {
        "access_token": f"jwt_mock_token_{user['id']}_2026",
        "token_type": "bearer",
        "user": user
    }

@router.get("/me")
async def get_current_user():
    return db.users[0]

@router.get("/users")
async def get_all_users():
    return db.users

@router.post("/users")
async def add_user(user_data: dict):
    new_id = f"USR-{len(db.users) + 1:03d}"
    new_user = {
        "id": new_id,
        "name": user_data.get("name", "New Fleet Operator"),
        "email": user_data.get("email", "operator@maritime.com"),
        "role": user_data.get("role", "Fleet Analyst"),
        "department": user_data.get("department", "Operations"),
        "status": "Active",
        "last_login": "Just now",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
    }
    db.users.append(new_user)
    return new_user
