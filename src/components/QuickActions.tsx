/**
 * QuickActions Component - Rapid Access Financial Tools
 * 
 * This component provides users with quick access to the most commonly used
 * financial management actions directly from the dashboard for improved UX.
 * 
 * Features:
 * - One-click access to primary financial actions
 * - Visual action cards with distinctive icons
 * - Responsive grid layout for different screen sizes
 * - Consistent button styling and interaction patterns
 * - Toast notifications for user feedback
 * 
 * Actions Available:
 * - Add Income: Opens transaction dialog with helpful message
 * - Add Expense: Opens transaction dialog with helpful message
 * - Set Budget: Navigates to budget management section
 * 
 * Design Philosophy:
 * - Prioritizes speed of access over feature completeness
 * - Uses familiar financial icons for quick recognition
 * - Maintains consistent visual hierarchy with other components
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowUpRight, ArrowDownLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { useToast } from "@/hooks/use-toast";

/**
 * QuickActions Component
 * Renders a card containing the most frequently used financial actions
 */
export const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"income" | "expense">("expense");

  /**
   * Handle Add Income Action
   * Shows guidance to user about adding income
   */
  const handleAddIncome = () => {
    setDialogType("income");
    setShowTransactionDialog(true);
    toast({
      title: "💰 Add Income",
      description: "Click 'Add Transaction' and select 'Income' to record your earnings.",
    });
  };

  /**
   * Handle Add Expense Action
   * Shows guidance to user about adding expense
   */
  const handleAddExpense = () => {
    setDialogType("expense");
    setShowTransactionDialog(true);
    toast({
      title: "💳 Add Expense",
      description: "Click 'Add Transaction' and select 'Expense' to track spending.",
    });
  };

  /**
   * Handle Set Budget Action
   * Navigates user to budget management
   */
  const handleSetBudget = () => {
    toast({
      title: "🎯 Budget Management",
      description: "Budget features are coming soon! For now, track your spending with transactions.",
      variant: "default",
    });
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
          
          {/* Add Transaction Button */}
          <div className="pt-2 border-t">
            <AddTransactionDialog />
          </div>
        </CardContent>
      </Card>
    </>
  );
};