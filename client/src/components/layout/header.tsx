import { Bell, Sun, Moon, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  
  const { data: dashboardData } = useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: () => api.dashboard.get(),
  });

  const { data: alertsData } = useQuery({
    queryKey: ["/api/alerts"],
    queryFn: () => api.alerts.list(),
  });

  const unreadCount = alertsData?.filter((alert: any) => !alert.isRead).length || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ChartLine className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  MarketingAI
                </span>
                <span className="text-xs text-muted-foreground -mt-1">Insights Platform</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="#" 
                className="text-foreground hover:text-primary transition-all duration-200 font-medium relative group"
                data-testid="nav-dashboard"
              >
                Dashboard
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform scale-x-100 transition-transform duration-200"></div>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
                data-testid="nav-campaigns"
              >
                Campaigns
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
                data-testid="nav-analytics"
              >
                Analytics
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
                data-testid="nav-automations"
              >
                Automations
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </a>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-accent transition-colors"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              )}
            </Button>
            
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent transition-colors relative"
                data-testid="button-notifications"
              >
                <Bell className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                )}
              </Button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
                alt="User avatar" 
                className="w-8 h-8 rounded-full border border-border"
                data-testid="img-user-avatar"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium" data-testid="text-user-name">
                  {dashboardData?.user ? `${dashboardData.user.firstName} ${dashboardData.user.lastName}` : "John Martinez"}
                </p>
                <p className="text-xs text-muted-foreground">Marketing Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
