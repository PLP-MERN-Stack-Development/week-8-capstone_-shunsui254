import { useState } from "react";
import { Target, Globe, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useCurrency";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  currency: string;
  period: "monthly" | "weekly" | "yearly";
}

export const MultiCurrencyBudgets = () => {
  const { formatAmount, getConvertedAmount, currentCurrency } = useCurrency();
  
  const [budgets] = useState<Budget[]>([
    {
      id: "1",
      category: "Food & Dining",
      limit: 500,
      spent: 320,
      currency: "USD",
      period: "monthly"
    },
    {
      id: "2",
      category: "Travel",
      limit: 1000,
      spent: 750,
      currency: "EUR",
      period: "monthly"
    },
    {
      id: "3",
      category: "Shopping",
      limit: 300,
      spent: 180,
      currency: "GBP",
      period: "monthly"
    }
  ]);

  const getTotalBudget = () => {
    return budgets.reduce((total, budget) => {
      const convertedLimit = getConvertedAmount(budget.limit, budget.currency);
      return total + convertedLimit;
    }, 0);
  };

  const getTotalSpent = () => {
    return budgets.reduce((total, budget) => {
      const convertedSpent = getConvertedAmount(budget.spent, budget.currency);
      return total + convertedSpent;
    }, 0);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Multi-Currency Budgets
        </CardTitle>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Budget Overview</span>
            <Badge variant="secondary" className="gap-1">
              <Globe className="h-3 w-3" />
              {currentCurrency.code}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>{formatAmount(getTotalSpent())} spent</span>
            <span>{formatAmount(getTotalBudget())} budget</span>
          </div>
          <Progress 
            value={(getTotalSpent() / getTotalBudget()) * 100} 
            className="mt-2"
          />
        </div>

        {/* Individual Budgets */}
        <div className="space-y-3">
          {budgets.map((budget) => {
            const convertedLimit = getConvertedAmount(budget.limit, budget.currency);
            const convertedSpent = getConvertedAmount(budget.spent, budget.currency);
            const percentage = (convertedSpent / convertedLimit) * 100;
            
            return (
              <div key={budget.id} className="p-4 rounded-lg border bg-card/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{budget.category}</h4>
                    <p className="text-xs text-muted-foreground">
                      Budget set in {budget.currency} • {budget.period}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={percentage > 100 ? "text-destructive" : ""}>
                      {formatAmount(convertedSpent)} spent
                    </span>
                    <span>{formatAmount(convertedLimit)} budget</span>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${percentage > 100 ? "bg-destructive/20" : ""}`}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {percentage > 100 
                        ? `${formatAmount(convertedSpent - convertedLimit)} over budget` 
                        : `${formatAmount(convertedLimit - convertedSpent)} remaining`
                      }
                    </span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
