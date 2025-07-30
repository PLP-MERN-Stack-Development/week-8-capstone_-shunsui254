import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Brain, Wifi, Calculator, Trophy, Scissors, Target, Bell, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Import all advanced components
import { SmartTips } from "@/components/SmartTips";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Achievements } from "@/components/Achievements";
import { SplitTransactionForm } from "@/components/SplitTransactionForm";
import { GoalForm } from "@/components/GoalForm";
import { BillReminderForm } from "@/components/BillReminderForm";
import { ShareMilestone } from "@/components/ShareMilestone";

interface FeatureInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "ai" | "financial" | "social" | "productivity";
  status: "stable" | "beta" | "experimental";
}

const features: FeatureInfo[] = [
  {
    id: "smart-tips",
    name: "AI Financial Insights",
    description: "Get personalized financial recommendations powered by AI analysis of your spending patterns.",
    icon: <Brain className="h-5 w-5" />,
    category: "ai",
    status: "beta",
  },
  {
    id: "goal-tracking",
    name: "Goal-Based Budgeting",
    description: "Set SMART financial goals and track your progress with visual indicators and milestone celebrations.",
    icon: <Target className="h-5 w-5" />,
    category: "financial",
    status: "beta",
  },
  {
    id: "bill-reminders",
    name: "Smart Bill Reminders",
    description: "Never miss a payment with automated bill reminders and notification scheduling.",
    icon: <Bell className="h-5 w-5" />,
    category: "productivity",
    status: "beta",
  },
  {
    id: "social-sharing",
    name: "Milestone Sharing",
    description: "Share your financial achievements with friends while keeping your data private and secure.",
    icon: <Zap className="h-5 w-5" />,
    category: "social",
    status: "beta",
  },
  {
    id: "offline-mode",
    name: "Offline Capabilities",
    description: "Work seamlessly offline with automatic sync when you're back online. Never lose your data.",
    icon: <Wifi className="h-5 w-5" />,
    category: "productivity",
    status: "beta",
  },
  {
    id: "tax-calculator",
    name: "Kenyan Tax Calculator",
    description: "Calculate PAYE, NSSF, and NHIF contributions with current KRA rates for freelancers.",
    icon: <Calculator className="h-5 w-5" />,
    category: "financial",
    status: "beta",
  },
  {
    id: "achievements",
    name: "Gamification System",
    description: "Earn badges, level up, and stay motivated with our comprehensive achievement system.",
    icon: <Trophy className="h-5 w-5" />,
    category: "productivity",
    status: "beta",
  },
  {
    id: "split-transactions",
    name: "Transaction Splitting",
    description: "Split complex transactions across multiple categories with precise amount or percentage control.",
    icon: <Scissors className="h-5 w-5" />,
    category: "financial",
    status: "beta",
  },
];

export const AdvancedFeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState<string>("smart-tips");
  const navigate = useNavigate();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ai":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "financial":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "social":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "productivity":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "beta":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "experimental":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const renderFeatureComponent = (featureId: string) => {
    switch (featureId) {
      case "smart-tips":
        return <SmartTips />;
      case "goal-tracking":
        return <GoalForm />;
      case "bill-reminders":
        return <BillReminderForm />;
      case "social-sharing":
        return <ShareMilestone />;
      case "offline-mode":
        return <OfflineIndicator />;
      case "tax-calculator":
        return <TaxCalculator />;
      case "achievements":
        return <Achievements />;
      case "split-transactions":
        return <SplitTransactionForm />;
      default:
        return <div>Feature not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">Advanced Features</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore MyBudgeteer's advanced capabilities designed to elevate your financial management experience. 
            From AI-powered insights to gamification, these features help you achieve your financial goals faster.
          </p>
          
          {/* Beta Disclaimer */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                      Beta
                    </Badge>
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                      Development Preview Features
                    </h3>
                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                      These advanced features are currently in active development and beta testing. While fully functional for demonstration purposes, 
                      they may have limited real-world integration and some functionalities are simulated. We're continuously improving these 
                      capabilities based on user feedback and testing results. Full production-ready versions will be available in future releases.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeFeature === feature.id
                  ? "ring-2 ring-primary border-primary"
                  : ""
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {feature.icon}
                    <CardTitle className="text-sm">{feature.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">
                  {feature.description}
                </p>
                <Badge className={getCategoryColor(feature.category)}>
                  {feature.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Feature Demo */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">
                {features.find(f => f.id === activeFeature)?.name}
              </h2>
              <p className="text-muted-foreground">
                {features.find(f => f.id === activeFeature)?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(features.find(f => f.id === activeFeature)?.category || "")}>
                {features.find(f => f.id === activeFeature)?.category}
              </Badge>
              <Badge className={getStatusColor(features.find(f => f.id === activeFeature)?.status || "")}>
                {features.find(f => f.id === activeFeature)?.status}
              </Badge>
            </div>
          </div>

          {/* Feature Component */}
          <div className="w-full">
            {renderFeatureComponent(activeFeature)}
          </div>
        </div>

        {/* Feature Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="ai">AI Features</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="productivity">Productivity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="mb-4">
                  <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
                    <CardContent className="pt-4">
                      <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        🚧 Feature Development Status
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                        These advanced features showcase the future direction of MyBudgeteer. While technically functional, 
                        they are designed primarily for demonstration and may have simulated behaviors or limited integration 
                        with external services.
                      </p>
                      <div className="grid gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Beta</Badge>
                          <span className="text-blue-700 dark:text-blue-300">Core functionality implemented, limited real-world integration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Stable</Badge>
                          <span className="text-blue-700 dark:text-blue-300">Production-ready with full functionality</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-2">Current Beta Features</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• AI insights with simulated analysis patterns</li>
                      <li>• Goal tracking with demo progress calculations</li>
                      <li>• Bill reminders using browser notifications</li>
                      <li>• Achievement system with sample milestones</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Production Roadmap</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Real-time AI financial analysis integration</li>
                      <li>• Advanced cloud synchronization</li>
                      <li>• Enhanced notification systems</li>
                      <li>• Complete offline-first architecture</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai">
                <div className="space-y-4">
                  <h3 className="font-medium">AI & Machine Learning Features</h3>
                  <div className="grid gap-4">
                    {features.filter(f => f.category === "ai").map((feature) => (
                      <Card key={feature.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            {feature.icon}
                            <div>
                              <h4 className="font-medium">{feature.name}</h4>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial">
                <div className="space-y-4">
                  <h3 className="font-medium">Financial Management Tools</h3>
                  <div className="grid gap-4">
                    {features.filter(f => f.category === "financial").map((feature) => (
                      <Card key={feature.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            {feature.icon}
                            <div>
                              <h4 className="font-medium">{feature.name}</h4>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className="space-y-4">
                  <h3 className="font-medium">Social & Sharing Features</h3>
                  <div className="grid gap-4">
                    {features.filter(f => f.category === "social").map((feature) => (
                      <Card key={feature.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            {feature.icon}
                            <div>
                              <h4 className="font-medium">{feature.name}</h4>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="productivity">
                <div className="space-y-4">
                  <h3 className="font-medium">Productivity & Automation</h3>
                  <div className="grid gap-4">
                    {features.filter(f => f.category === "productivity").map((feature) => (
                      <Card key={feature.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            {feature.icon}
                            <div>
                              <h4 className="font-medium">{feature.name}</h4>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
