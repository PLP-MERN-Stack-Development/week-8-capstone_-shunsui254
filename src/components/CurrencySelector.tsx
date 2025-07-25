import { Check, DollarSign, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCurrency, CURRENCIES } from "@/hooks/useCurrency";
import { Badge } from "@/components/ui/badge";

export const CurrencySelector = () => {
  const { 
    currentCurrency, 
    setCurrency, 
    loading, 
    error, 
    lastUpdated, 
    refreshRates 
  } = useCurrency();

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative">
          <DollarSign className="h-4 w-4" />
          {currentCurrency.code}
          {loading && <RefreshCw className="h-3 w-3 animate-spin ml-1" />}
          {error && <AlertCircle className="h-3 w-3 text-destructive ml-1" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Exchange Rates</span>
            <Badge variant={error ? "destructive" : "secondary"} className="text-xs">
              {error ? "Offline" : "Live"}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Updated: {formatLastUpdated(lastUpdated)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                refreshRates();
              }}
              disabled={loading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        {CURRENCIES.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrency(currency)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{currency.symbol}</span>
              <div>
                <p className="font-medium">{currency.code}</p>
                <p className="text-xs text-muted-foreground">{currency.name}</p>
              </div>
            </div>
            {currentCurrency.code === currency.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        {error && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              {error}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};