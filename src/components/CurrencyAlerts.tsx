import { useState, useEffect } from "react";
import { Bell, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/hooks/useCurrency";

interface CurrencyAlert {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  threshold: number;
  type: "above" | "below";
  isActive: boolean;
  triggered: boolean;
  currentRate?: number;
}

export const CurrencyAlerts = () => {
  const { currentCurrency, convertAmount } = useCurrency();
  const [alerts, setAlerts] = useState<CurrencyAlert[]>([
    {
      id: "1",
      fromCurrency: "USD",
      toCurrency: "EUR", 
      threshold: 0.85,
      type: "below",
      isActive: true,
      triggered: false,
      currentRate: 0.8742
    },
    {
      id: "2",
      fromCurrency: "GBP",
      toCurrency: "USD",
      threshold: 1.30,
      type: "above", 
      isActive: true,
      triggered: true,
      currentRate: 1.3156
    },
    {
      id: "3",
      fromCurrency: "USD",
      toCurrency: "JPY",
      threshold: 150,
      type: "above",
      isActive: false,
      triggered: false,
      currentRate: 148.25
    }
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const getAlertIcon = (alert: CurrencyAlert) => {
    if (alert.triggered) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return alert.type === "above" ? 
      <TrendingUp className="h-4 w-4 text-blue-500" /> : 
      <TrendingDown className="h-4 w-4 text-purple-500" />;
  };

  const getAlertStatus = (alert: CurrencyAlert) => {
    if (!alert.isActive) return "Inactive";
    if (alert.triggered) return "Triggered";
    return "Active";
  };

  const getAlertVariant = (alert: CurrencyAlert): "default" | "secondary" | "destructive" => {
    if (!alert.isActive) return "secondary";
    if (alert.triggered) return "destructive";
    return "default";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Currency Rate Alerts
        </CardTitle>
        <Button size="sm" variant="outline">
          + Add Alert
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-4 rounded-lg border transition-colors ${
              alert.triggered ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800" : "bg-card/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getAlertIcon(alert)}
                <div>
                  <p className="font-medium">
                    {alert.fromCurrency} → {alert.toCurrency}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Alert when rate goes {alert.type} {alert.threshold.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getAlertVariant(alert)}>
                  {getAlertStatus(alert)}
                </Badge>
                <Switch 
                  checked={alert.isActive}
                  onCheckedChange={() => toggleAlert(alert.id)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Rate:</span>
              <span className={`font-mono ${alert.triggered ? "text-amber-600 dark:text-amber-400" : ""}`}>
                {alert.currentRate?.toFixed(4) || "Loading..."}
              </span>
            </div>
            
            {alert.triggered && (
              <div className="mt-2 p-2 rounded bg-amber-100 dark:bg-amber-900/30">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  🔔 Alert triggered! Rate is now {alert.type} your threshold.
                </p>
              </div>
            )}
          </div>
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No currency alerts set up yet.</p>
            <p className="text-xs">Get notified when exchange rates hit your targets.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
