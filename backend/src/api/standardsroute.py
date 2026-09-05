from fastapi import APIRouter,status,Depends
from backend.src.ingestion.pipeline import run
from fastapi import UploadFile, File
import json

standards_router = APIRouter()


@standards_router.post("/getdocs")
async def getdocument(file: UploadFile = File(...)):
    pipeline = run(file.filename)
    return json.dumps(pipeline)
    

