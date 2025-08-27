import LandingPage from "@/pages/landing";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppLayout } from "@/components/layout/app-layout";
import Dashboard from "@/pages/dashboard";
import CampaignsPage from "@/pages/campaigns";
import AnalyticsPage from "@/pages/analytics";
import AutomationsPage from "@/pages/automations";
import NotFound from "@/pages/not-found";
import FloatingChat from "@/components/ai-chat/floating-chat";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/campaigns" component={CampaignsPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route path="/automations" component={AutomationsPage} />
        <Route component={NotFound} />
      </Switch>
      <FloatingChat />
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
