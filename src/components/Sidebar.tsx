import { LayoutDashboard, Receipt, PiggyBank, BarChart3, DollarSign, Info, X, ChevronLeft, ChevronRight, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "budgets", label: "Budgets", icon: PiggyBank },
  { id: "currency", label: "Currency", icon: DollarSign },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "advanced-features", label: "Advanced Features", icon: Zap },
  { id: "settings", label: "Account Settings", icon: Settings },
  { id: "about", label: "About", icon: Info },
];

export const Sidebar = ({ activeTab, onTabChange, isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] transform border-r bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "md:w-16" : "md:w-64",
          "w-64" // Mobile always full width when open
        )}
      >
        <div className="flex h-full flex-col">
          {/* Controls Section */}
          <div className="flex items-center justify-between p-4">
            <span className={cn("text-sm font-medium", isCollapsed && "md:hidden", "md:block")}>
              {!isCollapsed ? "Navigation" : ""}
            </span>
            <div className="flex items-center gap-2">
              {/* Desktop collapse toggle */}
              {onToggleCollapse && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onToggleCollapse}
                  className="hidden md:flex"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              )}
              {/* Mobile close button */}
              <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-2">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onTabChange(item.id);
                        onClose();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        isCollapsed && "md:justify-center md:px-2"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className={cn(isCollapsed && "md:hidden")}>
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};