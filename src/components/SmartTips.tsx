import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, X, TrendingUp, TrendingDown, DollarSign, Calendar, Lightbulb, AlertTriangle, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isDemoAccount, isNewUser } from "@/lib/userUtils";

interface FinancialInsight {
  id: string;
  type: "warning" | "tip" | "opportunity" | "achievement";
  category: "spending" | "saving" | "budgeting" | "income" | "investment";
  title: string;
  message: string;
  impact: "high" | "medium" | "low";
  potentialSavings?: number;
  actionable: boolean;
  dismissed?: boolean;
  createdAt: string;
}

interface InsightResponse {
  insights: FinancialInsight[];
  generatedAt: string;
  analysisBasedOn: {
    transactionCount: number;
    timeRange: string;
    categoriesAnalyzed: string[];
  };
}

// Mock API function that simulates AI-generated insights
const fetchFinancialInsights = async (): Promise<InsightResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock insights based on transaction patterns
  const insights: FinancialInsight[] = [
    {
      id: "insight_1",
      type: "warning",
      category: "spending",
      title: "Dining Expenses Trending Up",
      message: "You're spending 30% more on dining this month ($450 vs $350 last month). Try cooking at home to save approximately $50/month.",
      impact: "high",
      potentialSavings: 50,
      actionable: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "insight_2",
      type: "tip",
      category: "saving",
      title: "Optimize Your Subscriptions",
      message: "You have $89 in monthly subscriptions. Consider canceling unused services like the old streaming platform you haven't used in 3 months.",
      impact: "medium",
      potentialSavings: 25,
      actionable: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "insight_3",
      type: "achievement",
      category: "budgeting",
      title: "Great Job on Transportation Budget!",
      message: "You've stayed 15% under your transportation budget for 3 consecutive months. You're saving $45/month on average.",
      impact: "medium",
      potentialSavings: 45,
      actionable: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "insight_4",
      type: "opportunity",
      category: "income",
      title: "Freelance Income Growth Opportunity",
      message: "Your freelance income has grown 40% over 6 months. Consider raising your rates by 10-15% for new clients.",
      impact: "high",
      potentialSavings: 300,
      actionable: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "insight_5",
      type: "tip",
      category: "investment",
      title: "Emergency Fund Milestone",
      message: "You've saved $2,100 - that's 3 months of expenses! Consider investing 50% of future savings in diversified index funds.",
      impact: "low",
      actionable: true,
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    insights,
    generatedAt: new Date().toISOString(),
    analysisBasedOn: {
      transactionCount: 182,
      timeRange: "Last 6 months",
      categoriesAnalyzed: ["Food & Dining", "Transportation", "Technology", "Housing", "Entertainment"],
    },
  };
};

export const SmartTips = () => {
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());
  const demoUser = isDemoAccount();
  const newUser = isNewUser();

  // Only show AI insights for demo accounts, new users get empty state
  const shouldShowInsights = demoUser && !newUser;

  const {
    data: insightData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["financial-insights"],
    queryFn: fetchFinancialInsights,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    enabled: shouldShowInsights, // Only fetch data for demo users
  });

  const handleDismissInsight = (insightId: string) => {
    setDismissedInsights(prev => new Set([...prev, insightId]));
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "tip":
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case "opportunity":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "achievement":
        return <DollarSign className="h-5 w-5 text-purple-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInsightColors = (type: string) => {
    switch (type) {
      case "warning":
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950";
      case "tip":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
      case "opportunity":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "achievement":
        return "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950";
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Show empty state for new users (non-demo accounts)
  if (!shouldShowInsights) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No AI Insights Available Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start adding transactions and build your spending history to receive personalized AI-powered financial insights and recommendations.
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Transaction
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load financial insights. Please check your connection and try again.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const visibleInsights = insightData?.insights.filter(
    insight => !dismissedInsights.has(insight.id)
  ) || [];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Financial Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized tips based on your spending patterns and financial behavior
        </p>
        {insightData?.analysisBasedOn && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {insightData.analysisBasedOn.timeRange}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {insightData.analysisBasedOn.transactionCount} transactions analyzed
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {visibleInsights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No insights available</h3>
            <p className="text-sm text-muted-foreground">
              Keep using MyBudgeteer to build up transaction history for personalized insights.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-md ${getInsightColors(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h3 className="font-medium text-sm">{insight.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactBadgeColor(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissInsight(insight.id)}
                      className="h-6 w-6 p-0 hover:bg-destructive/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {insight.message}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                    {insight.potentialSavings && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Potential savings: ${insight.potentialSavings}/month
                      </span>
                    )}
                  </div>
                  {insight.actionable && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Insights */}
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {isLoading ? "Analyzing..." : "Refresh Insights"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
