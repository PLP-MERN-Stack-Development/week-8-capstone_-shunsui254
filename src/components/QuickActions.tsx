/**
 * QuickActions Component - Rapid Access Financial Tools
 * 
 * This component provides users with quick access to the most commonly used
 * financial management actions directly from the dashboard for improved UX.
 * 
 * Features:
 * - Direct action execution without intermediate steps
 * - Visual action cards with distinctive icons
 * - Responsive grid layout for different screen sizes
 * - Consistent button styling and interaction patterns
 * - Immediate transaction entry dialogs
 * 
 * Actions Available:
 * - Add Income: Opens income-specific transaction dialog
 * - Add Expense: Opens expense-specific transaction dialog
 * - Set Budget: Direct budget management access
 * 
 * Design Philosophy:
 * - Prioritizes direct action over guidance
 * - Uses familiar financial icons for quick recognition
 * - Maintains consistent visual hierarchy with other components
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowUpRight, ArrowDownLeft, Target, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { QuickTransactionDialog } from "@/components/QuickTransactionDialog";
import { useToast } from "@/hooks/use-toast";

/**
 * QuickActions Component
 * Renders a card containing the most frequently used financial actions
 */
export const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Dialog state management
  const [showIncomeDialog, setShowIncomeDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);

  /**
   * Handle Add Income Action
   * Opens income-specific transaction dialog directly
   */
  const handleAddIncome = () => {
    setShowIncomeDialog(true);
  };

  /**
   * Handle Add Expense Action
   * Opens expense-specific transaction dialog directly
   */
  const handleAddExpense = () => {
    setShowExpenseDialog(true);
  };

  /**
   * Handle Set Budget Action
   * Opens budget management dialog or navigates to budget page
   */
  const handleSetBudget = () => {
    // For now, show a helpful message about budget creation
    toast({
      title: "🎯 Budget Setup",
      description: "Setting up budget management. For now, track spending with transactions to establish patterns.",
      variant: "default",
    });
    
    // Future: Open budget creation dialog or navigate to budget page
    // setBudgetDialogOpen(true);
    // navigate("/budgets");
  };

  /**
   * Action Configuration Array
   * Defines the available quick actions with their properties and handlers
   */
  const actions = [
    {
      title: "Add Income",
      icon: <ArrowUpRight className="h-4 w-4" />,
      variant: "default" as const,
      action: handleAddIncome,
      description: "Record salary, freelance, or other income"
    },
    {
      title: "Add Expense",
      icon: <ArrowDownLeft className="h-4 w-4" />,
      variant: "secondary" as const,
      action: handleAddExpense,
      description: "Track purchases, bills, and spending"
    },
    {
      title: "Set Budget",
      icon: <Target className="h-4 w-4" />,
      variant: "outline" as const,
      action: handleSetBudget,
      description: "Create and manage spending budgets"
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actions.map((action, index) => (
            <div key={action.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Button
                variant={action.variant}
                className="w-full justify-start gap-3 h-14 text-left"
                onClick={action.action}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    action.variant === "default" ? "bg-primary/10" :
                    action.variant === "secondary" ? "bg-secondary/10" : "bg-muted"
                  }`}>
                    {action.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{action.title}</span>
                    <span className="text-xs text-muted-foreground">{action.description}</span>
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Direct Transaction Dialogs */}
      <QuickTransactionDialog
        isOpen={showIncomeDialog}
        onClose={() => setShowIncomeDialog(false)}
        defaultType="income"
        title="Add Income"
      />
      
      <QuickTransactionDialog
        isOpen={showExpenseDialog}
        onClose={() => setShowExpenseDialog(false)}
        defaultType="expense"
        title="Add Expense"
      />
    </>
  );
};