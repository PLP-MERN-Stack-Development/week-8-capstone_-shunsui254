import { DashboardStats } from "@/components/DashboardStats";
import { QuickActions } from "@/components/QuickActions";
import { RecentTransactions } from "@/components/RecentTransactions";
import { SpendingChart } from "@/components/SpendingChart";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { CurrencyRateHistory } from "@/components/CurrencyRateHistory";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Cecil! Here's your financial overview.</p>
        </div>
        <AddTransactionDialog />
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SpendingChart />
        <QuickActions />
        <CurrencyConverter />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentTransactions />
        <CurrencyRateHistory />
      </div>
    </div>
  );
};