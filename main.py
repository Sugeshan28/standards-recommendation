from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.src.api.recommendation import router as recommendation_router

app = FastAPI(
    title="Procurement Intelligence API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendation_router)


@app.get("/")
async def root():
    return {
        "message": "Procurement Intelligence API is running"
    }