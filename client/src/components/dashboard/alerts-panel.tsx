import { AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Alert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  createdAt: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'medium':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const getSeverityDotColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-card border border-border animate-slide-up" style={{ animationDelay: "0.7s" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center space-x-2" data-testid="text-alerts-title">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>Active Alerts</span>
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-primary hover:text-primary/80"
            data-testid="button-manage-all-alerts"
          >
            Manage All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.slice(0, 3).map((alert) => (
          <div 
            key={alert.id} 
            className={`flex items-start space-x-3 p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
            data-testid={`alert-${alert.id}`}
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityDotColor(alert.severity)}`}></div>
            <div className="flex-1">
              <p className="font-medium text-sm" data-testid={`text-alert-title-${alert.id}`}>
                {alert.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1" data-testid={`text-alert-message-${alert.id}`}>
                {alert.message}
              </p>
              <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-1">
                <Clock className="h-3 w-3" />
                <span data-testid={`text-alert-time-${alert.id}`}>
                  {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                </span>
              </p>
            </div>
          </div>
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-alerts">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
