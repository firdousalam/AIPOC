from typing import Dict, List
from app.inference.predictor import Predictor

class ForecastTool:
    """Tool for generating forecasts"""
    
    def __init__(self):
        self.predictor = Predictor()
    
    async def generate_forecast(self, product_id: str, days: int = 30) -> Dict:
        """Generate sales forecast"""
        return await self.predictor.predict_sales(product_id, days)

