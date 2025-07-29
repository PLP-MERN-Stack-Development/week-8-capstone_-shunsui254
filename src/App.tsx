import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LandingPage } from "@/components/LandingPage";
import { LoginPage } from "@/components/LoginPage";
import { SignUpPage } from "@/components/SignUpPage";
import { TermsPage } from "@/components/TermsPage";
import { PrivacyPage } from "@/components/PrivacyPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageTransition } from "@/components/PageTransition";
import DashboardPage from "./pages/DashboardPage";
import { ProfilePageSimple } from "./pages/ProfilePageSimple";
import { ProfileTestPage } from "./pages/ProfileTestPage";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="mybudgeteer-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <PageTransition loadingMessage="Loading MyBudgeteer...">
                  <LandingPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PageTransition loadingMessage="Preparing login page...">
                  <LoginPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PageTransition loadingMessage="Setting up registration...">
                  <SignUpPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/terms" 
              element={
                <PageTransition loadingMessage="Loading terms of service...">
                  <TermsPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/privacy" 
              element={
                <PageTransition loadingMessage="Loading privacy policy...">
                  <PrivacyPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <PageTransition loadingMessage="Preparing your dashboard..." minLoadTime={1200}>
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                </PageTransition>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PageTransition loadingMessage="Loading your profile..." minLoadTime={800}>
                  <ProtectedRoute>
                    <ProfilePageSimple />
                  </ProtectedRoute>
                </PageTransition>
              } 
            />
            <Route 
              path="/profile-full" 
              element={
                <PageTransition loadingMessage="Loading your profile..." minLoadTime={800}>
                  <ProtectedRoute>
                    <ProfileTestPage />
                  </ProtectedRoute>
                </PageTransition>
              } 
            />
            <Route 
              path="/account-settings" 
              element={
                <PageTransition loadingMessage="Loading account settings..." minLoadTime={800}>
                  <ProtectedRoute>
                    <AccountSettingsPage />
                  </ProtectedRoute>
                </PageTransition>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route 
              path="*" 
              element={
                <PageTransition loadingMessage="Loading page...">
                  <NotFound />
                </PageTransition>
              } 
            />
          </Routes>
        </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
