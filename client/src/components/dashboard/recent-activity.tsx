import { Play, Edit, Settings } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: string;
  message: string;
  platform: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'campaign_start':
        return Play;
      case 'campaign_update':
        return Edit;
      case 'settings_change':
        return Settings;
      default:
        return Play;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'campaign_start':
        return 'bg-gradient-to-br from-primary to-blue-500';
      case 'campaign_update':
        return 'bg-blue-500';
      case 'settings_change':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'campaign_start':
        return 'text-green-500 bg-green-500/10';
      case 'campaign_update':
        return 'text-blue-500 bg-blue-500/10';
      case 'settings_change':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusText = (type: string) => {
    switch (type.toLowerCase()) {
      case 'campaign_start':
        return 'Active';
      case 'campaign_update':
        return 'Updated';
      case 'settings_change':
        return 'Modified';
      default:
        return 'Completed';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'google_ads':
        return 'Google Ads';
      case 'meta_ads':
        return 'Meta Ads';
      case 'linkedin_ads':
        return 'LinkedIn Ads';
      default:
        return platform;
    }
  };

  return (
    <Card className="bg-card border border-border animate-slide-up" style={{ animationDelay: "0.9s" }}>
      <CardHeader>
        <h3 className="text-lg font-semibold" data-testid="text-recent-activity-title">Recent Activity</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.slice(0, 5).map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div 
              key={activity.id} 
              className="flex items-center space-x-4 py-3 border-b border-border last:border-b-0"
              data-testid={`activity-${activity.id}`}
            >
              <div className={`w-8 h-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" data-testid={`text-activity-message-${activity.id}`}>
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`text-activity-details-${activity.id}`}>
                  {getPlatformName(activity.platform)} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
              <span 
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.type)}`}
                data-testid={`text-activity-status-${activity.id}`}
              >
                {getStatusText(activity.type)}
              </span>
            </div>
          );
        })}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-activity">
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
