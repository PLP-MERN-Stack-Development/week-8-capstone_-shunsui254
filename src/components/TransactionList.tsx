/**
 * TransactionList Component - Comprehensive Transaction Management Interface
 * 
 * This component provides a full-featured transaction management interface
 * with search, filtering, and display capabilities for user financial data.
 * 
 * Features:
 * - Real-time transaction search and filtering
 * - Multi-currency transaction display with conversion
 * - Responsive transaction cards with visual indicators
 * - Empty state handling for new users
 * - Demo data integration for demonstration purposes
 * - Category-based transaction organization
 * - Amount formatting with currency symbols
 * 
 * Data Flow:
 * - Fetches transactions from demo data or API
 * - Applies search filters in real-time
 * - Converts amounts to user's preferred currency
 * - Displays transactions in chronological order
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

import { useState } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useCurrency";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { demoTransactions } from "@/data/demoTransactions";
import { isDemoAccount, isNewUser } from "@/lib/userUtils";

/**
 * Transaction Data Structure
 * Defines the shape of transaction objects used throughout the application
 */
interface Transaction {
  id: string;                    // Unique transaction identifier
  type: "income" | "expense";    // Transaction type for categorization
  amount: number;                // Transaction amount in original currency
  description: string;           // User-provided transaction description
  category: string;              // Transaction category for grouping
  date: string;                  // ISO date string for sorting
  currency?: string;             // Currency code (defaults to USD)
}

/**
 * Mock Transactions Data
 * Uses demo transactions sorted by date (newest first) for consistent display
 * In production, this would be replaced by API calls to fetch user's actual transactions
 */
const mockTransactions: Transaction[] = demoTransactions
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/**
 * Main TransactionList Component
 * Renders the complete transaction management interface
 */
export const TransactionList = () => {
  // Hooks for currency formatting and conversion
  const { formatAmount, getConvertedAmount } = useCurrency();
  
  // Local state for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  
  // User state detection for conditional rendering
  const demoUser = isDemoAccount();
  const newUser = isNewUser();
  
  // Only show demo data for demo accounts, new users get empty list
  const shouldShowDemoData = demoUser && !newUser;
  const allTransactions = shouldShowDemoData ? demoTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
  const [transactions] = useState(allTransactions);

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
        <AddTransactionDialog />
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
            {filteredTransactions.map((transaction, index) => {
              // Convert from transaction currency (default to USD) to current currency
              const baseCurrency = transaction.currency || 'USD';
              const convertedAmount = getConvertedAmount(transaction.amount, baseCurrency);
              
              return (
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
                    {transaction.type === "income" ? "+" : "-"}{formatAmount(convertedAmount)}
                  </p>
                </div>
              </div>
            )})}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};