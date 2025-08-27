import { ChartLine, LayoutDashboard, BarChart2, Zap, Layers, Bell, User, Palette, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ChartLine className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Accelaro
                </span>
                <span className="text-xs text-muted-foreground -mt-1">AI Marketing Platform</span>
              </div>
            </div>
          </div>
          
          {/* Conditional Navigation - only show if user is authenticated */}
          {user && (
            <nav className="flex items-center space-x-2">
              <Button variant={location === "/dashboard" ? "secondary" : "ghost"} size="sm" onClick={() => navigate("/dashboard")} className="flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
              <Button variant={location === "/campaigns" ? "secondary" : "ghost"} size="sm" onClick={() => navigate("/campaigns")} className="flex items-center gap-1">
                <Layers className="h-4 w-4" /> Campaigns
              </Button>
              <Button variant={location === "/analytics" ? "secondary" : "ghost"} size="sm" onClick={() => navigate("/analytics")} className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" /> Analytics
              </Button>
              <Button variant={location === "/automations" ? "secondary" : "ghost"} size="sm" onClick={() => navigate("/automations")} className="flex items-center gap-1">
                <Zap className="h-4 w-4" /> Automations
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={toggleTheme}>
                <Palette className="h-4 w-4" /> Theme: {theme === "dark" ? "Dark" : "Light"}
              </Button>
              
              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 relative">
                    <Bell className="h-4 w-4" />
                    {/* Notification dot */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[260px]">
                  <div className="flex items-center justify-between px-2 py-1 border-b border-border">
                    <span className="font-semibold text-sm">Notifications</span>
                    <Button variant="link" size="sm" className="text-xs px-2 py-0 h-6" onClick={() => {/* dummy mark all read */}}>
                      Mark all as read
                    </Button>
                  </div>
                  <DropdownMenuItem>
                    <span className="font-semibold">New campaign created</span>
                    <span className="ml-2 text-xs text-muted-foreground">Just now</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="font-semibold">Budget alert: Campaign X</span>
                    <span className="ml-2 text-xs text-muted-foreground">5 min ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="font-semibold">AI insight available</span>
                    <span className="ml-2 text-xs text-muted-foreground">10 min ago</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> 
                    {user.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
