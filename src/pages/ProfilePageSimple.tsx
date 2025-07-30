import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  Palette, 
  Shield, 
  Bell, 
  Globe, 
  LogOut, 
  Save, 
  Edit,
  ArrowLeft,
  CheckCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isDemoAccount } from "@/lib/userUtils";
import { isFirstTimeUser } from "@/lib/userUtils";
import { CURRENCIES } from "@/hooks/useCurrency";
import { useTheme } from "@/hooks/useTheme";

interface UserData {
  firstName: string;
  surname: string;
  otherName: string;
  email: string;
  phoneNumber: string;
  preferredCurrency: string;
  joinedDate: string;
}

export const ProfilePageSimple = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [preferences, setPreferences] = useState({
    budgetType: "personal",
    budgetPeriod: "monthly",
    emailNotifications: true,
    pushNotifications: true,
    language: "en"
  });
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      calculateProfileCompletion();
    }
  }, [userData]);

  const loadUserData = () => {
    const userStr = localStorage.getItem("mybudgeteer_user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserData({
        firstName: user.firstName || "",
        surname: user.surname || "",
        otherName: user.otherName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        preferredCurrency: user.preferredCurrency || "USD",
        joinedDate: user.createdAt || user.joinedDate || new Date().toISOString()
      });

      // Load preferences from localStorage
      const savedPrefs = localStorage.getItem("mybudgeteer_preferences");
      if (savedPrefs) {
        try {
          setPreferences({ ...preferences, ...JSON.parse(savedPrefs) });
        } catch {
          // Use defaults
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const calculateProfileCompletion = () => {
    if (!userData) return;

    const fields = [
      userData.firstName,
      userData.surname,
      userData.email,
      userData.phoneNumber,
      userData.preferredCurrency
    ];

    const completed = fields.filter(field => field && field.trim() !== "").length;
    const percentage = Math.round((completed / fields.length) * 100);
    setProfileCompletion(percentage);
  };

  const handleSaveField = (field: string, value: string) => {
    if (!userData) return;

    const updatedUserData = { ...userData, [field]: value };
    setUserData(updatedUserData);

    // Update localStorage
    const userStr = localStorage.getItem("mybudgeteer_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, [field]: value };
        localStorage.setItem("mybudgeteer_user", JSON.stringify(updatedUser));
        
        toast({
          title: "Profile Updated",
          description: "Your information has been saved successfully.",
        });
      } catch (error) {
        console.error("Error saving user data:", error);
        toast({
          title: "Error",
          description: "Failed to save changes. Please try again.",
          variant: "destructive"
        });
      }
    }

    setEditMode({ ...editMode, [field]: false });
  };

  const handlePreferenceChange = (key: string, value: any) => {
    const updatedPrefs = { ...preferences, [key]: value };
    setPreferences(updatedPrefs);
    localStorage.setItem("mybudgeteer_preferences", JSON.stringify(updatedPrefs));

    // Special handling for currency
    if (key === "preferredCurrency" && userData) {
      const updatedUserData = { ...userData, preferredCurrency: value };
      setUserData(updatedUserData);
      
      const userStr = localStorage.getItem("mybudgeteer_user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const updatedUser = { ...user, preferredCurrency: value };
          localStorage.setItem("mybudgeteer_user", JSON.stringify(updatedUser));
          localStorage.setItem("selectedCurrency", value);
        } catch (error) {
          console.error("Error updating currency:", error);
        }
      }
    }

    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("mybudgeteer_user");
    navigate("/");
  };

  const getInitials = () => {
    if (!userData) return "U";
    return `${userData.firstName.charAt(0)}${userData.surname.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    if (!userData) return "";
    const parts = [userData.firstName, userData.otherName, userData.surname].filter(Boolean);
    return parts.join(" ");
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const isDemo = isDemoAccount(userData.email);
  const isFirstTime = isFirstTimeUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Profile Settings</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isFirstTime 
                  ? `Welcome, ${userData.firstName}! 👋` 
                  : `Welcome back, ${userData.firstName}! 👋`}
              </h1>
              <p className="text-muted-foreground mb-3">
                This is your space to make MyBudgeteer truly yours!
              </p>
              
              {/* Profile Completion */}
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>
                {profileCompletion === 100 && (
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isDemo && (
            <div className="p-4 bg-warning/10 border border-warning/50 rounded-lg">
              <div className="flex items-center gap-2 text-warning-foreground">
                <Info className="h-4 w-4" />
                <span className="font-medium">Demo Account</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                You're using the demo account. Some features may be limited for demonstration purposes.
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {editMode.firstName ? (
                        <>
                          <Input
                            id="firstName"
                            value={userData.firstName}
                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                          />
                          <Button size="sm" onClick={() => handleSaveField("firstName", userData.firstName)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input value={userData.firstName} disabled />
                          <Button size="sm" variant="outline" onClick={() => setEditMode({ ...editMode, firstName: true })}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="surname">Surname</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {editMode.surname ? (
                        <>
                          <Input
                            id="surname"
                            value={userData.surname}
                            onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
                          />
                          <Button size="sm" onClick={() => handleSaveField("surname", userData.surname)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input value={userData.surname} disabled />
                          <Button size="sm" variant="outline" onClick={() => setEditMode({ ...editMode, surname: true })}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="otherName">Other Names (Optional)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {editMode.otherName ? (
                        <>
                          <Input
                            id="otherName"
                            value={userData.otherName}
                            onChange={(e) => setUserData({ ...userData, otherName: e.target.value })}
                            placeholder="Middle name, nickname, etc."
                          />
                          <Button size="sm" onClick={() => handleSaveField("otherName", userData.otherName)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input 
                            value={userData.otherName || "Not provided"} 
                            disabled 
                            placeholder="Add other names"
                          />
                          <Button size="sm" variant="outline" onClick={() => setEditMode({ ...editMode, otherName: true })}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={userData.email} 
                        disabled 
                        className="bg-muted"
                      />
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Email changes require verification
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {editMode.phoneNumber ? (
                        <>
                          <Input
                            id="phoneNumber"
                            value={userData.phoneNumber}
                            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                          />
                          <Button size="sm" onClick={() => handleSaveField("phoneNumber", userData.phoneNumber)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input 
                            value={userData.phoneNumber || "Not provided"} 
                            disabled 
                            placeholder="Add phone number"
                          />
                          <Button size="sm" variant="outline" onClick={() => setEditMode({ ...editMode, phoneNumber: true })}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Preferred Currency</Label>
                    <Select 
                      value={userData.preferredCurrency} 
                      onValueChange={(value) => handlePreferenceChange("preferredCurrency", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.code} - {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Budget Type</Label>
                    <Select 
                      value={preferences.budgetType} 
                      onValueChange={(value) => handlePreferenceChange("budgetType", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Budget Period</Label>
                    <Select 
                      value={preferences.budgetPeriod} 
                      onValueChange={(value) => handlePreferenceChange("budgetPeriod", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  App Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Light</span>
                    <Switch 
                      checked={theme === "dark"} 
                      onCheckedChange={toggleTheme}
                    />
                    <span className="text-sm">Dark</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={preferences.emailNotifications} 
                    onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get browser notifications</p>
                  </div>
                  <Switch 
                    checked={preferences.pushNotifications} 
                    onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-muted-foreground">
                      {new Date(userData.joinedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <p className="text-muted-foreground">
                      {isDemo ? "Demo Account" : "Standard Account"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-success/10 border border-success/50 rounded-lg">
                  <div className="flex items-center gap-2 text-success-foreground">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Your data is protected with top-notch security</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Need to sign out?</Label>
                    <p className="text-sm text-muted-foreground">You'll need to sign in again to access your account</p>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
