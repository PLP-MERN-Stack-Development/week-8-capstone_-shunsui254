import { useState } from "react";
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useCurrency";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
}

const mockTransactions: Transaction[] = [
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
  {
    id: "6",
    type: "expense",
    amount: 89.99,
    description: "Restaurant Dinner",
    category: "Food & Dining",
    date: "2024-01-10",
  },
];

export const TransactionList = () => {
  const { formatAmount } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions] = useState(mockTransactions);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Manage your income and expenses</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === "income" 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{transaction.description}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.type === "income" ? "text-success" : "text-destructive"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}{formatAmount(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};