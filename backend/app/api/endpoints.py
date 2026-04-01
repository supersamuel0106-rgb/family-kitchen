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

@router.post("/posts")
async def create_post(
    photo: UploadFile = File(...),
    caption: str = Form(...),
    role_id: str = Form(...),
    session_id: str = Form(None)  # 設為可選以增加魯棒性
):
    try:
        # 1. 讀取圖片位元組
        photo_bytes = await photo.read()
        
        # 2. 如果沒有傳入 session_id，試圖找到該角色的最新進行中會話
        active_session_id = session_id
        if not active_session_id:
            # 獲取該角色最後一個 session
            try:
                # 這裡假設 repo 有 get_latest_session 方法或我們直接查詢
                sessions = repo.client.table("usage_sessions").select("id").eq("role_id", role_id).order("start_time", desc=True).limit(1).execute()
                if sessions.data:
                    active_session_id = sessions.data[0]["id"]
            except:
                pass
        
        # 3. 上傳照片
        photo_url = repo.upload_photo(photo_bytes, photo.filename, photo.content_type)
        
        # 4. 建立貼文
        # 獲取當前 ISO 時間
        published_at = datetime.now().isoformat()
        
        # 建立貼文記錄
        post = repo.create_post(
            session_id=active_session_id,
            role_id=role_id,
            photo_url=photo_url,
            caption=caption,
            published_at=published_at,
            duration=0 # 暫時設為 0，後續可從 session 計算
        )
        return post
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API 建立貼文失敗: {str(e)}")

@router.get("/posts", response_model=List[UsagePostResponse])
def get_posts():
    return kitchen_service.get_posts()
