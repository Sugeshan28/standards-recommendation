from groq import AsyncGroq
from ..base import LLMProvider

class GroqProvider(LLMProvider):
    def __init__(self, api_key: str, model: str):
        self.client = AsyncGroq(api_key=api_key)
        self.model = model

    async def generate(self, prompt: str, expect_json: bool = False) -> str:
        kwargs = {
            "messages": [{"role": "user", "content": prompt}],
            "model": self.model,
            "temperature": 0,
        }
        if expect_json:
            kwargs["response_format"] = {"type": "json_object"}
            
        response = await self.client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
