from .prompt import TENDER_NORMALIZATION_PROMPT
from ..structuring.schema import StructuredTender
from .schema import NormalizedTenderResponse
from ..llm_gateway.gateway import get_llm_provider

async def normalize_tender(structured_data: StructuredTender) -> NormalizedTenderResponse:
    """
    Takes a StructuredTender object and uses the LLM to normalize its textual data
    into a clean string representation suitable for embeddings.
    """
    provider = get_llm_provider()
    
    # Format prompt with the JSON representation of the input data
    input_json_str = structured_data.json()
    prompt = TENDER_NORMALIZATION_PROMPT.format(input_json=input_json_str)
    
    # Generate normalized text via LLM
    llm_response = await provider.generate(prompt)
    
    # Return as NormalizedTenderResponse
    return NormalizedTenderResponse(normalized_text=llm_response)
