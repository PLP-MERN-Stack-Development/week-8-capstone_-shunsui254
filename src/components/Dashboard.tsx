import { DashboardStats } from "@/components/DashboardStats";
import { QuickActions } from "@/components/QuickActions";
import { RecentTransactions } from "@/components/RecentTransactions";
import { SpendingChart } from "@/components/SpendingChart";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-6 md:grid-cols-2">
        <SpendingChart />
        <QuickActions />
      </div>
      
      <RecentTransactions />
    </div>
  );
};