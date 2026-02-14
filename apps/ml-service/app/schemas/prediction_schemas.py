from pydantic import BaseModel
from typing import List, Dict

class PredictionRequest(BaseModel):
    product_id: str
    forecast_days: int = 30

class PredictionResponse(BaseModel):
    product_id: str
    forecast_days: int
    predictions: List[float]
    confidence_intervals: List[Dict[str, float]] = []

