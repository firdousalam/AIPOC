import pandas as pd
from typing import List

class FeatureEngineer:
    """Feature engineering for ML models"""
    
    @staticmethod
    def create_date_features(df: pd.DataFrame, date_column: str) -> pd.DataFrame:
        """Create date-based features"""
        df[date_column] = pd.to_datetime(df[date_column])
        df['year'] = df[date_column].dt.year
        df['month'] = df[date_column].dt.month
        df['day'] = df[date_column].dt.day
        df['day_of_week'] = df[date_column].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        return df
    
    @staticmethod
    def create_lag_features(df: pd.DataFrame, column: str, lags: List[int]) -> pd.DataFrame:
        """Create lag features"""
        for lag in lags:
            df[f'{column}_lag_{lag}'] = df[column].shift(lag)
        return df
    
    @staticmethod
    def create_rolling_features(df: pd.DataFrame, column: str, windows: List[int]) -> pd.DataFrame:
        """Create rolling window features"""
        for window in windows:
            df[f'{column}_rolling_mean_{window}'] = df[column].rolling(window=window).mean()
            df[f'{column}_rolling_std_{window}'] = df[column].rolling(window=window).std()
        return df

