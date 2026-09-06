import os
from pathlib import Path
import chromadb
from chromadb.config import Settings

# Persistent data outside src as requested
DB_PATH = Path(__file__).parent.parent.parent.parent / "backend" / "db" / "chroma_storage"

# Create the directory if it doesn't exist
os.makedirs(DB_PATH, exist_ok=True)

# Initialize ChromaDB Persistent Client
client = chromadb.PersistentClient(
    path=str(DB_PATH),
    settings=Settings(anonymized_telemetry=False)
)

def get_standards_collection():
    """
    Returns the standards_collection, creating it if it doesn't exist.
    """
    collection = client.get_or_create_collection(name="standards_collection")
    return collection
