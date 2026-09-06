from fastapi import APIRouter,status,Depends
from backend.src.ingestion.pipeline import run_extract_text
from fastapi import UploadFile, File
import json

standards_router = APIRouter()


@standards_router.post("/getdocs")
async def getdocument(file: UploadFile = File(...)):
    # 1. Existing Extraction & Cleaning
    pipeline_result = run_extract_text(file.filename)
    cleaned_text = pipeline_result["data"]
    
    # 2. LLM Structuring
    from backend.src.structuring.structurer import structure_tender_document
    structured_data = await structure_tender_document(cleaned_text)
    
    # 3. Return Structured JSON
    return structured_data.dict()


from backend.src.structuring.schema import StructuredTender
from backend.src.normalization.schema import NormalizedTenderResponse
from backend.src.normalization.normalizer import normalize_tender
from backend.src.embeddings.embeddings import generate_embedding
from pydantic import BaseModel, constr

@standards_router.post("/normalize", response_model=NormalizedTenderResponse)
async def normalize_tender_endpoint(tender_data: StructuredTender):
    """
    Accepts StructuredTender JSON and returns the LLM-normalized text version.
    """
    normalized_data = await normalize_tender(tender_data)
    return normalized_data

class EmbedRequest(BaseModel):
    normalized_text: constr(min_length=1, strip_whitespace=True)

class EmbedResponse(BaseModel):
    embedding: list[float]
    dimension: int

@standards_router.post("/embed", response_model=EmbedResponse)
async def embed_tender_endpoint(request: EmbedRequest):
    """
    Accepts normalized text and returns its embedding vector.
    """
    try:
        vector = generate_embedding(request.normalized_text)
        return EmbedResponse(embedding=vector, dimension=len(vector))
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))

class ProcessResponse(BaseModel):
    structured_tender: StructuredTender
    normalized_text: str
    embedding: list[float]
    dimension: int

@standards_router.post("/process", response_model=ProcessResponse)
async def process_tender_endpoint(file: UploadFile = File(...)):
    """
    End-to-end orchestration endpoint.
    Takes a file, and runs Extraction, Cleaning, Structuring, Normalization, and Embedding internally.
    """
    # 1. Extraction & Cleaning
    pipeline_result = run_extract_text(file.filename)
    cleaned_text = pipeline_result["data"]
    
    # 2. LLM Structuring
    from backend.src.structuring.structurer import structure_tender_document
    structured_data = await structure_tender_document(cleaned_text)
    
    # 3. LLM Normalization
    normalized_data = await normalize_tender(structured_data)
    
    # 4. Embedding
    try:
        vector = generate_embedding(normalized_data.normalized_text)
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"Embedding failed: {str(e)}")
        
    return ProcessResponse(
        structured_tender=structured_data,
        normalized_text=normalized_data.normalized_text,
        embedding=vector,
        dimension=len(vector)
    )

from backend.src.ingestion.chunking.chunker import chunk_text
from backend.src.db.vectordb import get_standards_collection

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class StructuredStandard(BaseModel):
    standard_number: str
    title: str
    revision: Optional[str] = None
    year: Optional[int] = None
    document_type: Optional[str] = None
    technical_area: Optional[str] = None
    status: Optional[str] = None
    product: Optional[str] = None
    application: Optional[str] = None
    scope: Optional[str] = None
    requirements: Optional[Dict[str, Any]] = None
    performance_requirements: Optional[Dict[str, Any]] = None
    testing_requirements: Optional[List[Any]] = None
    designation: Optional[Dict[str, Any]] = None
    marking: Optional[List[Any]] = None
    normative_references: Optional[List[Any]] = None
    keywords: Optional[List[str]] = None
    source: Optional[Dict[str, Any]] = None
    notes: Optional[List[Any]] = None
    
    class Config:
        extra = "allow"

class StoreStandardResponse(BaseModel):
    status: str
    standard_number: str
    chunks_stored: int
    embedding_dimension: int
    collection: str

