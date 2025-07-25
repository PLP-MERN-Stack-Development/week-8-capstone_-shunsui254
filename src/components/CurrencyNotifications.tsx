import { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";

interface CurrencyNotification {
  id: string;
  type: "rate_update" | "alert_triggered" | "conversion_info";
  title: string;
  message: string;
  timestamp: Date;
  dismissed: boolean;
  data?: any;
}

export const CurrencyNotifications = () => {
  const { currentCurrency, lastUpdated, error } = useCurrency();
  const [notifications, setNotifications] = useState<CurrencyNotification[]>([]);

  useEffect(() => {
    // Add notification when exchange rates are updated
    if (lastUpdated) {
      const newNotification: CurrencyNotification = {
        id: `rate_update_${Date.now()}`,
        type: "rate_update",
        title: "Exchange Rates Updated",
        message: `Latest rates for ${currentCurrency.code} have been fetched.`,
        timestamp: new Date(),
        dismissed: false,
        data: { currency: currentCurrency.code }
      };

      setNotifications(prev => {
        // Remove old rate update notifications for same currency
        const filtered = prev.filter(n => 
          !(n.type === "rate_update" && n.data?.currency === currentCurrency.code)
        );
        return [newNotification, ...filtered].slice(0, 5); // Keep only 5 notifications
      });
    }
  }, [lastUpdated, currentCurrency.code]);

  useEffect(() => {
    // Add notification when there's an error
    if (error) {
      const errorNotification: CurrencyNotification = {
        id: `error_${Date.now()}`,
        type: "alert_triggered",
        title: "Exchange Rate Error",
        message: "Using cached rates. Check your internet connection.",
        timestamp: new Date(),
        dismissed: false
      };

      setNotifications(prev => [errorNotification, ...prev].slice(0, 5));
    }
  }, [error]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, dismissed: true } : n)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "rate_update":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "alert_triggered":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "conversion_info":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const visibleNotifications = notifications.filter(n => !n.dismissed);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-80 space-y-2">
      {visibleNotifications.map((notification) => (
        <Card 
          key={notification.id}
          className="p-4 shadow-lg border-l-4 border-l-blue-500 animate-slide-in-right"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dismissNotification(notification.id)}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
