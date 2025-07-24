import { Menu, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const Header = ({ onMenuClick, sidebarOpen }: HeaderProps) => {
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
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            MyBudgeteer
          </h1>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};