def format_structured_standard(standard: StructuredStandard) -> str:
    lines = []
    
    # Core identifying info
    lines.append(f"Standard: {standard.standard_number}")
    lines.append(f"Title: {standard.title}")
    
    if standard.revision:
        lines.append(f"Revision: {standard.revision}")
    if standard.year:
        lines.append(f"Year: {standard.year}")
    if standard.document_type:
        lines.append(f"Document Type: {standard.document_type}")
    if standard.technical_area:
        lines.append(f"Technical Area: {standard.technical_area}")
    if standard.status:
        lines.append(f"Status: {standard.status}")
    if standard.product:
        lines.append(f"Product: {standard.product}")
    if standard.application:
        lines.append(f"Application: {standard.application}")
    if standard.scope:
        lines.append(f"\nScope:\n{standard.scope}")
        
    def _format_dict(d: dict, indent: str = "") -> str:
        res = []
        for k, v in d.items():
            clean_k = k.replace("_", " ").title()
            if isinstance(v, dict):
                res.append(f"{indent}- {clean_k}:")
                res.append(_format_dict(v, indent + "  "))
            elif isinstance(v, list):
                res.append(f"{indent}- {clean_k}:")
                for item in v:
                    res.append(f"{indent}  * {item}")
            else:
                res.append(f"{indent}- {clean_k}: {v}")
        return "\n".join(res)
        
    def _format_list(lst: list, indent: str = "") -> str:
        res = []
        for item in lst:
            if isinstance(item, dict):
                res.append(f"{indent}- (Item):")
                res.append(_format_dict(item, indent + "  "))
            else:
                res.append(f"{indent}- {item}")
        return "\n".join(res)

    # Dump the rest dynamically
    model_dict = standard.model_dump(exclude_unset=True, exclude={
        "standard_number", "title", "revision", "year", "document_type", 
        "technical_area", "status", "product", "application", "scope"
    })
    
    for key, value in model_dict.items():
        if value: # ignore empty lists/dicts
            clean_key = key.replace("_", " ").title()
            lines.append(f"\n{clean_key}:")
            if isinstance(value, dict):
                lines.append(_format_dict(value))
            elif isinstance(value, list):
                lines.append(_format_list(value))
            else:
                lines.append(str(value))
                
    return "\n".join(lines)


@standards_router.post("/storestandards", response_model=StoreStandardResponse)
async def store_standards_endpoint(request: StructuredStandard):
    """
    Takes structured Standard JSON, formats it to technical text, chunks it, embeds it, and stores it in ChromaDB.
    """
    technical_text = format_structured_standard(request)
    
    if not technical_text.strip():
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Generated technical text is empty.")
    
    chunks = chunk_text(technical_text)
    
    if not chunks:
        return StoreStandardResponse(
            status="success", 
            standard_number=request.standard_number,
            chunks_stored=0,
            embedding_dimension=384,
            collection="standards_collection"
        )
        
    embeddings = []
    ids = []
    metadatas = []
    
    for i, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)
        
        # Idempotent storage: unique ID for standard + chunk index
        chunk_id = f"{request.standard_number}_chunk_{i}"
        
        embeddings.append(embedding)
        ids.append(chunk_id)
        
        metadatas.append({
            "standard_number": request.standard_number,
            "title": request.title,
            "chunk_index": i
        })
        
    collection = get_standards_collection()
    
    # Upsert to make it idempotent
    collection.upsert(
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )
    
    return StoreStandardResponse(
        status="success", 
        standard_number=request.standard_number,
        chunks_stored=len(chunks),
        embedding_dimension=384,
        collection="standards_collection"
    )

from backend.src.recommendation.schema import SearchResponse
from backend.src.orchestration.search_orchestrator import execute_search_pipeline

@standards_router.post("/search", response_model=SearchResponse)
async def search_standards_endpoint(file: UploadFile = File(...)):
    """
    End-to-End Orchestrated Endpoint:
    Takes a raw tender document (file), executes Extraction -> Structuring -> 
    Normalization -> Semantic Search & LLM Reasoning, and returns standard recommendations.
    """
    return await execute_search_pipeline(file)
