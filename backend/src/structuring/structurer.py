import json
from .prompt import TENDER_STRUCTURING_PROMPT
from .schema import StructuredTender
from ..llm_gateway.gateway import get_llm_provider

async def structure_tender_document(cleaned_text: str) -> StructuredTender:
    """
    Takes cleaned text, queries the LLM Gateway, and validates the response against the Pydantic schema.
    """
    provider = get_llm_provider()
    
    # Format prompt
    prompt = TENDER_STRUCTURING_PROMPT.format(cleaned_text=cleaned_text)
    
    # Generate text
    llm_response = await provider.generate(prompt, expect_json=True)
    
    # Parse and validate JSON
    try:
        data = json.loads(llm_response)
        structured_data = StructuredTender(**data)
        return structured_data
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM returned invalid JSON: {e}\nResponse: {llm_response}")
    except Exception as e:
        raise ValueError(f"Failed to validate LLM response against schema: {e}\nResponse: {llm_response}")
