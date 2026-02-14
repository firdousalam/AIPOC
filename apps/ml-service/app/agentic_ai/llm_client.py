import httpx
import os
from typing import Dict, Optional

class LLMClient:
    def __init__(self):
        self.base_url = os.getenv("AI_MODEL_URL", "http://localhost:11434")
        self.model_name = os.getenv("AI_MODEL_NAME", "llama2")
    
    async def generate(self, prompt: str, context: Dict = {}) -> str:
        """Generate response using open-source LLM"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model_name,
                        "prompt": prompt,
                        "stream": False
                    },
                    timeout=60.0
                )
                if response.status_code == 200:
                    return response.json().get("response", "No response generated")
                else:
                    return "Error generating response"
        except Exception as e:
            return f"Error connecting to AI model: {str(e)}"

