import pytest
from app.inference.predictor import Predictor

@pytest.mark.asyncio
async def test_predict_sales():
    """Test sales prediction"""
    predictor = Predictor()
    result = await predictor.predict_sales("test-product", 30)
    assert "predictions" in result
    assert len(result["predictions"]) == 30

