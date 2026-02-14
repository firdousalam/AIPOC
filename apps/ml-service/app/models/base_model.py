from abc import ABC, abstractmethod
from typing import Dict, List

class BaseModel(ABC):
    """Base class for all ML models"""
    
    @abstractmethod
    def train(self, data: Dict) -> Dict:
        """Train the model"""
        pass
    
    @abstractmethod
    def predict(self, data: Dict) -> List[float]:
        """Make predictions"""
        pass
    
    @abstractmethod
    def save(self, path: str) -> None:
        """Save the model"""
        pass
    
    @abstractmethod
    def load(self, path: str) -> None:
        """Load the model"""
        pass

