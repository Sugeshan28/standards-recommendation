from pydantic import BaseModel, constr
from typing import List

class SearchRequest(BaseModel):
    normalized_text: constr(min_length=1, strip_whitespace=True)

class RecommendationResponse(BaseModel):
    standard_number: str
    title: str
    relevance_score: float
    reason: str

class SearchResponse(BaseModel):
    query: dict
    recommendations: List[RecommendationResponse]
