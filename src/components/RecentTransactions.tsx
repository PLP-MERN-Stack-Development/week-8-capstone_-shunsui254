import { ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useCurrency";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
  currency?: string; // Default to USD if not specified
}

const recentTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 3200,
    description: "Freelance Web Development",
    category: "Work",
    date: "2025-07-25",
  },
  {
    id: "2",
    type: "expense",
    amount: 45.50,
    description: "Coffee & Lunch - Dev Session",
    category: "Food & Dining",
    date: "2025-07-24",
  },
  {
    id: "3",
    type: "expense",
    amount: 120,
    description: "GitHub Copilot Pro Subscription",
    category: "Software & Tools",
    date: "2025-07-23",
  },
  {
    id: "4",
    type: "expense",
    amount: 25.99,
    description: "Spotify Premium",
    category: "Entertainment",
    date: "2025-07-22",
  },
  {
    id: "5",
    type: "income",
    amount: 150,
    description: "Code Review & Consultation",
    category: "Side Income",
    date: "2025-07-21",
  },
];

export const RecentTransactions = () => {
  const { formatAmount, getConvertedAmount } = useCurrency();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction, index) => {
            // Convert from transaction currency (default to USD) to current currency
            const baseCurrency = transaction.currency || 'USD';
            const convertedAmount = getConvertedAmount(transaction.amount, baseCurrency);
            
            return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === "income" 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === "income" ? "text-success" : "text-destructive"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}{formatAmount(convertedAmount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )})}
        </div>
      </CardContent>
    </Card>
  );
};