import { ArrowUpRight, ArrowDownLeft, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useCurrency";
import { isNewUser, isDemoAccount } from "@/lib/userUtils";
import { demoTransactions } from "@/data/demoTransactions";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
  currency?: string; // Default to USD if not specified
}

// Get the most recent 5 transactions from the demo data
const recentTransactions: Transaction[] = demoTransactions
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

export const RecentTransactions = () => {
  const { formatAmount, getConvertedAmount } = useCurrency();
  const newUser = isNewUser();
  const demoUser = isDemoAccount();
  
  // Only show demo data for demo accounts, new users get empty list
  const shouldShowDemoData = demoUser && !newUser;
  const transactionsToShow = shouldShowDemoData ? recentTransactions : [];
  
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
        {transactionsToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start tracking your finances by adding your first transaction
            </p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactionsToShow.map((transaction, index) => {
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
        )}
      </CardContent>
    </Card>
  );
};