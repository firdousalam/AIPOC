from sklearn.preprocessing import StandardScaler, MinMaxScaler
from typing import Dict
import numpy as np

class Scaler:
    """Scale features for ML models"""
    
    def __init__(self, method: str = "standard"):
        if method == "standard":
            self.scaler = StandardScaler()
        elif method == "minmax":
            self.scaler = MinMaxScaler()
        else:
            raise ValueError(f"Unknown scaling method: {method}")
    
    def fit_transform(self, data: np.ndarray) -> np.ndarray:
        """Fit and transform data"""
        return self.scaler.fit_transform(data)
    
    def transform(self, data: np.ndarray) -> np.ndarray:
        """Transform data using fitted scaler"""
        return self.scaler.transform(data)
    
    def inverse_transform(self, data: np.ndarray) -> np.ndarray:
        """Inverse transform data"""
        return self.scaler.inverse_transform(data)

