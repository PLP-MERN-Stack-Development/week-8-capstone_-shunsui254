/**
 * Currency Management Hook - Multi-Currency Support System
 * 
 * This module provides comprehensive currency management functionality for
 * MyBudgeteer, including currency conversion, formatting, and real-time
 * exchange rate management.
 * 
 * Features:
 * - Support for 12+ major global currencies
 * - Real-time exchange rate conversion
 * - Localized currency formatting with proper symbols
 * - Context-based currency state management
 * - Error handling for conversion operations
 * - Caching and refresh capabilities for exchange rates
 * 
 * Usage:
 * - Wrap app with CurrencyProvider
 * - Use useCurrency() hook in components
 * - Access formatting and conversion functions
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

import { createContext, useContext } from "react";

/**
 * Currency Data Structure
 * Defines the shape of currency objects used throughout the application
 */
export interface Currency {
  code: string;    // ISO 4217 currency code (e.g., 'USD', 'EUR')
  symbol: string;  // Currency symbol for display (e.g., '$', '€')
  name: string;    // Full currency name for user selection
}

/**
 * Supported Currencies Configuration
 * Comprehensive list of currencies supported by MyBudgeteer
 * Includes major global currencies with proper symbols and names
 */
export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },           // Primary international currency
  { code: "EUR", symbol: "€", name: "Euro" },               // European Union currency
  { code: "GBP", symbol: "£", name: "British Pound" },      // United Kingdom currency
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },       // Japanese currency
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },   // Canadian currency  
  { code: "AUD", symbol: "A$", name: "Australian Dollar" }, // Australian currency
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },      // Swiss currency
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },       // Chinese currency
  { code: "INR", symbol: "₹", name: "Indian Rupee" },       // Indian currency
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },  // Kenyan currency
  { code: "ZAR", symbol: "R", name: "South African Rand" }, // South African currency
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },     // Nigerian currency
];

/**
 * Currency Context Interface
 * Defines the shape of the currency context for type safety
 */
export interface CurrencyContextType {
  currentCurrency: Currency;     // Currently selected user currency
  setCurrency: (currency: Currency) => void;  // Currency selection function
  formatAmount: (amount: number, currencyCode?: string) => string;  // Display formatting
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;  // Currency conversion
  getConvertedAmount: (amount: number, fromCurrency: string) => number;  // Quick conversion to current currency
  loading: boolean;              // Exchange rate loading state
  error: string | null;          // Error state for failed operations
  lastUpdated: Date | null;      // Timestamp of last exchange rate update
  refreshRates: () => void;      // Manual refresh function for exchange rates
}

/**
 * Currency Context Creation
 * Creates the React context for currency state management
 */
export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

/**
 * Currency Hook
 * Custom hook for accessing currency context in components
 * 
 * @returns CurrencyContextType - Complete currency management interface
 * @throws Error - If used outside of CurrencyProvider
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};