import sys
import os
import traceback

def create_app():
    try:
        from fastapi import FastAPI
        from fastapi.responses import JSONResponse
        from fastapi.middleware.cors import CORSMiddleware
        from dotenv import load_dotenv

        # 加入路徑
        current_dir = os.path.dirname(os.path.abspath(__file__))
        root_path = os.path.dirname(current_dir)
        backend_path = os.path.join(root_path, 'backend')
        if backend_path not in sys.path:
            sys.path.append(backend_path)

        # 加載環境變數
        load_dotenv(os.path.join(backend_path, '.env'))

        # 延遲導入業務邏輯
        from app.api.endpoints import router

        app = FastAPI(title="Kitchen Reservation API (Robust)")

        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        # 診斷端點
        @app.get("/api/debug")
        def debug_info():
            files = []
            try:
                files = os.listdir(root_path)
            except: pass
            
            # 資料庫測試
            db_status = "N/A"
            db_error = None
            db_init_err = None
            storage_status = "N/A"
            storage_error = None
            
            try:
                from app.repository.supabase_repo import repo
                db_init_err = repo._init_error
                
                if repo.client:
                    # 1. 資料庫連線測試
                    test_res = repo.client.table("roles").select("id").limit(1).execute()
                    db_status = "CONNECTED"
                    
                    # 2. Storage 存儲桶測試
                    try:
                        # 嘗試列出 bucket 中的檔案（即使用戶沒有檔案也應該能成功呼叫）
                        storage_res = repo.client.storage.get_bucket("kitchen_photos")
                        storage_status = "FOUND"
                    except Exception as se:
                        storage_status = "NOT_FOUND_OR_ERROR"
                        storage_error = str(se)
                else:
                    db_status = "INIT_FAILED"
            except Exception as e:
                db_status = "QUERY_FAILED"
                db_error = str(e)

            return {
                "status": "online",
                "python_version": sys.version,
                "current_dir": current_dir,
                "root_path": root_path,
                "backend_path": backend_path,
                "root_files": files,
                "env_supabase_url": "SET" if os.getenv("SUPABASE_URL") else "MISSING",
                "env_supabase_key": "SET" if os.getenv("SUPABASE_KEY") else "MISSING",
                "db_test_status": db_status,
                "db_test_error": db_error,
                "db_init_error": db_init_err,
                "storage_test_status": storage_status,
                "storage_test_error": storage_error
            }

        # 主路由
        app.include_router(router, prefix="/api")

        @app.get("/")
        @app.get("/api")
        def read_root():
            return {"message": "API is running. Visit /api/debug for diagnostics."}

        return app

    except Exception as e:
        # 如果任何一個庫 (fastapi 等) 加載失敗，建立最簡單的對象
        error_msg = str(e)
        error_trace = traceback.format_exc()
        
        # 這裡不能依賴 FastAPI 成功加載，但 Vercel 需要一個 ASGI app
        async def fallback_app(scope, receive, send):
            if scope['type'] == 'http':
                content = f'{{"detail": "後端關鍵模組加載失敗", "error": "{error_msg}", "traceback": ""}}'.encode('utf-8')
                await send({
                    'type': 'http.response.start',
                    'status': 500,
                    'headers': [[b'content-type', b'application/json; charset=utf-8']]
                })
                await send({
                    'type': 'http.response.body',
                    'body': content
                })
        return fallback_app

app = create_app()
