import { CurrencyConverter } from "@/components/CurrencyConverter";
import { CurrencyRateHistory } from "@/components/CurrencyRateHistory";
import { MultiCurrencyBudgets } from "@/components/MultiCurrencyBudgets";
import { CurrencyAlerts } from "@/components/CurrencyAlerts";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";

export const CurrencyDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Currency Management</h1>
          <p className="text-muted-foreground">
            Manage your multi-currency finances with real-time exchange rates
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      {/* Top Row - Converter and Rate History */}
      <div className="grid gap-6 md:grid-cols-2">
        <CurrencyConverter />
        <CurrencyRateHistory />
      </div>

      {/* Middle Row - Budgets */}
      <MultiCurrencyBudgets />

      {/* Bottom Row - Alerts */}
      <CurrencyAlerts />
    </div>
  );
};
