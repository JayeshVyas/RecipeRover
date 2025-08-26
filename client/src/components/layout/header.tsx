import { Bell, Sun, Moon, ChartLine, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/use-theme";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { api } from "@/lib/api";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  
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
              <Link 
                to="/" 
                className={`${location === '/' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-all duration-200 relative group`}
                data-testid="nav-dashboard"
              >
                Dashboard
                <div className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform ${location === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-200`}></div>
              </Link>
              <Link 
                to="/campaigns" 
                className={`${location === '/campaigns' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-all duration-200 relative group`}
                data-testid="nav-campaigns"
              >
                Campaigns
                <div className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform ${location === '/campaigns' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-200`}></div>
              </Link>
              <Link 
                to="/analytics" 
                className={`${location === '/analytics' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-all duration-200 relative group`}
                data-testid="nav-analytics"
              >
                Analytics
                <div className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform ${location === '/analytics' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-200`}></div>
              </Link>
              <Link 
                to="/automations" 
                className={`${location === '/automations' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-all duration-200 relative group`}
                data-testid="nav-automations"
              >
                Automations
                <div className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-500 transform ${location === '/automations' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-200`}></div>
              </Link>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent transition-colors relative"
                  data-testid="button-notifications"
                >
                  <Bell className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-red-500 hover:bg-red-600"
                      data-testid="badge-notification-count"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="border-b border-border px-4 py-3">
                  <h4 className="text-sm font-semibold">Notifications</h4>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alertsData && alertsData.length > 0 ? (
                    alertsData.map((alert: any, index: number) => (
                      <div 
                        key={alert.id} 
                        className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${
                          !alert.isRead ? 'bg-primary/5' : ''
                        }`}
                        data-testid={`notification-item-${index}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            alert.severity === 'high' ? 'bg-red-500' :
                            alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium" data-testid={`notification-message-${index}`}>
                              {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {alert.type} • {new Date(alert.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
                {alertsData && alertsData.length > 0 && (
                  <div className="border-t border-border p-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs" 
                      data-testid="button-mark-all-read"
                    >
                      Mark all as read
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

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
