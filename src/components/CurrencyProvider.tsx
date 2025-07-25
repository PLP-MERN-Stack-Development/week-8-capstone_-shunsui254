import { useState, useEffect, ReactNode } from "react";
import { CurrencyContext, Currency, CURRENCIES } from "@/hooks/useCurrency";
import { useExchangeRates } from "@/hooks/useExchangeRates";

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(CURRENCIES[0]); // Default to USD
  
  const {
    convertAmount,
    loading,
    error,
    lastUpdated,
    fetchExchangeRates
  } = useExchangeRates('USD'); // Use USD as base currency

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      const currency = CURRENCIES.find(c => c.code === savedCurrency);
      if (currency) {
        setCurrentCurrency(currency);
      }
    }
  }, []);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem("selectedCurrency", currency.code);
  };

  const formatAmount = (amount: number, currencyCode?: string) => {
    const targetCurrency = currencyCode 
      ? CURRENCIES.find(c => c.code === currencyCode) || currentCurrency
      : currentCurrency;
    
    return `${targetCurrency.symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getConvertedAmount = (amount: number, fromCurrency: string) => {
    return convertAmount(amount, fromCurrency, currentCurrency.code);
  };

  const refreshRates = () => {
    fetchExchangeRates();
  };

  return (
    <CurrencyContext.Provider value={{ 
      currentCurrency, 
      setCurrency, 
      formatAmount,
      convertAmount,
      getConvertedAmount,
      loading,
      error,
      lastUpdated,
      refreshRates
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};