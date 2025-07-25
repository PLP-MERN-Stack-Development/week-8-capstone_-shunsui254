import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useCurrency";

interface RateHistory {
  date: string;
  rate: number;
  change: number;
  changePercent: number;
}

export const CurrencyRateHistory = () => {
  const { currentCurrency } = useCurrency();
  const [history, setHistory] = useState<RateHistory[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, fetch from historical rates API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockHistory: RateHistory[] = [
        { date: "2025-07-25", rate: 1.0850, change: 0.0025, changePercent: 0.23 },
        { date: "2025-07-24", rate: 1.0825, change: -0.0015, changePercent: -0.14 },
        { date: "2025-07-23", rate: 1.0840, change: 0.0035, changePercent: 0.32 },
        { date: "2025-07-22", rate: 1.0805, change: -0.0020, changePercent: -0.18 },
        { date: "2025-07-21", rate: 1.0825, change: 0.0010, changePercent: 0.09 },
      ];
      setHistory(mockHistory);
      setLoading(false);
    }, 1000);
  }, [currentCurrency]);

  if (currentCurrency.code === 'USD') {
    return null; // Don't show for base currency
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          USD to {currentCurrency.code} - 5 Day History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading rate history...</div>
        ) : (
          <div className="space-y-3">
            {history.map((day, index) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
              >
                <div>
                  <p className="font-medium">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    1 USD = {day.rate.toFixed(4)} {currentCurrency.code}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={day.change >= 0 ? "default" : "destructive"}
                    className="gap-1"
                  >
                    {day.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {day.changePercent >= 0 ? "+" : ""}{day.changePercent.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
