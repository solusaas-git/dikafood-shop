import React, { createContext, useContext } from 'react';

// Define available currencies
const currencies = {
  MAD: {
    code: 'MAD',
    symbol: 'DH',
    name: 'Moroccan Dirham',
    format: (value) => `${value.toFixed(2)} ${currencies.MAD.symbol}`
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    format: (value) => `${currencies.USD.symbol}${value.toFixed(2)}`
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    format: (value) => `${value.toFixed(2)} ${currencies.EUR.symbol}`
  }
};

// Create the context with MAD as default
export const CurrencyContext = createContext({
  currency: currencies.MAD,
  formatPrice: (price) => currencies.MAD.format(price)
});

/**
 * CurrencyProvider component that wraps the application to provide currency information
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export const CurrencyProvider = ({ children }) => {
  // Since we're not allowing currency changes, we use a fixed currency (MAD)
  const currency = currencies.MAD;

  /**
   * Format a price according to the current currency settings
   *
   * @param {number} price - The price to format
   * @return {string} - Formatted price string
   */
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return 'N/A';
    }
    return currency.format(price);
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

/**
 * Hook to use the currency context in components
 *
 * @returns {Object} - Currency context value
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyProvider;