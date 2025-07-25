import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";

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

export const DashboardStats = () => {
  const { formatAmount, getConvertedAmount } = useCurrency();
  
  // Base amounts in USD (these would typically come from your backend/database)
  const baseAmounts = {
    totalBalance: 12845.32,
    monthlyIncome: 5420.00,
    monthlyExpenses: 3287.45,
    savings: 2132.55
  };
  
  const stats = [
    {
      title: "Total Balance",
      value: formatAmount(getConvertedAmount(baseAmounts.totalBalance, 'USD')),
      change: "+8.2%",
      trend: "up" as const,
      icon: <Wallet className="h-4 w-4 text-white" />,
      color: "bg-gradient-primary",
    },
    {
      title: "Monthly Income",
      value: formatAmount(getConvertedAmount(baseAmounts.monthlyIncome, 'USD')),
      change: "+12.5%",
      trend: "up" as const,
      icon: <TrendingUp className="h-4 w-4 text-white" />,
      color: "bg-gradient-success",
    },
    {
      title: "Monthly Expenses",
      value: formatAmount(getConvertedAmount(baseAmounts.monthlyExpenses, 'USD')),
      change: "-5.3%",
      trend: "down" as const,
      icon: <TrendingDown className="h-4 w-4 text-white" />,
      color: "bg-expense",
    },
    {
      title: "Savings",
      value: formatAmount(getConvertedAmount(baseAmounts.savings, 'USD')),
      change: "+23.1%",
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