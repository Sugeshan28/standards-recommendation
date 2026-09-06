from sentence_transformers import SentenceTransformer

# Load the model once at startup to avoid reloading it on every request
_model = None

def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def generate_embedding(text: str) -> list[float]:
    """
    Generates a 384-dimensional embedding vector for the given text.
    """
    if not text or not text.strip():
        raise ValueError("Cannot generate embedding for empty text.")
    
    model = get_embedding_model()
    # encode() returns a numpy array, we convert it to a python list of floats
    embedding_vector = model.encode(text).tolist()
    return embedding_vector
