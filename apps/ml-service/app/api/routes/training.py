from fastapi import APIRouter, HTTPException
from app.schemas.training_schemas import TrainingRequest, TrainingResponse
from app.training.trainer import Trainer

router = APIRouter()
trainer = Trainer()

@router.post("/train", response_model=TrainingResponse)
async def train_model(request: TrainingRequest):
    try:
        result = await trainer.train_model(
            model_type=request.model_type,
            data_path=request.data_path
        )
        return TrainingResponse(
            model_type=request.model_type,
            status="completed",
            accuracy=result.get("accuracy"),
            model_path=result.get("model_path")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

