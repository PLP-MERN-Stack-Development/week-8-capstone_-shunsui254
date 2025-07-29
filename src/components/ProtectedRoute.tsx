import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface User {
  email: string;
  name: string;
  loginTime: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("mybudgeteer_user");
        
        if (!userStr) {
          navigate("/login");
          return;
        }

        const userData = JSON.parse(userStr) as User;
        
        // Check if session is still valid (optional: implement session timeout)
        const loginTime = new Date(userData.loginTime);
        const now = new Date();
        const sessionDuration = now.getTime() - loginTime.getTime();
        const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionDuration > maxSessionDuration) {
          localStorage.removeItem("mybudgeteer_user");
          navigate("/login");
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem("mybudgeteer_user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pulse">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Loading MyBudgeteer</h2>
            <p className="text-muted-foreground text-center">
              Please wait while we verify your session...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};
