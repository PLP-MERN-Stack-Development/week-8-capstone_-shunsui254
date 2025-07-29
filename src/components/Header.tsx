import { Menu, DollarSign, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencySelector } from "@/components/CurrencySelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const Header = ({ onMenuClick, sidebarOpen }: HeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile settings coming soon! This will allow you to update your personal information and preferences.",
    });
  };

  const handleAccountSettingsClick = () => {
    toast({
      title: "Account Settings",
      description: "Account settings coming soon! This will allow you to manage your account preferences, security, and billing.",
    });
  };

  const handleLogoutClick = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been successfully logged out. Redirecting to home page...",
    });
    // Clear any auth tokens/session data here in a real app
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
                  <AvatarImage src="/placeholder-avatar.png" alt="Cecil Bezalel" />
                  <AvatarFallback>CB</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Cecil Bezalel</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Cecilbezalel@gmail.com
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