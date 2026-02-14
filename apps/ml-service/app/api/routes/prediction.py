from fastapi import APIRouter, HTTPException
from app.schemas.prediction_schemas import PredictionRequest, PredictionResponse
from app.inference.predictor import Predictor

router = APIRouter()
predictor = Predictor()

@router.post("/forecast", response_model=PredictionResponse)
async def forecast_sales(request: PredictionRequest):
    try:
        result = await predictor.predict_sales(
            product_id=request.product_id,
            forecast_days=request.forecast_days
        )
        return PredictionResponse(
            product_id=request.product_id,
            forecast_days=request.forecast_days,
            predictions=result["predictions"],
            confidence_intervals=result.get("confidence_intervals", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

