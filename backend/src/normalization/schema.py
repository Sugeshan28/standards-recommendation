from pydantic import BaseModel

class NormalizedTenderResponse(BaseModel):
    normalized_text: str
