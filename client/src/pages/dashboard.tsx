import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopCampaigns } from "@/components/dashboard/top-campaigns";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { AiInsights } from "@/components/dashboard/ai-insights";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { FloatingChat } from "@/components/ai-chat/floating-chat";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: () => api.dashboard.get(),
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome-title">
                Welcome back, {isLoading ? (
                  <Skeleton className="inline-block w-20 h-8" />
                ) : (
                  <>
                    <span>{dashboardData?.user?.firstName || "John"}</span>! 👋
                  </>
                )}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your marketing campaigns today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="secondary" 
                className="flex items-center space-x-2"
                data-testid="button-export-report"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
              <Button 
                className="bg-gradient-to-br from-primary to-blue-500 hover:opacity-90 flex items-center space-x-2"
                data-testid="button-new-campaign"
              >
                <Plus className="h-4 w-4" />
                <span>New Campaign</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          dashboardData && <MetricsCards metrics={dashboardData.metrics} />
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          {isLoading ? (
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
              <Skeleton className="h-6 w-1/3 mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            dashboardData && (
              <RevenueChart data={dashboardData.revenueChartData} />
            )
          )}

          {/* Top Performing Campaigns */}
          {isLoading ? (
            <div className="bg-card border border-border rounded-xl p-6">
              <Skeleton className="h-6 w-1/2 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            dashboardData && (
              <TopCampaigns campaigns={dashboardData.campaigns} />
            )
          )}
        </div>

        {/* Alerts and AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Active Alerts */}
          {isLoading ? (
            <div className="bg-card border border-border rounded-xl p-6">
              <Skeleton className="h-6 w-1/3 mb-6" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 border border-border rounded-lg">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            dashboardData && (
              <AlertsPanel alerts={dashboardData.alerts} />
            )
          )}

          {/* AI Insights */}
          <AiInsights />
        </div>

        {/* Recent Activity */}
        {isLoading ? (
          <div className="bg-card border border-border rounded-xl p-6">
            <Skeleton className="h-6 w-1/4 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          dashboardData && (
            <RecentActivity activities={dashboardData.recentActivity} />
          )
        )}
      </main>

      {/* Floating Chat Bot */}
      <FloatingChat />
    </div>
  );
}
