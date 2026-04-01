import os
import uuid
from supabase import create_client, Client
from typing import List, Dict, Any

class SupabaseRepository:
    def __init__(self):
        url: str = os.getenv("SUPABASE_URL", "")
        key: str = os.getenv("SUPABASE_KEY", "")
        self._init_error = None
        
        if not url or not key:
            self._init_error = "SUPABASE_URL 或 SUPABASE_KEY 環境變數未設定，請檢查 Vercel 設定。"
            self.client = None
        else:
            try:
                self.client: Client = create_client(url, key)
            except Exception as e:
                self._init_error = f"無法初始化 Supabase 客戶端: {str(e)}"
                self.client = None

    def _check_client(self):
        if not self.client:
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=self._init_error or "Supabase 客戶端未初始化")

    def get_roles(self) -> List[Dict[str, Any]]:
        self._check_client()
        try:
            response = self.client.table("roles").select("*").order("display_order").execute()
            return response.data
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=f"讀取角色資料失敗: {str(e)}")

    def get_reservations(self) -> List[Dict[str, Any]]:
        self._check_client()
        # Fetching all reservations. In a real app we might filter by date.
        response = self.client.table("reservations").select("*").order("created_at", desc=True).execute()
        return response.data

    def create_reservation(self, role_id: str, date: str, slot: str) -> Dict[str, Any]:
        self._check_client()
        data = {
            "role_id": role_id,
            "reservation_date": date,
            "time_slot": slot,
            "status": "active"
        }
        response = self.client.table("reservations").insert(data).execute()
        return response.data[0] if response.data else None

    def start_session(self, role_id: str, start_time: str) -> Dict[str, Any]:
        self._check_client()
        data = {
            "role_id": role_id,
            "start_time": start_time,
            "status": "in_progress"
        }
        response = self.client.table("usage_sessions").insert(data).execute()
        return response.data[0] if response.data else None

    def get_session(self, session_id: str) -> Dict[str, Any]:
        self._check_client()
        response = self.client.table("usage_sessions").select("*").eq("id", session_id).execute()
        return response.data[0] if response.data else None

    def end_session(self, session_id: str, end_time: str, duration: int) -> Dict[str, Any]:
        self._check_client()
        data = {
            "end_time": end_time,
            "duration_seconds": duration,
            "status": "completed"
        }
        response = self.client.table("usage_sessions").update(data).eq("id", session_id).execute()
        return response.data[0] if response.data else None

    def upload_photo(self, file_bytes: bytes, file_name: str, content_type: str) -> str:
        self._check_client()
        # Ensure unique file name
        unique_name = f"{uuid.uuid4()}_{file_name}"
        path = f"photos/{unique_name}"
        
        # We need to pass file bytes as content
        self.client.storage.from_("kitchen_photos").upload(
            path,
            file_bytes,
            file_options={"content-type": content_type}
        )
        return self.client.storage.from_("kitchen_photos").get_public_url(path)

    def create_post(self, session_id: str, role_id: str, photo_url: str, caption: str, published_at: str, duration: int) -> Dict[str, Any]:
        self._check_client()
        data = {
            "usage_session_id": session_id,
            "role_id": role_id,
            "photo_url": photo_url,
            "caption": caption,
            "published_at": published_at,
            "duration_seconds": duration
        }
        response = self.client.table("usage_posts").insert(data).execute()
        return response.data[0] if response.data else None

    def get_posts(self) -> List[Dict[str, Any]]:
        self._check_client()
        response = self.client.table("usage_posts").select("*").order("published_at", desc=True).execute()
        return response.data

repo = SupabaseRepository()
