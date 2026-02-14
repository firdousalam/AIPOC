from typing import List, Dict
from app.inference.predictor import Predictor

class BatchPredictor:
    """Batch prediction for multiple products"""
    
    def __init__(self):
        self.predictor = Predictor()
    
    async def predict_batch(self, product_ids: List[str], forecast_days: int = 30) -> Dict:
        """Predict for multiple products"""
        results = {}
        for product_id in product_ids:
            result = await self.predictor.predict_sales(product_id, forecast_days)
            results[product_id] = result
        return results

