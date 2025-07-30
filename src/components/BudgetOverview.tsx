import { useState } from "react";
import { Plus, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { isDemoAccount, isNewUser } from "@/lib/userUtils";

interface Budget {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  color: string;
}

const mockBudgets: Budget[] = [
  {
    id: "1",
    category: "Food & Dining",
    budgeted: 600,
    spent: 445.50,
    color: "hsl(210 100% 45%)",
  },
  {
    id: "2",
    category: "Transportation",
    budgeted: 300,
    spent: 185.75,
    color: "hsl(145 65% 45%)",
  },
  {
    id: "3",
    category: "Entertainment",
    budgeted: 200,
    spent: 89.99,
    color: "hsl(35 90% 55%)",
  },
  {
    id: "4",
    category: "Shopping",
    budgeted: 400,
    spent: 321.25,
    color: "hsl(265 60% 50%)",
  },
  {
    id: "5",
    category: "Bills & Utilities",
    budgeted: 800,
    spent: 750.00,
    color: "hsl(0 85% 60%)",
  },
];

export const BudgetOverview = () => {
  const [budgets] = useState(mockBudgets);
  const demoUser = isDemoAccount();
  const newUser = isNewUser();

  // Only show demo data for demo accounts, new users get empty state
  const shouldShowData = demoUser && !newUser;
  const displayBudgets = shouldShowData ? budgets : [];

  const totalBudgeted = displayBudgets.reduce((sum, budget) => sum + budget.budgeted, 0);
  const totalSpent = displayBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remaining = totalBudgeted - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
          <p className="text-muted-foreground">Track your spending against your budget goals</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {/* Budget Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-counter">${totalBudgeted.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-counter">${totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <div className={`h-4 w-4 rounded-full ${remaining >= 0 ? 'bg-success' : 'bg-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold animate-counter ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(remaining).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {displayBudgets.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Budgets Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first budget to start tracking your spending goals.
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Budget
                </Button>
              </div>
            ) : (
              displayBudgets.map((budget, index) => {
                const percentage = (budget.spent / budget.budgeted) * 100;
                const remaining = budget.budgeted - budget.spent;
                const isOverBudget = percentage > 100;

                return (
                  <div
                    key={budget.id}
                    className="space-y-3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: budget.color }}
                        />
                        <span className="font-medium">{budget.category}</span>
                        {isOverBudget && (
                          <Badge variant="destructive" className="text-xs">Over Budget</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                      </div>
                    </div>
                    
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between text-sm">
                      <span className={`${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className={`${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
                        ${Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'remaining' : 'over'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};