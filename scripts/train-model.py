#!/usr/bin/env python3
"""
Script to train ML models for sales forecasting
"""

import sys
import os

# Add the ml-service to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../apps/ml-service'))

from app.training.trainer import Trainer
import asyncio

async def main():
    trainer = Trainer()
    
    print("Training Prophet model...")
    result = await trainer.train_model("prophet")
    print(f"✅ Prophet model trained - Accuracy: {result.get('accuracy', 0)}")
    
    print("Training XGBoost model...")
    result = await trainer.train_model("xgboost")
    print(f"✅ XGBoost model trained - Accuracy: {result.get('accuracy', 0)}")
    
    print("✅ All models trained successfully!")

if __name__ == "__main__":
    asyncio.run(main())

