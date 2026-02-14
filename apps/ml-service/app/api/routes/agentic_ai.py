from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agentic_ai.agent import SalesAIAgent

router = APIRouter()
agent = SalesAIAgent()

class AIRequest(BaseModel):
    query: str
    context: dict = {}

class AIResponse(BaseModel):
    response: str
    reasoning: str = ""

@router.post("/query", response_model=AIResponse)
async def query_ai(request: AIRequest):
    try:
        result = await agent.process_query(request.query, request.context)
        return AIResponse(
            response=result["response"],
            reasoning=result.get("reasoning", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

