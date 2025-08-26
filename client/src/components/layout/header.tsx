import { ChartLine } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand Only */}
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
        </div>
      </div>
    </header>
  );
}
