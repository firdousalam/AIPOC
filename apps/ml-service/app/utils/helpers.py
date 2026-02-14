from typing import List, Dict
import datetime

def generate_date_range(start_date: datetime.date, days: int) -> List[datetime.date]:
    """Generate a range of dates"""
    return [start_date + datetime.timedelta(days=i) for i in range(days)]

def format_confidence_intervals(predictions: List[float], confidence: float = 0.95) -> List[Dict]:
    """Format confidence intervals"""
    margin = (1 - confidence) / 2
    return [
        {
            "lower": pred * (1 - margin),
            "upper": pred * (1 + margin)
        }
        for pred in predictions
    ]

