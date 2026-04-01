from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from app.schema.schemas import (
    RoleBase, 
    ReservationCreate, 
    ReservationResponse, 
    UsageSessionCreate, 
    UsageSessionResponse, 
    SessionEndRequest, 
    UsagePostResponse
)
from app.service.kitchen_service import kitchen_service

router = APIRouter()

@router.get("/roles", response_model=List[RoleBase])
def get_roles():
    return kitchen_service.get_roles()

@router.get("/reservations", response_model=List[ReservationResponse])
def get_reservations():
    return kitchen_service.get_reservations()

@router.post("/reservations", response_model=ReservationResponse)
def create_reservation(req: ReservationCreate):
    return kitchen_service.create_reservation(req.role_id, req.reservation_date, req.time_slot)

@router.post("/sessions/start", response_model=UsageSessionResponse)
def start_session(req: UsageSessionCreate):
    return kitchen_service.start_session(req.role_id)

@router.post("/sessions/{session_id}/end", response_model=UsageSessionResponse)
def end_session(session_id: str, req: SessionEndRequest):
    return kitchen_service.end_session(session_id, req.duration_seconds)

@router.post("/posts", response_model=UsagePostResponse)
async def create_post(
    session_id: str = Form(...),
    role_id: str = Form(...),
    caption: str = Form(...),
    duration_seconds: int = Form(...),
    photo: UploadFile = File(...)
):
    if not photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File必须是图片")
    
    file_bytes = await photo.read()
    return kitchen_service.submit_post(
        session_id=session_id,
        role_id=role_id,
        caption=caption,
        duration=duration_seconds,
        file_bytes=file_bytes,
        file_name=photo.filename,
        content_type=photo.content_type
    )

@router.get("/posts", response_model=List[UsagePostResponse])
def get_posts():
    return kitchen_service.get_posts()
