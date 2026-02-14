import pytest
from app.models.prophet_model import ProphetModel

def test_prophet_model():
    """Test Prophet model"""
    model = ProphetModel()
    result = model.train({})
    assert result["status"] == "trained"

