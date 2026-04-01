import sys
import os
import traceback
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# 將專案根目錄下的 backend 資料夾加入 Python 搜尋路徑
try:
    # 使用絕對路徑以確保在 Vercel 環境下穩定
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_path = os.path.dirname(current_dir)
    backend_path = os.path.join(root_path, 'backend')
    
    if backend_path not in sys.path:
        sys.path.append(backend_path)

    # 從 backend/main.py 導入 FastAPI 實例
    from main import app as fastapi_app
    app = fastapi_app

except Exception as e:
    # 如果啟動失敗，建立一個臨時的 FastAPI app 來顯示錯誤訊息
    app = FastAPI()
    error_detail = traceback.format_exc()
    
    @app.get("/{rest_of_path:path}")
    async def catch_all(rest_of_path: str):
        return JSONResponse(
            status_code=500,
            content={
                "detail": "後端啟動失敗 (Backend startup failed)",
                "error": str(e),
                "traceback": error_detail
            }
        )

# 這邊 app 的變數名稱必須符合 vercel.json 中的目的地
