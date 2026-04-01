import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.api.endpoints import router

app = FastAPI(title="Kitchen Reservation API")

# Setup CORS to allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to your specific frontend url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Kitchen Reservation API"}
