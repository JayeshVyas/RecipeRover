import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  roas: number;
}

interface TopCampaignsProps {
  campaigns: Campaign[];
}

export function TopCampaigns({ campaigns }: TopCampaignsProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'google_ads':
        return 'bg-gradient-to-br from-primary to-blue-500';
      case 'meta_ads':
        return 'bg-blue-500';
      case 'linkedin_ads':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
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

  const sortedCampaigns = [...campaigns]
    .sort((a, b) => b.roas - a.roas)
    .slice(0, 5);

  return (
    <Card className="bg-card border border-border animate-slide-up" style={{ animationDelay: "0.6s" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold" data-testid="text-top-campaigns-title">Top Campaigns</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-primary hover:text-primary/80"
            data-testid="button-manage-all-campaigns"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCampaigns.map((campaign, index) => (
          <div 
            key={campaign.id} 
            className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
            data-testid={`row-campaign-${campaign.id}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getPlatformColor(campaign.platform)}`}></div>
              <div>
                <p className="font-medium text-sm" data-testid={`text-campaign-name-${campaign.id}`}>
                  {campaign.name}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`text-campaign-platform-${campaign.id}`}>
                  {getPlatformName(campaign.platform)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm" data-testid={`text-campaign-roas-${campaign.id}`}>
                {campaign.roas.toFixed(1)}x
              </p>
              <p className="text-xs text-green-500">ROAS</p>
            </div>
          </div>
        ))}
        
        {sortedCampaigns.length === 0 && (
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-campaigns">
            <p>No campaigns data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
