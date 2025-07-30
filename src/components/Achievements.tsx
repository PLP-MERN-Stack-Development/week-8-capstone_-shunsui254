import { useState, useEffect } from "react";
import { Trophy, Star, Target, TrendingUp, Award, Zap, Gift, Crown, Medal, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isDemoAccount, isNewUser } from "@/lib/userUtils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "savings" | "budgeting" | "streaks" | "milestones" | "goals";
  difficulty: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalTransactions: number;
  savingsRate: number;
  budgetCompliance: number;
  achievementsUnlocked: number;
}

// Sample achievements data
const achievements: Achievement[] = [
  {
    id: "first_transaction",
    title: "Getting Started",
    description: "Record your first transaction",
    icon: <Star className="h-5 w-5" />,
    category: "milestones",
    difficulty: "bronze",
    points: 10,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: "2024-05-01",
    requirement: "Add 1 transaction",
  },
  {
    id: "budget_master",
    title: "Budget Master",
    description: "Stay within budget for 3 consecutive months",
    icon: <Target className="h-5 w-5" />,
    category: "budgeting",
    difficulty: "gold",
    points: 100,
    progress: 3,
    maxProgress: 3,
    unlocked: true,
    unlockedAt: "2024-08-15",
    requirement: "3 months under budget",
  },
  {
    id: "savings_hero",
    title: "Savings Hero",
    description: "Save 20% of your income for a month",
    icon: <Trophy className="h-5 w-5" />,
    category: "savings",
    difficulty: "silver",
    points: 50,
    progress: 20,
    maxProgress: 20,
    unlocked: true,
    unlockedAt: "2024-07-01",
    requirement: "Save 20% monthly income",
  },
  {
    id: "streak_warrior",
    title: "Streak Warrior",
    description: "Track expenses for 30 consecutive days",
    icon: <Zap className="h-5 w-5" />,
    category: "streaks",
    difficulty: "silver",
    points: 75,
    progress: 30,
    maxProgress: 30,
    unlocked: true,
    unlockedAt: "2024-06-01",
    requirement: "30-day logging streak",
  },
  {
    id: "goal_crusher",
    title: "Goal Crusher",
    description: "Complete 5 financial goals",
    icon: <Medal className="h-5 w-5" />,
    category: "goals",
    difficulty: "gold",
    points: 150,
    progress: 4,
    maxProgress: 5,
    unlocked: false,
    requirement: "Complete 5 goals",
  },
  {
    id: "transaction_titan",
    title: "Transaction Titan",
    description: "Record 100 transactions",
    icon: <TrendingUp className="h-5 w-5" />,
    category: "milestones",
    difficulty: "bronze",
    points: 25,
    progress: 182,
    maxProgress: 100,
    unlocked: true,
    unlockedAt: "2024-09-15",
    requirement: "Record 100 transactions",
  },
  {
    id: "emergency_fund",
    title: "Emergency Ready",
    description: "Build an emergency fund of 6 months expenses",
    icon: <Crown className="h-5 w-5" />,
    category: "savings",
    difficulty: "platinum",
    points: 250,
    progress: 7.5,
    maxProgress: 6,
    unlocked: true,
    unlockedAt: "2025-03-01",
    requirement: "6 months emergency fund",
  },
  {
    id: "expense_tracker",
    title: "Expense Tracker",
    description: "Categorize all expenses for 2 weeks",
    icon: <CheckCircle className="h-5 w-5" />,
    category: "budgeting",
    difficulty: "bronze",
    points: 20,
    progress: 14,
    maxProgress: 14,
    unlocked: true,
    unlockedAt: "2024-05-15",
    requirement: "Categorize expenses for 14 days",
  },
  {
    id: "freelance_freedom",
    title: "Freelance Freedom",
    description: "Transition from corporate job to freelancing",
    icon: <Crown className="h-5 w-5" />,
    category: "milestones",
    difficulty: "platinum",
    points: 300,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: "2024-09-01",
    requirement: "Successfully transition to freelancing",
  },
  {
    id: "content_creator",
    title: "Content Creator",
    description: "Earn income from 3 different content platforms",
    icon: <Award className="h-5 w-5" />,
    category: "milestones",
    difficulty: "gold",
    points: 200,
    progress: 3,
    maxProgress: 3,
    unlocked: true,
    unlockedAt: "2024-12-01",
    requirement: "YouTube, TikTok, Instagram income",
  },
  {
    id: "consistency_king",
    title: "Consistency King",
    description: "Track expenses for 365+ consecutive days",
    icon: <Zap className="h-5 w-5" />,
    category: "streaks",
    difficulty: "platinum",
    points: 500,
    progress: 427,
    maxProgress: 365,
    unlocked: true,
    unlockedAt: "2025-05-01",
    requirement: "365-day logging streak",
  },
  {
    id: "income_multiplier",
    title: "Income Multiplier",
    description: "Double your monthly income within a year",
    icon: <TrendingUp className="h-5 w-5" />,
    category: "milestones",
    difficulty: "gold",
    points: 250,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: "2025-01-15",
    requirement: "Double monthly income in 12 months",
  },
];

