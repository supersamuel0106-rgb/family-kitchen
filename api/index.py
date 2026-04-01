import sys
import os

# 將專案根目錄下的 backend 資料夾加入 Python 搜尋路徑
# 這樣 backend/main.py 內部的 imports (例如 from app.api.endpoints ...) 才能正確運作
root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_path = os.path.join(root_path, 'backend')
sys.path.append(backend_path)

# 從 backend/main.py 導入 FastAPI 實例
from main import app

# 這邊 app 的變數名稱必須符合 vercel.json 中的目的地 (或者 Vercel 預設會尋找 app 或 handler)
