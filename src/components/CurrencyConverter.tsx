import { useState, useEffect } from "react";
import { ArrowUpDown, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency, CURRENCIES } from "@/hooks/useCurrency";
import { Badge } from "@/components/ui/badge";

export const CurrencyConverter = () => {
  const { convertAmount, formatAmount, loading, error, lastUpdated } = useCurrency();
  
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount > 0) {
      const result = convertAmount(numAmount, fromCurrency, toCurrency);
      setConvertedAmount(result);
    } else {
      setConvertedAmount(0);
    }
  }, [amount, fromCurrency, toCurrency, convertAmount]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getExchangeRate = () => {
    const numAmount = parseFloat(amount) || 1;
    if (numAmount === 0) return 0;
    return convertedAmount / numAmount;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Currency Converter
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Live exchange rates</span>
          <Badge variant={error ? "destructive" : "secondary"}>
            {error ? "Offline" : `Updated ${formatLastUpdated(lastUpdated)}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <div className="flex gap-2">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              min="0"
              step="0.01"
              className="flex-1"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwapCurrencies}
            className="rounded-full w-10 h-10 p-0"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <div className="flex gap-2">
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 px-3 py-2 border rounded-md bg-muted/50 font-mono text-right">
              {formatAmount(convertedAmount, toCurrency)}
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        {parseFloat(amount) > 0 && (
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground text-center">
              1 {fromCurrency} = {getExchangeRate().toFixed(6)} {toCurrency}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded">
            {error}. Using cached rates if available.
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="text-sm text-muted-foreground text-center">
            Updating exchange rates...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
