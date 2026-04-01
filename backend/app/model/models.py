from typing import TypedDict, Optional

class RoleModel(TypedDict):
    id: str
    role_name: str
    avatar: str
    color: str
    icon: str
    display_order: int

class ReservationModel(TypedDict):
    id: str
    role_id: str
    reservation_date: str
    time_slot: str
    status: str
    created_at: str

class UsageSessionModel(TypedDict):
    id: str
    role_id: str
    start_time: str
    end_time: Optional[str]
    duration_seconds: Optional[int]
    status: str
    created_at: str

class UsagePostModel(TypedDict):
    id: str
    usage_session_id: str
    role_id: str
    photo_url: str
    caption: str
    published_at: str
    duration_seconds: int
    created_at: str
