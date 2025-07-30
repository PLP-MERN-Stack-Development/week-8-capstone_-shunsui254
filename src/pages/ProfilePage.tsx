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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  DollarSign, 
  Palette, 
  Shield, 
  Bell, 
  Globe, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  LogOut, 
  Save, 
  Edit,
  FileText,
  Settings,
  Heart,
  Calendar,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isDemoAccount } from "@/lib/userUtils";
import { isFirstTimeUser } from "@/lib/userUtils";
import { useCurrency, CURRENCIES } from "@/hooks/useCurrency";
import { useTheme } from "@/hooks/useTheme";

interface UserData {
  firstName: string;
  surname: string;
  otherName: string;
  email: string;
  phoneNumber: string;
  preferredCurrency: string;
  budgetType: string;
  budgetPeriod: string;
  profilePicture: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  securityAlerts: boolean;
  budgetAlerts: boolean;
  language: string;
  accessibility: {
    fontSize: string;
    highContrast: boolean;
  };
  joinedDate: string;
}

interface UserPreferences {
  theme: string;
  currency: string;
  budgetType: string;
  budgetPeriod: string;
  notifications: {
    email: boolean;
    push: boolean;
    security: boolean;
    budget: boolean;
  };
  accessibility: {
    fontSize: string;
    highContrast: boolean;
  };
  language: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCurrency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
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
      const preferences = loadUserPreferences();
      
      setUserData({
        firstName: user.firstName || "",
        surname: user.surname || "",
        otherName: user.otherName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        preferredCurrency: preferences.currency,
        budgetType: preferences.budgetType,
        budgetPeriod: preferences.budgetPeriod,
        profilePicture: user.profilePicture || "",
        twoFactorEnabled: preferences.notifications.security,
        emailNotifications: preferences.notifications.email,
        pushNotifications: preferences.notifications.push,
        securityAlerts: preferences.notifications.security,
        budgetAlerts: preferences.notifications.budget,
        language: preferences.language,
        accessibility: preferences.accessibility,
        joinedDate: user.joinedDate || new Date().toISOString()
      });
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadUserPreferences = (): UserPreferences => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedCurrency = localStorage.getItem("selectedCurrency") || "USD";
    const savedPreferences = localStorage.getItem("mybudgeteer_preferences");
    
    const defaultPreferences: UserPreferences = {
      theme: savedTheme,
      currency: savedCurrency,
      budgetType: "personal",
      budgetPeriod: "monthly",
      notifications: {
        email: true,
        push: true,
        security: true,
        budget: true
      },
      accessibility: {
        fontSize: "medium",
        highContrast: false
      },
      language: "en"
    };

    if (savedPreferences) {
      try {
        return { ...defaultPreferences, ...JSON.parse(savedPreferences) };
      } catch {
        return defaultPreferences;
      }
    }

