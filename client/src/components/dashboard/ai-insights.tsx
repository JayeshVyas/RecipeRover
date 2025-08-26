import { Bot, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function AiInsights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["/api/ai/insights"],
    queryFn: () => api.ai.insights(),
  });

  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'optimization':
        return Lightbulb;
      case 'trend':
        return TrendingUp;
      default:
        return Bot;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-primary/10 border-primary/20 text-primary';
      case 'medium':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'low':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border border-border animate-slide-up" style={{ animationDelay: "0.8s" }}>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Insights</span>
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border border-border rounded-lg">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border animate-slide-up" style={{ animationDelay: "0.8s" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center space-x-2" data-testid="text-ai-insights-title">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Insights</span>
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-primary hover:text-primary/80"
            data-testid="button-view-all-insights"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights?.insights?.slice(0, 2).map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${getInsightColor(insight.priority)}`}
              data-testid={`insight-${index}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="h-4 w-4 mt-1" />
                <div>
                  <p className="font-medium text-sm" data-testid={`text-insight-title-${index}`}>
                    {insight.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1" data-testid={`text-insight-description-${index}`}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        {!insights?.insights?.length && (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-insights">
            <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Generating insights...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
