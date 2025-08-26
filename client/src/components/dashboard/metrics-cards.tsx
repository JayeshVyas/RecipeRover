import { TrendingUp, TrendingDown, DollarSign, MousePointer, Users, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsCardsProps {
  metrics: {
    totalRevenue: number;
    averageCtr: number;
    totalLeads: number;
    averageRoas: number;
    growthRate: number;
  };
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      gradient: "from-primary to-blue-500",
    },
    {
      title: "Click-Through Rate",
      value: `${metrics.averageCtr.toFixed(2)}%`,
      change: "+8.2%",
      isPositive: true,
      icon: MousePointer,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "New Leads",
      value: metrics.totalLeads.toLocaleString(),
      change: "-2.1%",
      isPositive: false,
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "ROAS",
      value: `${metrics.averageRoas.toFixed(1)}x`,
      change: "+15.7%",
      isPositive: true,
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.title}
            className="bg-card border border-border hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-slide-up relative overflow-hidden group"
            style={{ animationDelay: `${index * 0.1}s` }}
            data-testid={`card-metric-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                </div>
                <span 
                  className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    card.isPositive 
                      ? 'text-green-600 bg-green-500/15 border border-green-500/20' 
                      : 'text-red-600 bg-red-500/15 border border-red-500/20'
                  }`}
                  data-testid={`text-change-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {card.isPositive ? <TrendingUp className="inline h-3 w-3 mr-1" /> : <TrendingDown className="inline h-3 w-3 mr-1" />}
                  {card.change}
                </span>
              </div>
              
              <div className="space-y-1 mb-4">
                <h3 className="text-3xl font-bold tracking-tight" data-testid={`text-value-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {card.value}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>vs. last month</span>
                  <span className={card.isPositive ? 'text-green-600' : 'text-red-600'}>
                    {card.isPositive ? '+' : ''}{card.change}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-1000 ease-out`}
                    style={{ 
                      width: card.isPositive ? '75%' : '45%',
                      animationDelay: `${(index * 0.1) + 0.5}s`
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>

            {/* Decorative corner accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-10 rounded-bl-full`}></div>
          </Card>
        );
      })}
    </div>
  );
}
