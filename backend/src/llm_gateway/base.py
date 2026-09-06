from abc import ABC, abstractmethod

class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, expect_json: bool = False) -> str:
        """
        Sends a prompt to the LLM and returns the generated text response.
        If expect_json is True, the provider may enforce a JSON response format.
        """
        pass
