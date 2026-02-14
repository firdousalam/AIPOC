import pytest
from app.training.trainer import Trainer

@pytest.mark.asyncio
async def test_train_model():
    """Test model training"""
    trainer = Trainer()
    result = await trainer.train_model("prophet")
    assert "accuracy" in result

