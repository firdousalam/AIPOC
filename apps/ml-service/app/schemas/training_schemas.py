from pydantic import BaseModel
from typing import Optional

class TrainingRequest(BaseModel):
    model_type: str  # "prophet", "xgboost", "lstm"
    data_path: Optional[str] = None

class TrainingResponse(BaseModel):
    model_type: str
    status: str
    accuracy: Optional[float] = None
    model_path: Optional[str] = None

