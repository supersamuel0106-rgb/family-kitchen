from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RoleBase(BaseModel):
    id: str
    role_name: str
    avatar: str
    color: str
    icon: str
    display_order: int

class ReservationCreate(BaseModel):
    role_id: str
    reservation_date: str
    time_slot: str

class ReservationResponse(BaseModel):
    id: str
    role_id: str
    reservation_date: str
    time_slot: str
    status: str
    created_at: str

class UsageSessionCreate(BaseModel):
    role_id: str

class UsageSessionResponse(BaseModel):
    id: str
    role_id: str
    start_time: str
    end_time: Optional[str] = None
    duration_seconds: Optional[int] = None
    status: str
    created_at: str

class SessionEndRequest(BaseModel):
    duration_seconds: int

class UsagePostResponse(BaseModel):
    id: str
    usage_session_id: str
    role_id: str
    photo_url: str
    caption: str
    published_at: str
    created_at: str
    duration_seconds: int
