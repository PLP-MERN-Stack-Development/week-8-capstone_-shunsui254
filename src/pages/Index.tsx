import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { TransactionList } from "@/components/TransactionList";
import { BudgetOverview } from "@/components/BudgetOverview";
import { Analytics } from "@/components/Analytics";
import { About } from "@/components/About";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { CurrencyDashboard } from "@/pages/CurrencyDashboard";
import { CurrencyNotifications } from "@/components/CurrencyNotifications";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "transactions":
        return <TransactionList />;
      case "budgets":
        return <BudgetOverview />;
      case "currency":
        return <CurrencyDashboard />;
      case "analytics":
        return <Analytics />;
      case "about":
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-background">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <div className="flex">
          <Sidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-64 transition-all duration-300">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </main>
        </div>
        
        <Footer />
        <CurrencyNotifications />
      </div>
    </CurrencyProvider>
  );
};

export default Index;