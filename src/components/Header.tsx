import { Menu, DollarSign, User, Settings, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencySelector } from "@/components/CurrencySelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { isDemoAccount } from "@/lib/userUtils";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

interface User {
  email: string;
  name?: string;
  fullName?: string;
  loginTime: string;
}

export const Header = ({ onMenuClick, sidebarOpen }: HeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userStr = localStorage.getItem("mybudgeteer_user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr) as User;
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.fullName || user.name || user.email.split("@")[0];
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAccountSettingsClick = () => {
    navigate("/account-settings");
  };

  const isDemo = isDemoAccount(user?.email);

  const handleDeleteAccount = () => {
    if (isDemo) {
      toast({
        title: "Cannot Delete Demo Account",
        description: "The demo account cannot be deleted. Please create your own account to test this feature.",
        variant: "destructive",
      });
      return;
    }

    // Clear all user data
    localStorage.removeItem("mybudgeteer_user");
    localStorage.removeItem("selectedCurrency");
    localStorage.removeItem("theme");
    
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted. All data has been removed.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const handleLogoutClick = () => {
    // Clear user session
    localStorage.removeItem("mybudgeteer_user");
    
    toast({
      title: "Logged out successfully",
      description: "You have been successfully logged out. Redirecting to home page...",
    });
    
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-14 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 ml-2 md:ml-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold">
            MyBudgeteer
          </h1>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <CurrencySelector />
          <ThemeToggle />
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.png" alt={getUserDisplayName()} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAccountSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Delete Account Option */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-destructive hover:text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Account</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {isDemo ? (
                        "The demo account cannot be deleted. This protects the demo data for other users to test the application."
                      ) : (
                        "This action cannot be undone. This will permanently delete your account and remove all of your data from our servers including transaction history, budgets, and preferences."
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDemo}
                    >
                      {isDemo ? "Cannot Delete Demo" : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutClick}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};