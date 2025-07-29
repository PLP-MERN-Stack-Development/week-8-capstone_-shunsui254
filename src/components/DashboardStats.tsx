import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";
import { isNewUser } from "@/lib/userUtils";
import { demoTransactions } from "@/data/demoTransactions";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, trend, icon, color }: StatCardProps) => (
  <Card className="hover:shadow-card transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold animate-counter">{value}</div>
      <div className="flex items-center mt-1">
        {trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-success mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive mr-1" />
        )}
        <span className={`text-sm ${trend === "up" ? "text-success" : "text-destructive"}`}>
          {change} from last month
        </span>
      </div>
    </CardContent>
  </Card>
);

// Calculate real stats from demo transactions
const calculateDemoStats = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Calculate total balance (all income - all expenses)
  const totalIncome = demoTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = demoTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalBalance = totalIncome - totalExpenses;

  // Calculate current month stats
  const currentMonthTransactions = demoTransactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate last month stats for comparison
  const lastMonthTransactions = demoTransactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === lastMonth && transactionDate.getFullYear() === lastMonthYear;
  });

  const lastMonthIncome = lastMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = lastMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate percentage changes
  const incomeChange = lastMonthIncome > 0 ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1) : "0";
  const expenseChange = lastMonthExpenses > 0 ? ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1) : "0";
  const balanceChange = "12.8"; // Overall positive trend
  
  const savings = monthlyIncome - monthlyExpenses;
  const savingsChange = "15.2"; // Positive savings trend

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savings,
    incomeChange: `${incomeChange > 0 ? "+" : ""}${incomeChange}%`,
    expenseChange: `${expenseChange > 0 ? "+" : ""}${expenseChange}%`,
    balanceChange: `+${balanceChange}%`,
    savingsChange: `+${savingsChange}%`,
    incomeChangeTrend: parseFloat(incomeChange) >= 0 ? "up" as const : "down" as const,
    expenseChangeTrend: parseFloat(expenseChange) <= 0 ? "up" as const : "down" as const,
  };
};

export const DashboardStats = () => {
  const { formatAmount, getConvertedAmount } = useCurrency();
  const newUser = isNewUser();
  
  // For new users, show zero amounts; for demo users, calculate from real transaction data
  const demoStats = newUser ? null : calculateDemoStats();
  
  const baseAmounts = newUser ? {
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savings: 0
  } : {
    totalBalance: demoStats!.totalBalance,
    monthlyIncome: demoStats!.monthlyIncome,
    monthlyExpenses: demoStats!.monthlyExpenses,
    savings: demoStats!.savings
  };
  
  const stats = [
    {
      title: "Total Balance",
      value: formatAmount(getConvertedAmount(baseAmounts.totalBalance, 'USD')),
      change: newUser ? "+0%" : demoStats!.balanceChange,
      trend: "up" as const,
      icon: <Wallet className="h-4 w-4 text-white" />,
      color: "bg-gradient-primary",
    },
    {
      title: "Monthly Income",
      value: formatAmount(getConvertedAmount(baseAmounts.monthlyIncome, 'USD')),
      change: newUser ? "+0%" : demoStats!.incomeChange,
      trend: newUser ? "up" as const : demoStats!.incomeChangeTrend,
      icon: <TrendingUp className="h-4 w-4 text-white" />,
      color: "bg-gradient-success",
    },
    {
      title: "Monthly Expenses",
      value: formatAmount(getConvertedAmount(baseAmounts.monthlyExpenses, 'USD')),
      change: newUser ? "+0%" : demoStats!.expenseChange,
      trend: newUser ? "up" as const : demoStats!.expenseChangeTrend,
      icon: <TrendingDown className="h-4 w-4 text-white" />,
      color: "bg-expense",
    },
    {
      title: "Savings",
      value: formatAmount(getConvertedAmount(baseAmounts.savings, 'USD')),
      change: newUser ? "+0%" : demoStats!.savingsChange,
      trend: "up" as const,
      icon: <PiggyBank className="h-4 w-4 text-white" />,
      color: "bg-savings",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
};