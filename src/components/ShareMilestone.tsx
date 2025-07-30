import { useState } from "react";
import { Share2, Copy, CheckCircle, Shield, Trophy, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface MilestoneData {
  id: string;
  type: "savings" | "budget" | "goal" | "spending" | "income";
  amount: number;
  description: string;
  period: string;
  achievement: string;
  createdAt: Date;
}

interface ShareMilestoneProps {
  milestone?: MilestoneData;
}

// Sample milestones for demo
const sampleMilestones: MilestoneData[] = [
  {
    id: "1",
    type: "savings",
    amount: 500,
    description: "Emergency fund milestone",
    period: "this month",
    achievement: "I saved $500 this month! 💰",
    createdAt: new Date(),
  },
  {
    id: "2",
    type: "budget",
    amount: 200,
    description: "Under budget achievement",
    period: "this month",
    achievement: "I stayed $200 under budget this month! 🎯",
    createdAt: new Date(),
  },
  {
    id: "3",
    type: "goal",
    amount: 1000,
    description: "Goal completion",
    period: "6 months",
    achievement: "I reached my $1000 savings goal! 🏆",
    createdAt: new Date(),
  },
  {
    id: "4",
    type: "spending",
    amount: 300,
    description: "Reduced spending",
    period: "this month",
    achievement: "I reduced my spending by $300 this month! ✨",
    createdAt: new Date(),
  },
  {
    id: "5",
    type: "income",
    amount: 2500,
    description: "Income milestone",
    period: "this month",
    achievement: "I earned $2500 in freelance income this month! 🚀",
    createdAt: new Date(),
  },
];

export const ShareMilestone = ({ milestone }: ShareMilestoneProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneData>(
    milestone || sampleMilestones[0]
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  // Generate anonymized share text
  const generateShareText = (milestone: MilestoneData) => {
    const templates = {
      savings: `🎉 Financial Win! I saved $${milestone.amount} ${milestone.period}! MyBudgeteer is helping me build better financial habits. #FinancialGoals #Savings #MoneyManagement`,
      budget: `🎯 Budget Success! I stayed $${milestone.amount} under budget ${milestone.period}! Loving how MyBudgeteer keeps me on track. #BudgetWin #FinancialDiscipline`,
      goal: `🏆 Goal Achieved! I reached my $${milestone.amount} financial goal! MyBudgeteer made it possible with smart tracking. #GoalAchieved #FinancialSuccess`,
      spending: `✨ Smart Spending! I reduced my expenses by $${milestone.amount} ${milestone.period}! MyBudgeteer helps me make better choices. #SmartSpending #FinancialWisdom`,
      income: `🚀 Income Milestone! I earned $${milestone.amount} ${milestone.period}! Managing it all with MyBudgeteer. #IncomeGrowth #FinancialProgress`,
    };

    return templates[milestone.type] || `🎉 I hit a financial milestone of $${milestone.amount}! MyBudgeteer is helping me manage my money better. #FinancialSuccess`;
  };

  // Check if Web Share API is supported
  const canNativeShare = () => {
    return 'share' in navigator && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Handle native sharing (Web Share API)
  const handleNativeShare = async () => {
    if (!canNativeShare()) return false;

    const shareText = generateShareText(selectedMilestone);
    
    try {
      setIsSharing(true);
      await navigator.share({
        title: "MyBudgeteer - Financial Milestone",
        text: shareText,
        url: "https://mybudgeteer.app", // Replace with actual URL
      });
      
      toast({
        title: "Milestone Shared!",
        description: "Your financial achievement has been shared successfully.",
      });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        return false;
      }
      return true; // User cancelled, which is fine
    } finally {
      setIsSharing(false);
    }
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = async () => {
    const shareText = generateShareText(selectedMilestone);
    
    try {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard!",
        description: "Your milestone text is ready to paste anywhere.",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard!",
        description: "Your milestone text is ready to paste anywhere.",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Handle share button click
  const handleShare = async () => {
    const nativeShareSucceeded = await handleNativeShare();
    if (!nativeShareSucceeded) {
      await handleCopyToClipboard();
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "savings":
        return <DollarSign className="h-4 w-4" />;
      case "budget":
        return <Trophy className="h-4 w-4" />;
      case "goal":
        return <Trophy className="h-4 w-4" />;
      case "spending":
        return <DollarSign className="h-4 w-4" />;
      case "income":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case "savings":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "budget":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "goal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "spending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "income":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Share Your Financial Milestone
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Celebrate your financial achievements and inspire others on their journey.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Milestone Selection */}
        <div>
          <h3 className="text-sm font-medium mb-3">Select a Milestone to Share</h3>
          <div className="grid gap-2">
            {sampleMilestones.map((ms) => (
              <div
                key={ms.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedMilestone.id === ms.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedMilestone(ms)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getMilestoneIcon(ms.type)}
                    <span className="text-sm font-medium">{ms.achievement}</span>
                  </div>
                  <Badge className={getMilestoneColor(ms.type)}>
                    {ms.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Text Preview */}
        <div>
          <h3 className="text-sm font-medium mb-3">Share Text Preview</h3>
          <Textarea
            value={generateShareText(selectedMilestone)}
            readOnly
            className="min-h-[100px] bg-muted/50"
          />
        </div>

        {/* Privacy Disclaimer */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Privacy Notice:</strong> Your shared milestone contains only anonymized achievements. 
            No personal information, account details, or specific financial data is included. 
            You have full control over what gets shared.
          </AlertDescription>
        </Alert>

        {/* Share Buttons */}
        <div className="flex gap-3">
          {canNativeShare() ? (
            <Button
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {isSharing ? "Sharing..." : "Share Milestone"}
            </Button>
          ) : (
            <Button
              onClick={handleCopyToClipboard}
              disabled={isCopied}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isCopied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          )}
        </div>

        {/* Additional Share Options */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Share on your favorite social platforms to inspire others on their financial journey!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
