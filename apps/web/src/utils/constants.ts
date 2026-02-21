// Currency Configuration
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

// Format currency with symbol
export const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Format currency without decimals
export const formatCurrencyWhole = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`;
};
