from fastapi import APIRouter
from pydantic import BaseModel
from backend.src.standards.temporary_llm import process_standards

router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"]
)


class RecommendationRequest(BaseModel):
    officer_name: str = ""
    officer_designation: str = ""
    department: str = ""
    gem_buyer_id: str = ""
    tender_reference: str = ""
    tender_budget: str = ""

    product_category: str = ""
    product_description: str = ""
    document_text: str = ""
    material: str = ""
    operating_rating: str = ""

    language: str = "en"


@router.post("/")
async def recommend(data: RecommendationRequest):
    data = await process_standards(data)
    return data