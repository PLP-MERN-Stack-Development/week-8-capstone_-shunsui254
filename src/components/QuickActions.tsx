import { Plus, ArrowUpRight, ArrowDownLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const QuickActions = () => {
  const actions = [
    {
      title: "Add Income",
      icon: <ArrowUpRight className="h-4 w-4" />,
      variant: "default" as const,
      action: () => {
        // TODO: Implement add income functionality
      },
    },
    {
      title: "Add Expense",
      icon: <ArrowDownLeft className="h-4 w-4" />,
      variant: "secondary" as const,
      action: () => {
        // TODO: Implement add expense functionality
      },
    },
    {
      title: "Set Budget",
      icon: <Target className="h-4 w-4" />,
      variant: "outline" as const,
      action: () => {
        // TODO: Implement set budget functionality
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