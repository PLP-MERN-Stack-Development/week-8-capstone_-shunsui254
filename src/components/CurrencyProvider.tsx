import { useState, useEffect, ReactNode } from "react";
import { CurrencyContext, Currency, CURRENCIES } from "@/hooks/useCurrency";

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(CURRENCIES[0]); // Default to USD

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

  const formatAmount = (amount: number) => {
    return `${currentCurrency.symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};