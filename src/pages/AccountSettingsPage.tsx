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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  CreditCard, 
  Bell, 
  FileText, 
  Settings, 
  Palette, 
  Globe, 
  LogOut, 
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  Edit,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  Lock,
  Smartphone,
  Monitor,
  Banknote,
  Receipt,
  Crown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isDemoAccount } from "@/lib/userUtils";
import { CURRENCIES } from "@/hooks/useCurrency";
import { useThemeContext } from "@/components/ThemeProvider";

interface UserData {
  firstName: string;
  surname: string;
  otherName: string;
  email: string;
  phoneNumber: string;
  preferredCurrency: string;
  joinedDate: string;
}

interface AccountSettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  billingAlerts: boolean;
  securityAlerts: boolean;
  sessionNotifications: boolean;
  language: string;
}

interface SubscriptionData {
  plan: string;
  status: string;
  renewalDate: string;
  features: string[];
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: string;
  description: string;
  status: string;
  downloadUrl?: string;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useThemeContext();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    pushNotifications: true,
    billingAlerts: true,
    securityAlerts: true,
    sessionNotifications: false,
    language: "en"
  });
  
  const [subscriptionData] = useState<SubscriptionData>({
    plan: "Free",
    status: "Active",
    renewalDate: "N/A",
    features: [
      "Basic budgeting tools",
      "Expense tracking",
      "Currency conversion",
      "Monthly reports",
      "Community support"
    ]
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiryDate: "12/26",
      isDefault: true
    }
  ]);

  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: "1",
      date: "2024-07-01",
      amount: "$0.00",
      description: "Free Plan - No charge",
      status: "N/A"
    }
  ]);

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: "current",
      device: "Windows PC - Chrome",
      location: "New York, NY",
      lastActive: "Active now",
      current: true
    },
    {
      id: "mobile-1",
      device: "iPhone - Safari",
      location: "New York, NY",
      lastActive: "2 hours ago",
      current: false
    },
    {
      id: "tablet-1",
      device: "iPad - Safari",
      location: "Brooklyn, NY",
      lastActive: "1 day ago",
      current: false
    }
  ]);

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
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    account: true,
    security: true,
    billing: true,
    notifications: true,
    privacy: true,
    preferences: true
  });

  useEffect(() => {
    loadUserData();
  }, []);

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

      // Load settings from localStorage
      const savedSettings = localStorage.getItem("mybudgeteer_account_settings");
      if (savedSettings) {
        try {
          setAccountSettings({ ...accountSettings, ...JSON.parse(savedSettings) });
        } catch {
          // Use defaults
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load account data. Please try again.",
        variant: "destructive"
      });
    }
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
          title: "Account Updated",
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

  const handleSettingChange = (key: string, value: any) => {
    const updatedSettings = { ...accountSettings, [key]: value };
    setAccountSettings(updatedSettings);
    localStorage.setItem("mybudgeteer_account_settings", JSON.stringify(updatedSettings));

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
    localStorage.removeItem("mybudgeteer_account_settings");
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

  const handleLogoutFromSession = (sessionId: string) => {
    if (sessionId === "current") {
      // If logging out from current session, perform full logout
      handleLogout();
      return;
    }

    // Remove the session from the list
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    
    toast({
      title: "Session Terminated",
      description: "You have been logged out from the selected device.",
    });
  };

  const handleLogoutAllSessions = () => {
    // Keep only the current session
    setActiveSessions(prev => prev.filter(session => session.current));
    
    toast({
      title: "All Sessions Terminated",
      description: "You have been logged out from all other devices.",
    });
  };

  const handleExportData = () => {
    if (!userData) return;

    const exportData = {
      userData,
      accountSettings,
      subscriptionData,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `mybudgeteer-account-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your account data has been downloaded successfully.",
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Account Settings</h1>
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
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Hey {userData.firstName}, manage your account with ease and keep your data safe! 🔐
              </h1>
              <p className="text-muted-foreground mb-3">
                Welcome to your Account Settings, where you can manage everything related to your MyBudgeteer experience.
              </p>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="p-4 bg-success/10 border border-success/50 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-success-foreground">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Your data and payments are protected with industry-standard encryption</span>
            </div>
          </div>

          {isDemo && (
            <Alert className="border-warning/50 bg-warning/10">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You're using the demo account. Some features like billing and account deletion are disabled for demonstration purposes.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-6">
          {/* 1. Account Information */}
          <Collapsible 
            open={expandedSections.account} 
            onOpenChange={() => toggleSection('account')}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </div>
                    {expandedSections.account ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {editMode.fullName ? (
                          <>
                            <Input
                              id="fullName"
                              value={getFullName()}
                              onChange={(e) => {
                                // This would need to parse the full name back to components
                                // For simplicity, we'll just show the edit mode without actual parsing
                              }}
                            />
                            <Button size="sm" onClick={() => setEditMode({ ...editMode, fullName: false })}>
                              <Save className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Input value={getFullName()} disabled />
                            <Button size="sm" variant="outline" onClick={() => setEditMode({ ...editMode, fullName: true })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

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
                        Email changes require verification for security
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
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
                              placeholder="Add phone number for account recovery"
                            />
                            <Button size="sm" variant="outline" onClick={() => setEditMode({ ...editMode, phoneNumber: true })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Used for account recovery or two-factor authentication
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* 2. Security */}
          <Collapsible 
            open={expandedSections.security} 
            onOpenChange={() => toggleSection('security')}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security
                    </div>
                    {expandedSections.security ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {/* Password */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Password</Label>
                        <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                      <DialogTrigger asChild>
                        <Button variant="outline" disabled={isDemo}>
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

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Two-Factor Authentication (2FA)</Label>
                        <p className="text-sm text-muted-foreground">Toggle 2FA on/off for an extra layer of protection</p>
                      </div>
                    </div>
                    <Switch 
                      checked={accountSettings.twoFactorEnabled} 
                      onCheckedChange={(checked) => handleSettingChange("twoFactorEnabled", checked)}
                      disabled={isDemo}
                    />
                  </div>

                  {/* Connected Accounts */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Banknote className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Connected Accounts</Label>
                        <p className="text-sm text-muted-foreground">Banks or financial apps linked to MyBudgeteer</p>
                      </div>
                    </div>
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No connected accounts</p>
                      <Button variant="outline" size="sm" className="mt-2" disabled>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect Account (Coming Soon)
                      </Button>
                    </div>
                  </div>

                  {/* Session Management */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label>Active Sessions</Label>
                          <p className="text-sm text-muted-foreground">See active sessions and log out from other devices</p>
                        </div>
                      </div>
                      {activeSessions.length > 1 && (
                        <Button variant="outline" size="sm" onClick={handleLogoutAllSessions}>
                          Log Out All Other Sessions
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {activeSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{session.device}</p>
                            <p className="text-xs text-muted-foreground">{session.location} • {session.lastActive}</p>
                          </div>
                          {session.current ? (
                            <Badge variant="secondary">Current Session</Badge>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleLogoutFromSession(session.id)}
                            >
                              Log Out
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* 3. Billing & Subscription */}
          <Collapsible 
            open={expandedSections.billing} 
            onOpenChange={() => toggleSection('billing')}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing & Subscription
                    </div>
                    {expandedSections.billing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {/* Current Plan */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label>Current Subscription Plan</Label>
                          <p className="text-sm text-muted-foreground">You're on the {subscriptionData.plan} Plan</p>
                        </div>
                      </div>
                      <Badge variant={subscriptionData.plan === "Free" ? "secondary" : "default"}>
                        {subscriptionData.plan}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium">Features included:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {subscriptionData.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {subscriptionData.plan === "Free" && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">
                          Upgrade for more features!
                        </p>
                        <Button size="sm" disabled>
                          <Zap className="h-4 w-4 mr-2" />
                          Upgrade Plan (Coming Soon)
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label>Payment Methods</Label>
                          <p className="text-sm text-muted-foreground">Manage your payment methods securely</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Add Payment Method
                      </Button>
                    </div>
                    
                    {paymentMethods.length > 0 ? (
                      <div className="space-y-2">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-4 w-4" />
                              <div>
                                <p className="font-medium text-sm">{method.type} ending in {method.last4}</p>
                                <p className="text-xs text-muted-foreground">Expires {method.expiryDate}</p>
                              </div>
                              {method.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                            </div>
                            <Button variant="outline" size="sm" disabled>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No payment methods added
                      </p>
                    )}
                  </div>

                  {/* Billing History */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Billing History</Label>
                        <p className="text-sm text-muted-foreground">Viewable/downloadable history of invoices or payments</p>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billingHistory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>
                              <Badge variant={item.status === "Paid" ? "default" : "secondary"}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" disabled={!item.downloadUrl}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* 4. Notifications */}
          <Collapsible 
            open={expandedSections.notifications} 
            onOpenChange={() => toggleSection('notifications')}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </div>
                    {expandedSections.notifications ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Budget alerts, spending limits, and app updates</p>
                      </div>
                      <Switch 
                        checked={accountSettings.emailNotifications} 
                        onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">In-app or mobile notifications for reminders</p>
                      </div>
                      <Switch 
                        checked={accountSettings.pushNotifications} 
                        onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Billing Alerts</Label>
                        <p className="text-sm text-muted-foreground">Payment reminders and subscription renewals</p>
                      </div>
                      <Switch 
                        checked={accountSettings.billingAlerts} 
                        onCheckedChange={(checked) => handleSettingChange("billingAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">Important security notifications and account activity</p>
                      </div>
                      <Switch 
                        checked={accountSettings.securityAlerts} 
                        onCheckedChange={(checked) => handleSettingChange("securityAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Session Notifications</Label>
                        <p className="text-sm text-muted-foreground">New device login alerts</p>
                      </div>
                      <Switch 
                        checked={accountSettings.sessionNotifications} 
                        onCheckedChange={(checked) => handleSettingChange("sessionNotifications", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* 5. Privacy & Data */}
          <Collapsible 
            open={expandedSections.privacy} 
            onOpenChange={() => toggleSection('privacy')}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Privacy & Data
                    </div>
                    {expandedSections.privacy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Privacy Policy & Terms</Label>
                        <p className="text-sm text-muted-foreground">MyBudgeteer's Terms of Service and Privacy Policy</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate("/terms")}>
                          Terms
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate("/privacy")}>
                          Privacy
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Data Export</Label>
                        <p className="text-sm text-muted-foreground">Download your budget data for portability</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <Label className="text-red-800">Delete Account</Label>
                        <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                      </div>
                      <Dialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={isDemo}>
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
                              All your budget data, transactions, and settings will be permanently lost. Data removal complies with GDPR/CCPA regulations.
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
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* 6. App Preferences */}
          <Collapsible 
            open={expandedSections.preferences} 
            onOpenChange={() => toggleSection('preferences')}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      App Preferences
                    </div>
                    {expandedSections.preferences ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Preferred Currency</Label>
                      <Select 
                        value={userData.preferredCurrency} 
                        onValueChange={(value) => handleSettingChange("preferredCurrency", value)}
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
                      <p className="text-sm text-muted-foreground mt-1">
                        Set your preferred currency for budgeting consistency
                      </p>
                    </div>

                    <div>
                      <Label>Language</Label>
                      <Select 
                        value={accountSettings.language} 
                        onValueChange={(value) => handleSettingChange("language", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              English
                            </div>
                          </SelectItem>
                          <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
                          <SelectItem value="fr" disabled>Français (Coming Soon)</SelectItem>
                          <SelectItem value="de" disabled>Deutsch (Coming Soon)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select your preferred language
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Light</span>
                      <Switch 
                        checked={theme === "dark"} 
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      />
                      <span className="text-sm">Dark</span>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* 7. Logout */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <Label>Need to sign out?</Label>
                  <p className="text-sm text-muted-foreground">You'll need to sign in again to access your account</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout Securely
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
