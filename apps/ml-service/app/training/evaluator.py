from typing import Dict, List
import numpy as np

class Evaluator:
    """Evaluate model performance"""
    
    @staticmethod
    def calculate_mae(y_true: List[float], y_pred: List[float]) -> float:
        """Calculate Mean Absolute Error"""
        return np.mean(np.abs(np.array(y_true) - np.array(y_pred)))
    
    @staticmethod
    def calculate_rmse(y_true: List[float], y_pred: List[float]) -> float:
        """Calculate Root Mean Squared Error"""
        return np.sqrt(np.mean((np.array(y_true) - np.array(y_pred)) ** 2))
    
    @staticmethod
    def calculate_r2(y_true: List[float], y_pred: List[float]) -> float:
        """Calculate R-squared"""
        y_true_arr = np.array(y_true)
        y_pred_arr = np.array(y_pred)
        ss_res = np.sum((y_true_arr - y_pred_arr) ** 2)
        ss_tot = np.sum((y_true_arr - np.mean(y_true_arr)) ** 2)
        return 1 - (ss_res / ss_tot) if ss_tot != 0 else 0.0
    
    def evaluate(self, y_true: List[float], y_pred: List[float]) -> Dict:
        """Comprehensive evaluation"""
        return {
            "mae": self.calculate_mae(y_true, y_pred),
            "rmse": self.calculate_rmse(y_true, y_pred),
            "r2": self.calculate_r2(y_true, y_pred),
        }

