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
 * 
 * Actions Available:
 * - Add Income: Quick income entry (future implementation)
 * - Add Expense: Rapid expense logging (future implementation)
 * - Set Budget: Budget creation and management (future implementation)
 * 
 * Design Philosophy:
 * - Prioritizes speed of access over feature completeness
 * - Uses familiar financial icons for quick recognition
 * - Maintains consistent visual hierarchy with other components
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

import { Plus, ArrowUpRight, ArrowDownLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * QuickActions Component
 * Renders a card containing the most frequently used financial actions
 */
export const QuickActions = () => {
  /**
   * Action Configuration Array
   * Defines the available quick actions with their properties and handlers
   */
  const actions = [
    {
      title: "Add Income",
      icon: <ArrowUpRight className="h-4 w-4" />,
      variant: "default" as const,
      action: () => {
        // TODO: Implement add income functionality
        // Future: Open income dialog or navigate to income form
      },
    },
    {
      title: "Add Expense",
      icon: <ArrowDownLeft className="h-4 w-4" />,
      variant: "secondary" as const,
      action: () => {
        // TODO: Implement add expense functionality  
        // Future: Open expense dialog or navigate to expense form
      },
    },
    {
      title: "Set Budget",
      icon: <Target className="h-4 w-4" />,
      variant: "outline" as const,
      action: () => {
        // TODO: Implement set budget functionality
        // Future: Open budget creation dialog or navigate to budget page
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="w-full justify-start gap-2 h-12 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={action.action}
          >
            {action.icon}
            {action.title}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};