from typing import Dict
from app.models.prophet_model import ProphetModel
from app.models.xgboost_model import XGBoostModel
from app.models.lstm_model import LSTMModel

class Trainer:
    """Trainer class for ML models"""
    
    def __init__(self):
        self.models = {
            "prophet": ProphetModel(),
            "xgboost": XGBoostModel(),
            "lstm": LSTMModel(),
        }
    
    async def train_model(self, model_type: str, data_path: str = None) -> Dict:
        """Train a specific model type"""
        if model_type not in self.models:
            raise ValueError(f"Unknown model type: {model_type}")
        
        model = self.models[model_type]
        # Load data from data_path if provided
        data = {"data_path": data_path} if data_path else {}
        
        result = model.train(data)
        
        return {
            "accuracy": result.get("accuracy", 0.0),
            "model_path": f"./saved_models/{model_type}_model.pkl"
        }

