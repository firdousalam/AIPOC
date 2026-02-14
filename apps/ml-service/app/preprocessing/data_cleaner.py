import pandas as pd
from typing import Dict

class DataCleaner:
    """Clean and preprocess data"""
    
    @staticmethod
    def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
        """Remove duplicate rows"""
        return df.drop_duplicates()
    
    @staticmethod
    def handle_missing_values(df: pd.DataFrame, strategy: str = "mean") -> pd.DataFrame:
        """Handle missing values"""
        if strategy == "mean":
            return df.fillna(df.mean())
        elif strategy == "median":
            return df.fillna(df.median())
        elif strategy == "drop":
            return df.dropna()
        return df
    
    @staticmethod
    def remove_outliers(df: pd.DataFrame, column: str) -> pd.DataFrame:
        """Remove outliers using IQR method"""
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        return df[(df[column] >= lower_bound) & (df[column] <= upper_bound)]
    
    def clean(self, df: pd.DataFrame, config: Dict = {}) -> pd.DataFrame:
        """Comprehensive data cleaning"""
        df = self.remove_duplicates(df)
        df = self.handle_missing_values(df, config.get("missing_strategy", "mean"))
        return df

