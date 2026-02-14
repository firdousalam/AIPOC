SALES_ANALYSIS_PROMPT = """
Analyze the following sales data and provide insights:
- Total sales: {total_sales}
- Average sale: {average_sale}
- Number of transactions: {transaction_count}
- Time period: {time_period}

Please provide:
1. Key trends
2. Recommendations
3. Potential issues
"""

FORECAST_EXPLANATION_PROMPT = """
Explain the sales forecast for product {product_id}:
- Forecast period: {forecast_days} days
- Predicted sales: {predictions}
- Confidence intervals: {confidence_intervals}

Provide a clear explanation of what these predictions mean for the business.
"""

