from fastapi import FastAPI
from backend.src.api.standardsroute import standards_router
app = FastAPI(
    title="Indian standards",
    version="v1"
)

app.include_router(standards_router, prefix="/api/v1/standards")