import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, DollarSign, ArrowLeft, LogIn, Mail, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useToast } from "@/hooks/use-toast";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error and reset failed attempts when user starts typing
    if (error) {
      setError("");
      setFailedAttempts(0);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setLoginProgress(0);
    setError("");

    try {
      // Simulate authentication progress
      setLoginProgress(20);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLoginProgress(50);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setLoginProgress(80);
      // Simulate API call - In a real app, this would be an actual authentication request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoginProgress(95);
      
      // Mock authentication logic
      const mockUsers = [
        { 
          email: "demo@mybudgeteer.com", 
          password: "demo123", 
          name: "Demo Alpha User",
          firstName: "Demo",
          surname: "User",
          otherName: "Alpha",
          phoneNumber: "+1 (555) 123-4567",
          preferredCurrency: "USD",
          profilePicture: "",
          createdAt: "2024-01-15T08:30:00.000Z"
        },
        { 
          email: "cecil@mybudgeteer.com", 
          password: "admin123", 
          name: "Cecil Bezalel",
          firstName: "Cecil",
          surname: "Bezalel",
          otherName: "",
          phoneNumber: "+1 (555) 987-6543",
          preferredCurrency: "EUR",
          profilePicture: "",
          createdAt: "2023-12-01T10:15:00.000Z"
        }
      ];

      const user = mockUsers.find(u => 
        u.email.toLowerCase() === formData.email.toLowerCase() && 
        u.password === formData.password
      );

      if (user) {
        setLoginProgress(100);
        
        // Store user session (in a real app, you'd use proper session management)
        localStorage.setItem("mybudgeteer_user", JSON.stringify({
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          surname: user.surname,
          otherName: user.otherName,
          phoneNumber: user.phoneNumber,
          preferredCurrency: user.preferredCurrency,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
          loginTime: new Date().toISOString()
        }));

        // Store demo account preferences
        const demoPreferences = {
          budgetType: user.email === "demo@mybudgeteer.com" ? "family" : "business",
          budgetPeriod: user.email === "demo@mybudgeteer.com" ? "monthly" : "weekly",
          emailNotifications: true,
          pushNotifications: true,
          language: "en",
          currency: user.preferredCurrency
        };
        localStorage.setItem("mybudgeteer_preferences", JSON.stringify(demoPreferences));
        
        // Set currency for the app
        localStorage.setItem("selectedCurrency", user.preferredCurrency);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });

        // Short delay to show 100% progress
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setLoginProgress(0);
        setFailedAttempts(prev => prev + 1);
        
        // Invalid credentials - stay on login page with helpful messaging
        const attempts = failedAttempts + 1;
        let errorMessage = "Invalid email or password. Please check your credentials and try again.";
        
        if (attempts >= 3) {
          errorMessage = `Invalid credentials. ${attempts} failed attempts. Please double-check your email and password, or try using the demo account.`;
        } else if (attempts >= 2) {
          errorMessage = "Invalid credentials. Please verify your email and password are correct.";
        }
        
        setError(errorMessage);
        
        // Clear password field for security
        setFormData(prev => ({
          ...prev,
          password: ""
        }));
        
        // Show toast notification
        toast({
          title: "Login Failed",
          description: attempts >= 3 ? "Multiple failed attempts. Please check your credentials carefully." : "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoginProgress(0);
    } finally {
      setLoading(false);
      setLoginProgress(0);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      setError("Please enter your email address first");
      return;
    }
    
    toast({
      title: "Password Reset",
      description: "Password reset instructions have been sent to your email (Demo mode)",
    });
  };

  const handleFillDemoCredentials = () => {
    setFormData({
      email: "demo@mybudgeteer.com",
      password: "demo123"
    });
    setError("");
    setFailedAttempts(0);
    
    toast({
      title: "Demo Credentials Filled",
      description: "You can now click 'Sign In' to access the demo account.",
    });
  };

  return (
    <>
      {loading && (
        <LoadingScreen 
          message="Authenticating your account..." 
          progress={loginProgress} 
        />
      )}
      
      <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">MyBudgeteer</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={handleBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              Sign in to your MyBudgeteer account
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 h-auto text-sm"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 h-auto text-sm"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up here
                  </Button>
                </p>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className={`mt-6 p-4 rounded-lg transition-colors ${
              failedAttempts >= 2 
                ? 'bg-blue-50 border-2 border-blue-200' 
                : 'bg-muted/50'
            }`}>
              <p className={`text-xs font-medium mb-2 ${
                failedAttempts >= 2 
                  ? 'text-blue-800' 
                  : 'text-muted-foreground'
              }`}>
                {failedAttempts >= 2 ? '💡 Try Demo Credentials:' : 'Demo Credentials:'}
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-mono">Email: demo@mybudgeteer.com</p>
                <p className="font-mono">Password: demo123</p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Complete profile: Demo Alpha User - Family budget setup
                </p>
                {failedAttempts >= 2 && (
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleFillDemoCredentials}
                      className="w-full text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
                    >
                      Fill Demo Credentials
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Security Notice */}
      <footer className="border-t bg-card py-4">
        <div className="container px-4">
          <p className="text-xs text-center text-muted-foreground">
            🔒 We take your security seriously. Your information is protected with enterprise-grade encryption.
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};
