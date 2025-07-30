import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { isDemoAccount } from "@/lib/userUtils";

export const ProfileSummary = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("mybudgeteer_user");
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      const savedPrefs = localStorage.getItem("mybudgeteer_preferences");
      const preferences = savedPrefs ? JSON.parse(savedPrefs) : {};
      
      const profile = {
        firstName: user.firstName || "",
        surname: user.surname || "",
        otherName: user.otherName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        preferredCurrency: user.preferredCurrency || "USD",
        profilePicture: user.profilePicture || "",
        currency: user.preferredCurrency || "USD",
        budgetType: preferences.budgetType || "personal"
      };
      
      setProfileData(profile);
      
      // Calculate completion
      const fields = [profile.firstName, profile.surname, profile.email, profile.phoneNumber, profile.preferredCurrency];
      const completed = fields.filter(field => field && field.trim() !== "").length;
      setCompletion(Math.round((completed / fields.length) * 100));
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, []);

  if (!profileData) return null;

  const isDemo = isDemoAccount(profileData.email);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profileData.profilePicture} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profileData.firstName.charAt(0) + profileData.surname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {[profileData.firstName, profileData.otherName, profileData.surname].filter(Boolean).join(" ") || profileData.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {profileData.email}
            </p>
            {isDemo && (
              <Badge variant="secondary" className="text-xs mt-1">
                Demo Account
              </Badge>
            )}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Completion</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{completion}%</span>
              {completion === 100 ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-warning" />
              )}
            </div>
          </div>
          <Progress value={completion} className="h-2" />
          {completion < 100 && (
            <p className="text-xs text-muted-foreground">
              Complete your profile to get the most out of MyBudgeteer
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Currency</p>
            <p className="font-medium">{profileData.currency}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Budget Type</p>
            <p className="font-medium capitalize">{profileData.budgetType}</p>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/profile")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage Profile
        </Button>
      </CardContent>
    </Card>
  );
};
