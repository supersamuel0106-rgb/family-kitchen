import sys
import os
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# 將專案根目錄下的 backend 資料夾加入 Python 搜尋路徑
current_dir = os.path.dirname(os.path.abspath(__file__))
root_path = os.path.dirname(current_dir)
backend_path = os.path.join(root_path, 'backend')
if backend_path not in sys.path:
    sys.path.append(backend_path)

# 加載環境變數
load_dotenv(os.path.join(backend_path, '.env'))

try:
    # 延遲導入以確保 sys.path 已經生效
    from app.api.endpoints import router
    
    app = FastAPI(title="Kitchen Reservation API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 這裡的 prefix 必須與 vercel.json 的 rewrite 配合
    # 如果 vercel.json 已經重定向 /api/* 到此處，則 prefix 可能需要調整
    app.include_router(router, prefix="/api")

    @app.get("/")
    @app.get("/api")
    def read_root():
        return {"message": "Welcome to Kitchen Reservation API (via Vercel)"}

except Exception as e:
    app = FastAPI()
    error_detail = traceback.format_exc()
    @app.get("/{rest_of_path:path}")
    async def catch_all(rest_of_path: str):
        return JSONResponse(
            status_code=500,
            content={
                "detail": "後端模組加載失敗",
                "error": str(e),
                "traceback": error_detail
            }
        )
