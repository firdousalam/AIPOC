from typing import Any

def validate_product_id(product_id: str) -> bool:
    """Validate product ID format"""
    return isinstance(product_id, str) and len(product_id) > 0

def validate_forecast_days(days: int) -> bool:
    """Validate forecast days"""
    return isinstance(days, int) and 1 <= days <= 365

