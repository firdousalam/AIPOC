import os
from typing import Dict
from app.agentic_ai.llm_client import LLMClient

class SalesAIAgent:
    def __init__(self):
        self.llm_client = LLMClient()
    
    async def process_query(self, query: str, context: Dict = {}) -> Dict:
        """Process a query using agentic AI"""
        # Use open-source LLM (Ollama) for processing
        response = await self.llm_client.generate(
            prompt=query,
            context=context
        )
        
        return {
            "response": response,
            "reasoning": "Generated using open-source LLM model"
        }

