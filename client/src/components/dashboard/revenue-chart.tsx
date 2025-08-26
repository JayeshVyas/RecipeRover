import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="lg:col-span-2 bg-card border border-border animate-slide-up shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: "0.5s" }}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent" data-testid="text-chart-title">
              Revenue Overview
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              className="text-xs bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90 transition-opacity"
              data-testid="button-30-days"
            >
              30 Days
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-90-days"
            >
              90 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-72" data-testid="chart-revenue">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="url(#colorGradient)"
                strokeWidth={4}
                dot={{ 
                  fill: "hsl(var(--primary))", 
                  strokeWidth: 3, 
                  stroke: "hsl(var(--background))",
                  r: 7,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                activeDot={{ 
                  r: 10, 
                  fill: "hsl(var(--primary))",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 3,
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                }}
                animationDuration={2000}
                animationEasing="ease-out"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Total Growth: <span className="text-green-500 font-medium">+12.5%</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Best Month: <span className="text-primary font-medium">{data.length > 0 ? data[data.length - 1].month : 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
