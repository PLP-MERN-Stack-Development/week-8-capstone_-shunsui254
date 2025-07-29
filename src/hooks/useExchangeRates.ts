import { useState, useEffect, useCallback } from 'react';

export interface ExchangeRates {
  [currencyCode: string]: number;
}

export interface ExchangeRateData {
  rates: ExchangeRates;
  base: string;
  timestamp: number;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const STORAGE_KEY = 'exchange_rates_cache';

// Using a free exchange rate API - ExchangeRate-API
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export const useExchangeRates = (baseCurrency: string = 'USD') => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getCachedRates = useCallback((): ExchangeRateData | null => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const data: ExchangeRateData = JSON.parse(cached);
        const now = Date.now();
        if (now - data.timestamp < CACHE_DURATION && data.base === baseCurrency) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading cached exchange rates:', error);
    }
    return null;
  }, [baseCurrency]);

  const setCachedRates = (rates: ExchangeRates, base: string) => {
    try {
      const data: ExchangeRateData = {
        rates,
        base,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching exchange rates:', error);
    }
  };

  const fetchExchangeRates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = getCachedRates();
      if (cached) {
        setExchangeRates(cached.rates);
        setLastUpdated(new Date(cached.timestamp));
        setLoading(false);
        return;
      }

      // Fetch from API
      const response = await fetch(`${API_BASE_URL}/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.rates) {
        setExchangeRates(data.rates);
        setLastUpdated(new Date());
        setCachedRates(data.rates, baseCurrency);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');
      
      // Fallback to cached data even if expired
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const data: ExchangeRateData = JSON.parse(cached);
          if (data.base === baseCurrency) {
            setExchangeRates(data.rates);
            setLastUpdated(new Date(data.timestamp));
          }
        } catch (parseError) {
          console.error('Error parsing cached data:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // If converting from base currency
    if (fromCurrency === baseCurrency) {
      const rate = exchangeRates[toCurrency];
      return rate ? amount * rate : amount;
    }
    
    // If converting to base currency
    if (toCurrency === baseCurrency) {
      const rate = exchangeRates[fromCurrency];
      return rate ? amount / rate : amount;
    }
    
    // Converting between two non-base currencies
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    
    if (fromRate && toRate) {
      // Convert to base currency first, then to target currency
      const baseAmount = amount / fromRate;
      return baseAmount * toRate;
    }
    
    return amount; // Return original amount if rates not available
  };

  const getRate = (currencyCode: string): number => {
    return exchangeRates[currencyCode] || 1;
  };

  const isRateAvailable = (currencyCode: string): boolean => {
    return currencyCode === baseCurrency || currencyCode in exchangeRates;
  };

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  return {
    exchangeRates,
    loading,
    error,
    lastUpdated,
    fetchExchangeRates,
    convertAmount,
    getRate,
    isRateAvailable
  };
};
