from .config import LLM_PROVIDER, LLM_MODEL, LLM_API_KEY
from .base import LLMProvider

def get_llm_provider() -> LLMProvider:
    if LLM_PROVIDER == "groq":
        from .providers.groq_provider import GroqProvider
        if not LLM_MODEL:
            raise ValueError("LLM_MODEL environment variable must be set for Groq.")
        if not LLM_API_KEY:
            raise ValueError("LLM_API_KEY environment variable must be set for Groq.")
        return GroqProvider(api_key=LLM_API_KEY, model=LLM_MODEL)
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {LLM_PROVIDER}")
