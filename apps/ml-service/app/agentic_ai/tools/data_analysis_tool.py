import pandas as pd
from typing import Dict

class DataAnalysisTool:
    """Tool for analyzing sales data"""
    
    @staticmethod
    def analyze_sales_trends(data: pd.DataFrame) -> Dict:
        """Analyze sales trends"""
        return {
            "total_sales": data["totalAmount"].sum(),
            "average_sale": data["totalAmount"].mean(),
            "transaction_count": len(data),
            "trend": "increasing" if data["totalAmount"].iloc[-1] > data["totalAmount"].iloc[0] else "decreasing"
        }