const userStats: UserStats = {
  totalPoints: 1250,
  level: 8,
  nextLevelPoints: 1400,
  currentStreak: 427, // 14+ months of consistent tracking
  longestStreak: 427,
  totalTransactions: 182, // Matches the demo transaction count
  savingsRate: 28, // Reflecting the freelancer's good savings rate
  budgetCompliance: 92, // High compliance due to disciplined tracking
  achievementsUnlocked: 9,
};

export const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [animatingAchievement, setAnimatingAchievement] = useState<string | null>(null);
  const { toast } = useToast();
  const demoUser = isDemoAccount();
  const newUser = isNewUser();

  // Only show demo data for demo accounts, new users get empty state
  const shouldShowData = demoUser && !newUser;

  if (!shouldShowData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
            <p className="text-muted-foreground">Track your financial milestones and earn rewards</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Begin tracking your finances to unlock achievements and earn rewards for reaching your financial goals.
              </p>
              <Button className="gap-2">
                <Star className="h-4 w-4" />
                Add Your First Transaction
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    // Check for newly unlocked achievements
    const checkAchievements = () => {
      achievements.forEach((achievement) => {
        if (!achievement.unlocked && achievement.progress >= achievement.maxProgress) {
          unlockAchievement(achievement.id);
        }
      });
    };

    checkAchievements();
  }, []);

  const unlockAchievement = (achievementId: string) => {
    setAnimatingAchievement(achievementId);
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
      toast({
        title: "🎉 Achievement Unlocked!",
        description: `${achievement.title} - You earned ${achievement.points} points!`,
      });

      // Animation timeout
      setTimeout(() => {
        setAnimatingAchievement(null);
      }, 2000);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "bronze":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "silver":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "gold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "platinum":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "savings":
        return "text-green-600 dark:text-green-400";
      case "budgeting":
        return "text-blue-600 dark:text-blue-400";
      case "streaks":
        return "text-orange-600 dark:text-orange-400";
      case "milestones":
        return "text-purple-600 dark:text-purple-400";
      case "goals":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
  };

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === "all" || achievement.category === selectedCategory
  );

  const calculateLevelProgress = () => {
    const currentLevelStart = userStats.level * 100;
    const progress = userStats.totalPoints - currentLevelStart;
    const total = userStats.nextLevelPoints - currentLevelStart;
    return (progress / total) * 100;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* User Stats Header */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Level {userStats.level}</div>
              <div className="text-sm text-muted-foreground mb-2">
                {userStats.totalPoints}/{userStats.nextLevelPoints} XP
              </div>
              <Progress value={calculateLevelProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.achievementsUnlocked}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements & Badges
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete challenges to unlock achievements and earn points to level up!
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
              <TabsTrigger value="budgeting">Budget</TabsTrigger>
              <TabsTrigger value="streaks">Streaks</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            {["all", "savings", "budgeting", "streaks", "milestones", "goals"].map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAchievements
                    .filter(a => category === "all" || a.category === category)
                    .map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`relative transition-all duration-300 hover:shadow-md ${
                        achievement.unlocked
                          ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50"
                          : "opacity-75"
                      } ${
                        animatingAchievement === achievement.id
                          ? "animate-pulse ring-2 ring-yellow-400"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        {/* Achievement Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg ${getCategoryColor(achievement.category)} bg-opacity-10`}>
                            {achievement.icon}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getDifficultyColor(achievement.difficulty)}>
                              {achievement.difficulty}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {achievement.points} pts
                            </div>
                          </div>
                        </div>

                        {/* Achievement Content */}
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm">{achievement.title}</h3>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress 
                              value={getProgressPercentage(achievement)} 
                              className="h-2"
                            />
                          </div>

                          {/* Requirements */}
                          <div className="text-xs text-muted-foreground">
                            <strong>Requirement:</strong> {achievement.requirement}
                          </div>

                          {/* Unlocked Status */}
                          {achievement.unlocked && (
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle className="h-3 w-3" />
                              Unlocked {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {/* Unlock Badge */}
                        {achievement.unlocked && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-green-500 text-white rounded-full p-1">
                              <Trophy className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Quick Stats */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Financial Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Budget Compliance</span>
                    <span className="font-medium">{userStats.budgetCompliance}%</span>
                  </div>
                  <Progress value={userStats.budgetCompliance} className="h-2" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Savings Rate</span>
                    <span className="font-medium">{userStats.savingsRate}%</span>
                  </div>
                  <Progress value={userStats.savingsRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Total Transactions</span>
                    <span className="text-sm font-medium">{userStats.totalTransactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Longest Streak</span>
                    <span className="text-sm font-medium">{userStats.longestStreak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Current Level</span>
                    <span className="text-sm font-medium">Level {userStats.level}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Next Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs">
                    <div className="font-medium">Next Level</div>
                    <div className="text-muted-foreground">
                      {userStats.nextLevelPoints - userStats.totalPoints} more points
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium">Streak Milestone</div>
                    <div className="text-muted-foreground">
                      {500 - userStats.currentStreak} days to 500-day legend
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
