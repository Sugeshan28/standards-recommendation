import json
from collections import defaultdict
from backend.src.embeddings.embeddings import generate_embedding
from backend.src.db.vectordb import get_standards_collection
from backend.src.llm_gateway.gateway import get_llm_provider
from backend.src.recommendation.prompt import RECOMMENDATION_REASON_PROMPT
from backend.src.recommendation.schema import RecommendationResponse

async def search_and_recommend(tender_text: str, top_k_chunks: int = 15, top_k_standards: int = 5, min_threshold: float = 0.0) -> list[RecommendationResponse]:
    """
    Executes Semantic Search and LLM Reasoning.
    """
    # 1. Embed tender text
    tender_vector = generate_embedding(tender_text)
    
    # 2. Query ChromaDB
    collection = get_standards_collection()
    results = collection.query(
        query_embeddings=[tender_vector],
        n_results=top_k_chunks
    )
    
    if not results['ids'] or not results['ids'][0]:
        return []
        
    distances = results['distances'][0]
    metadatas = results['metadatas'][0]
    documents = results['documents'][0]
    
    # 3. Group by standard
    # standard_number -> list of dicts {"distance": d, "similarity": s, "text": doc, "title": title}
    grouped_chunks = defaultdict(list)
    
    for dist, meta, doc in zip(distances, metadatas, documents):
        standard_number = meta.get("standard_number")
        title = meta.get("title", "")
        if standard_number:
            # Interpret L2 distance as similarity score: 1 / (1 + distance)
            similarity = 1.0 / (1.0 + float(dist))
            grouped_chunks[standard_number].append({
                "distance": dist,
                "similarity": similarity,
                "text": doc,
                "title": title
            })
            
    # 4. Calculate standard-level relevance using average similarity of top 3 chunks for that standard
    standard_scores = []
    
    for std_num, chunks in grouped_chunks.items():
        # Sort chunks for this standard by similarity descending
        chunks.sort(key=lambda x: x["similarity"], reverse=True)
        top_n_chunks = chunks[:3]
        
        avg_similarity = sum(c["similarity"] for c in top_n_chunks) / len(top_n_chunks)
        
        # We only need the title from the best chunk
        title = top_n_chunks[0]["title"]
        
        if avg_similarity >= min_threshold:
            standard_scores.append({
                "standard_number": std_num,
                "title": title,
                "score": avg_similarity,
                "evidence": [c["text"] for c in top_n_chunks]
            })
            
    # Rank candidates by average similarity
    standard_scores.sort(key=lambda x: x["score"], reverse=True)
    
    # Keep top K candidates
    candidates = standard_scores[:top_k_standards]
    
    if not candidates:
        return []
        
    # 5. Generate LLM Reasoning
    llm = get_llm_provider()
    recommendations = []
    
    for candidate in candidates:
        evidence_text = "\n\n---\n\n".join(candidate["evidence"])
        prompt = RECOMMENDATION_REASON_PROMPT.format(
            tender_text=tender_text,
            standard_number=candidate["standard_number"],
            standard_title=candidate["title"],
            retrieved_evidence=evidence_text
        )
        
        try:
            # Expecting JSON response with "reason" key
            llm_response = await llm.generate(prompt=prompt, expect_json=True)
            response_data = json.loads(llm_response)
            reason = response_data.get("reason", "No reason provided.")
        except Exception as e:
            reason = f"Error generating reason: {str(e)}"
            
        recommendations.append(
            RecommendationResponse(
                standard_number=candidate["standard_number"],
                title=candidate["title"],
                relevance_score=round(candidate["score"], 4),
                reason=reason
            )
        )
        
    return recommendations
