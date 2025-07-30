/**
 * Dashboard Component - Main Financial Overview Page
 * 
 * This component serves as the central hub of the MyBudgeteer application,
 * providing users with a comprehensive overview of their financial status.
 * 
 * Features:
 * - Personalized welcome message based on user status (first-time vs returning)
 * - Real-time financial statistics and metrics
 * - Interactive spending charts and analytics
 * - Quick action buttons for common tasks
 * - Recent transaction history
 * - Currency conversion tools
 * - Exchange rate tracking
 * - Profile summary with key insights
 * 
 * Layout:
 * - Responsive grid system that adapts to different screen sizes
 * - Strategic component placement for optimal user experience
 * - Progressive information disclosure from general to specific
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

import { DashboardStats } from "@/components/DashboardStats";
import { QuickActions } from "@/components/QuickActions";
import { RecentTransactions } from "@/components/RecentTransactions";
import { SpendingChart } from "@/components/SpendingChart";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { CurrencyRateHistory } from "@/components/CurrencyRateHistory";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { ProfileSummary } from "@/components/ProfileSummary";
import { getUserDisplayName, isFirstTimeUser } from "@/lib/userUtils";

/**
 * Main Dashboard Component
 * Orchestrates the layout and display of all dashboard widgets
 */
export const Dashboard = () => {
  // Get user-specific data for personalization
  const userDisplayName = getUserDisplayName();
  const isFirstTime = isFirstTimeUser();
  
  return (
    <div className="space-y-6">
      {/* Header Section - Welcome message and primary action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            {isFirstTime 
              ? `Welcome, ${userDisplayName}! Here's your financial overview.` 
              : `Welcome back, ${userDisplayName}! Here's your financial overview.`}
          </p>
        </div>
        {/* Primary CTA - Add Transaction */}
        <AddTransactionDialog />
      </div>
      
      {/* Financial Statistics - Key metrics at a glance */}
      <DashboardStats />
      
      {/* Main Content Grid - Core dashboard widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SpendingChart />    {/* Visual spending analysis */}
        <QuickActions />     {/* Frequently used actions */}
        <ProfileSummary />   {/* User progress and insights */}
      </div>
      
      {/* Secondary Content Grid - Financial tools */}
      <div className="grid gap-6 md:grid-cols-2">
        <CurrencyConverter />     {/* Real-time currency conversion */}
        <CurrencyRateHistory />   {/* Exchange rate trends */}
      </div>
      
      {/* Transaction History - Detailed activity log */}
      <div className="grid gap-6 md:grid-cols-1">
        <RecentTransactions />
      </div>
    </div>
  );
};