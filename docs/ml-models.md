# ML Models Documentation

## Supported Models

### 1. Prophet
- **Type**: Time series forecasting
- **Use Case**: Long-term sales trends
- **Best For**: Seasonal patterns, trend analysis

### 2. XGBoost
- **Type**: Gradient boosting
- **Use Case**: Feature-based predictions
- **Best For**: Complex feature relationships

### 3. LSTM
- **Type**: Deep learning (RNN)
- **Use Case**: Sequential pattern recognition
- **Best For**: Complex temporal dependencies

## Training

Models can be trained via:
1. API endpoint: `POST /api/v1/training/train`
2. Script: `python scripts/train-model.py`

## Model Storage

Trained models are stored in:
- `apps/ml-service/saved_models/`
- Format: `{model_type}_model.pkl` or `.h5`

## Prediction Flow

1. Receive prediction request
2. Load appropriate model
3. Preprocess input data
4. Generate predictions
5. Calculate confidence intervals
6. Return results

## Agentic AI Integration

The system uses Ollama for:
- Natural language queries
- Sales insights generation
- Forecast explanations
- Business recommendations

### Setup Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull model
ollama pull llama2

# Start server
ollama serve
```

## Model Evaluation

Metrics used:
- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)
- R² (R-squared)

