import os
import uuid
from supabase import create_client, Client
from typing import List, Dict, Any

class SupabaseRepository:
    def __init__(self):
        url: str = os.getenv("SUPABASE_URL", "")
        key: str = os.getenv("SUPABASE_KEY", "")
        if not url or not key:
            print("Warning: Supabase URL and Key are not set yet.")
            self.client = None
        else:
            self.client: Client = create_client(url, key)

    def _check_client(self):
        if not self.client:
            raise Exception("Supabase client is not initialized.")

    def get_roles(self) -> List[Dict[str, Any]]:
        self._check_client()
        response = self.client.table("roles").select("*").order("display_order").execute()
        return response.data

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
