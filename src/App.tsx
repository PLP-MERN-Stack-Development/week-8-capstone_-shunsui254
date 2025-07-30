/**
 * MyBudgeteer - Main Application Component
 * 
 * This is the root component that sets up the entire application structure,
 * including routing, global providers, and theme management.
 * 
 * Features:
 * - React Query for server state management and caching
 * - React Router for client-side routing
 * - Theme Provider for dark/light mode support
 * - Protected routes for authenticated pages
 * - Page transitions and loading states
 * - Global toast notifications
 * - Tooltip provider for enhanced UX
 * 
 * Architecture:
 * - Uses QueryClient for optimized data fetching
 * - Implements route-based code splitting
 * - Provides consistent loading and error states
 * - Maintains authentication state across routes
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

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
import { AdvancedFeaturesPage } from "./pages/AdvancedFeaturesPage";
import NotFound from "./pages/NotFound";

/**
 * Configure React Query Client for optimal performance
 * - Reduces unnecessary API calls
 * - Implements intelligent caching strategy
 * - Optimizes user experience with background updates
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // Data considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000,        // Cache cleanup after 10 minutes
      retry: 1,                       // Single retry on failure
      refetchOnWindowFocus: false,    // Prevent unnecessary refetches
    },
  },
});

/**
 * Main App Component
 * Sets up global providers and routing structure
 */
const App = () => {
  // Debug logging for production
  console.log('MyBudgeteer App starting...')
  console.log('Environment:', import.meta.env.MODE)
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('Node Environment:', import.meta.env.NODE_ENV)
  
  return (
    <QueryClientProvider client={queryClient}>
      {/* Theme Provider - Enables dark/light mode switching */}
      <ThemeProvider defaultTheme="system" storageKey="mybudgeteer-ui-theme">
        {/* Tooltip Provider - Enables tooltips throughout the app */}
        <TooltipProvider>
          {/* Toast Notifications - Global notification system */}
          <Toaster />
          <Sonner />
          
          {/* Router Configuration - Defines all application routes */}
          <BrowserRouter>
            <Routes>
            {/* Public Routes - Accessible without authentication */}
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
                <PageTransition loadingMessage="Preparing your dashboard..." minLoadTime={200}>
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                </PageTransition>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PageTransition loadingMessage="Loading your profile..." minLoadTime={200}>
                  <ProtectedRoute>
                    <ProfilePageSimple />
                  </ProtectedRoute>
                </PageTransition>
              } 
            />
            <Route 
              path="/profile-full" 
              element={
                <PageTransition loadingMessage="Loading your profile..." minLoadTime={200}>
                  <ProtectedRoute>
                    <ProfileTestPage />
                  </ProtectedRoute>
                </PageTransition>
              } 
            />
            <Route 
              path="/account-settings" 
              element={
                <PageTransition loadingMessage="Loading account settings..." minLoadTime={200}>
                  <ProtectedRoute>
                    <AccountSettingsPage />
                  </ProtectedRoute>
                </PageTransition>
              } 
            />
            <Route 
              path="/advanced-features" 
              element={
                <PageTransition loadingMessage="Loading advanced features..." minLoadTime={200}>
                  <ProtectedRoute>
                    <AdvancedFeaturesPage />
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
  )
}

export default App;
