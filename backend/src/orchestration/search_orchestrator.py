from fastapi import UploadFile, HTTPException
from backend.src.ingestion.pipeline import run_extract_text
from backend.src.structuring.structurer import structure_tender_document
from backend.src.normalization.normalizer import normalize_tender
from backend.src.recommendation.recommender import search_and_recommend
from backend.src.recommendation.schema import SearchResponse

async def execute_search_pipeline(file: UploadFile) -> SearchResponse:
    """
    End-to-End Orchestrator for Tender Standard Recommendation.
    Executes Extraction -> Structuring -> Normalization -> Semantic Search & Recommendation.
    """
    # 1. Extraction & Cleaning
    try:
        pipeline_result = run_extract_text(file.filename)
        cleaned_text = pipeline_result["data"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

    # 2. LLM Structuring
    try:
        structured_data = await structure_tender_document(cleaned_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Structuring failed: {str(e)}")

    # 3. LLM Normalization
    try:
        normalized_data = await normalize_tender(structured_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Normalization failed: {str(e)}")

    # 4. Search & Recommendation (Embedding is done internally)
    try:
        recommendations = await search_and_recommend(
            tender_text=normalized_data.normalized_text,
            top_k_chunks=15,
            top_k_standards=5,
            min_threshold=0.0
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic Search failed: {str(e)}")

    return SearchResponse(
        query={"normalized_text": normalized_data.normalized_text},
        recommendations=recommendations
    )
