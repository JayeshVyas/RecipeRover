import { Header } from "./header";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Show header only if user is authenticated OR if not on landing page
  const showHeader = user || location !== '/';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {showHeader && <Header />}
      <main>
        {children}
      </main>
    </div>
  );
}