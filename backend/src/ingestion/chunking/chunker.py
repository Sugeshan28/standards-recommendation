import re

def chunk_text(text: str) -> list[str]:
    """
    Splits the text by double newlines to preserve section and paragraph boundaries.
    Ignores empty chunks.
    """
    if not text:
        return []
    
    # Split by double newlines or more
    raw_chunks = re.split(r'\n\s*\n', text)
    
    chunks = []
    for chunk in raw_chunks:
        clean_chunk = chunk.strip()
        if clean_chunk:
            chunks.append(clean_chunk)
            
    return chunks