    return defaultPreferences;
  };

  const saveUserPreferences = (preferences: Partial<UserPreferences>) => {
    const current = loadUserPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem("mybudgeteer_preferences", JSON.stringify(updated));
  };

  const calculateProfileCompletion = () => {
    if (!userData) return;

    const fields = [
      userData.firstName,
      userData.surname,
      userData.email,
      userData.phoneNumber,
      userData.preferredCurrency,
      userData.budgetType,
      userData.budgetPeriod,
      userData.profilePicture
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
    if (!userData) return;

    const updatedUserData = { ...userData, [key]: value };
    setUserData(updatedUserData);

    // Save to preferences
    if (key === "preferredCurrency") {
      setCurrency(CURRENCIES.find(c => c.code === value) || CURRENCIES[0]);
      saveUserPreferences({ currency: value });
    } else if (key === "budgetType" || key === "budgetPeriod") {
      saveUserPreferences({ [key]: value });
    } else if (key.includes("Notifications") || key.includes("Alerts")) {
      const notifications = loadUserPreferences().notifications;
      const notificationKey = key.replace("Notifications", "").replace("Alerts", "").toLowerCase();
      const updatedNotifications = { ...notifications, [notificationKey]: value };
      saveUserPreferences({ notifications: updatedNotifications });
    }

    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleChangePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate password change
    setTimeout(() => {
      setLoading(false);
      setShowChangePassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
    }, 2000);
  };

  const handleDeleteAccount = () => {
    if (isDemoAccount(userData?.email)) {
      toast({
        title: "Cannot Delete Demo Account",
        description: "The demo account cannot be deleted. This account is for demonstration purposes only.",
        variant: "destructive"
      });
      return;
    }

    // Delete user data
    localStorage.removeItem("mybudgeteer_user");
    localStorage.removeItem("mybudgeteer_preferences");
    localStorage.removeItem("selectedCurrency");
    localStorage.removeItem("theme");

    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
    });

    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("mybudgeteer_user");
    navigate("/");
  };

  const handleExportData = () => {
    if (!userData) return;

    const exportData = {
      userData,
      preferences: loadUserPreferences(),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `mybudgeteer-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been downloaded successfully.",
    });
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
    return <div>Loading...</div>;
  }

  const isFirstTime = isFirstTimeUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
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
              <AvatarImage src={userData.profilePicture} />
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
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
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

          {isDemoAccount(userData.email) && (
            <Alert className="border-warning/50 bg-warning/10">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You're using the demo account. Some features like account deletion and password changes are disabled for demonstration purposes.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
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
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userData.profilePicture} />
                    <AvatarFallback className="text-lg font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="mb-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Upload a photo to personalize your profile
                    </p>
                  </div>
                </div>

                <Separator />

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

                {/* Contact Information */}
                <Separator />
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

          {/* Financial Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                      value={userData.budgetType} 
                      onValueChange={(value) => handlePreferenceChange("budgetType", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Personal
                          </div>
                        </SelectItem>
                        <SelectItem value="family">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Family
                          </div>
                        </SelectItem>
                        <SelectItem value="business">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Business
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Budget Period</Label>
                    <Select 
                      value={userData.budgetPeriod} 
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

                <Separator />

                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <Palette className="h-4 w-4" />
                    App Preferences
                  </h3>
                  
                  <div className="space-y-4">
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
                        <Label>Language</Label>
                        <p className="text-sm text-muted-foreground">Select your preferred language</p>
                      </div>
                      <Select value={userData.language} onValueChange={(value) => handlePreferenceChange("language", value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              English
                            </div>
                          </SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={userData.emailNotifications} 
                      onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get browser notifications</p>
                    </div>
                    <Switch 
                      checked={userData.pushNotifications} 
                      onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Budget Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications when approaching budget limits</p>
                    </div>
                    <Switch 
                      checked={userData.budgetAlerts} 
                      onCheckedChange={(checked) => handlePreferenceChange("budgetAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Important security notifications</p>
                    </div>
                    <Switch 
                      checked={userData.securityAlerts} 
                      onCheckedChange={(checked) => handlePreferenceChange("securityAlerts", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-success/10 border border-success/50 rounded-lg">
                  <div className="flex items-center gap-2 text-success-foreground">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Your data is protected with top-notch security</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Password</Label>
                      <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                      <DialogTrigger asChild>
                        <Button variant="outline" disabled={isDemoAccount(userData.email)}>
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and choose a new one.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Current Password</Label>
                            <div className="relative">
                              <Input
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                              >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>New Password</Label>
                            <div className="relative">
                              <Input
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              >
                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Confirm New Password</Label>
                            <div className="relative">
                              <Input
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              >
                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowChangePassword(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleChangePassword} disabled={loading}>
                            {loading ? "Changing..." : "Change Password"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch 
                      checked={userData.twoFactorEnabled} 
                      onCheckedChange={(checked) => handlePreferenceChange("twoFactorEnabled", checked)}
                      disabled={isDemoAccount(userData.email)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Privacy & Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Terms of Service</Label>
                      <p className="text-sm text-muted-foreground">Read our terms and conditions</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/terms")}>
                      View Terms
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Privacy Policy</Label>
                      <p className="text-sm text-muted-foreground">Learn how we protect your data</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/privacy")}>
                      View Policy
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Data Management</h3>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Export Data</Label>
                        <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <Label className="text-red-800">Delete Account</Label>
                        <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                      </div>
                      <Dialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" disabled={isDemoAccount(userData.email)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800">
                              <AlertCircle className="h-5 w-5" />
                              <span className="font-medium">This action is irreversible</span>
                            </div>
                            <p className="text-sm text-red-600 mt-2">
                              All your budget data, transactions, and settings will be permanently lost.
                            </p>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteAccount(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                              Yes, Delete My Account
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
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
                      {isDemoAccount(userData.email) ? "Demo Account" : "Standard Account"}
                    </p>
                  </div>
                </div>

                <Separator />

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
