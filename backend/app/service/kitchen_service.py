from typing import List, Dict, Any
from datetime import datetime, timezone
from fastapi import HTTPException
from app.repository.supabase_repo import repo

class KitchenService:
    def get_roles(self) -> List[Dict[str, Any]]:
        return repo.get_roles()

    def get_reservations(self) -> List[Dict[str, Any]]:
        return repo.get_reservations()

    def create_reservation(self, role_id: str, date: str, slot: str) -> Dict[str, Any]:
        # 检查冲突
        reservations = repo.get_reservations()
        for r in reservations:
            if r.get("reservation_date") == date and r.get("time_slot") == slot and r.get("status") == "active":
                raise HTTPException(status_code=400, detail="该时段已被预约")
        
        return repo.create_reservation(role_id, date, slot)

    def start_session(self, role_id: str) -> Dict[str, Any]:
        start_time = datetime.now(timezone.utc).isoformat()
        return repo.start_session(role_id, start_time)

    def end_session(self, session_id: str, duration: int) -> Dict[str, Any]:
        session = repo.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        end_time = datetime.now(timezone.utc).isoformat()
        return repo.end_session(session_id, end_time, duration)

    def submit_post(self, session_id: str, role_id: str, caption: str, duration: int, file_bytes: bytes, file_name: str, content_type: str) -> Dict[str, Any]:
        try:
            photo_url = repo.upload_photo(file_bytes, file_name, content_type)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"上传照片失败: {str(e)}")
        
        published_at = datetime.now(timezone.utc).isoformat()
        return repo.create_post(session_id, role_id, photo_url, caption, published_at, duration)

    def get_posts(self) -> List[Dict[str, Any]]:
        return repo.get_posts()

kitchen_service = KitchenService()
