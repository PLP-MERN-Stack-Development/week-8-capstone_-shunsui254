import { ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
}

const recentTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 3200,
    description: "Salary Payment",
    category: "Work",
    date: "2024-01-15",
  },
  {
    id: "2",
    type: "expense",
    amount: 45.50,
    description: "Grocery Shopping",
    category: "Food & Dining",
    date: "2024-01-14",
  },
  {
    id: "3",
    type: "expense",
    amount: 120,
    description: "Gas Station",
    category: "Transportation",
    date: "2024-01-13",
  },
  {
    id: "4",
    type: "expense",
    amount: 25.99,
    description: "Netflix Subscription",
    category: "Entertainment",
    date: "2024-01-12",
  },
  {
    id: "5",
    type: "income",
    amount: 150,
    description: "Freelance Work",
    category: "Side Income",
    date: "2024-01-11",
  },
];

export const RecentTransactions = () => {
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
          {recentTransactions.map((transaction, index) => (
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
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};