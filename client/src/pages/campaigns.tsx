import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Target, DollarSign, Eye, MousePointer } from 'lucide-react';
import { useCampaigns, useCreateCampaign, useUpdateCampaignStatus } from '@/hooks/use-campaigns';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { CreateItemDialog } from '@/components/common/create-item-dialog';
import { ActionButton } from '@/components/common/action-button';
import { StatusManager } from '@/components/common/status-manager';

export default function CampaignsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: campaigns = [], isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaignStatus = useUpdateCampaignStatus();

  // Hardcoded sample campaigns for demo
  const sampleCampaigns = [
    {
      id: '1',
      name: 'Summer Sale 2025',
      platform: 'google-ads',
      budget: 5000,
      spend: 3200,
      impressions: 120000,
      clicks: 4500,
      roas: 3.2,
      status: 'active',
    },
    {
      id: '2',
      name: 'Back to School Meta',
      platform: 'meta',
      budget: 3000,
      spend: 2100,
      impressions: 80000,
      clicks: 3200,
      roas: 2.7,
      status: 'paused',
    },
    {
      id: '3',
      name: 'LinkedIn B2B Outreach',
      platform: 'linkedin',
      budget: 4000,
      spend: 1500,
      impressions: 40000,
      clicks: 1200,
      roas: 1.8,
      status: 'draft',
    },
  ];

  const campaignFields = [
    { name: 'name', label: 'Campaign Name', type: 'text' as const, required: true, placeholder: 'Enter campaign name' },
    { 
      name: 'platform', 
      label: 'Platform', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'google-ads', label: 'Google Ads' },
        { value: 'meta', label: 'Meta Ads' },
        { value: 'linkedin', label: 'LinkedIn Ads' },
        { value: 'tiktok', label: 'TikTok Ads' }
      ]
    },
    { name: 'budget', label: 'Budget ($)', type: 'number' as const, required: true, placeholder: '1000' },
    { name: 'objective', label: 'Objective', type: 'text' as const, required: true, placeholder: 'Lead generation' },
    { name: 'targetAudience', label: 'Target Audience', type: 'textarea' as const, placeholder: 'Describe your target audience...' }
  ];

  const handleCreateCampaign = (data: any) => {
    createCampaign.mutate({
      ...data,
      status: 'draft',
    });
    setIsCreateOpen(false);
  };

  if (isLoading) {
    return <LoadingState type="cards" count={6} />;
  }

  const campaignsToShow = campaigns && campaigns.length > 0 ? campaigns : sampleCampaigns;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">Manage your marketing campaigns across all platforms</p>
        </div>
        <CreateItemDialog
          title="Create New Campaign"
          fields={campaignFields}
          onSubmit={handleCreateCampaign}
          isLoading={createCampaign.isPending}
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button 
              className="bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90"
              data-testid="button-new-campaign"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaignsToShow?.map((campaign: any, index: number) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg leading-none mb-2" data-testid={`text-campaign-name-${index}`}>
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {campaign.platform === 'google-ads' ? '🔍 Google Ads' :
                     campaign.platform === 'meta' ? '📘 Meta' :
                     campaign.platform === 'linkedin' ? '💼 LinkedIn' : '🎵 TikTok'}
                  </p>
                </div>
                <StatusManager 
                  status={campaign.status}
                  onStatusChange={(newStatus) => updateCampaignStatus.mutate({ id: campaign.id, status: newStatus })}
                  disabled={updateCampaignStatus.isPending}
                  testId={`campaign-${index}`}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Budget
                  </p>
                  <p className="font-medium" data-testid={`text-campaign-budget-${index}`}>
                    ${campaign.budget?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    Spend
                  </p>
                  <p className="font-medium" data-testid={`text-campaign-spend-${index}`}>
                    ${campaign.spend?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    Impressions
                  </p>
                  <p className="font-medium" data-testid={`text-campaign-impressions-${index}`}>
                    {campaign.impressions?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center">
                    <MousePointer className="h-3 w-3 mr-1" />
                    Clicks
                  </p>
                  <p className="font-medium" data-testid={`text-campaign-clicks-${index}`}>
                    {campaign.clicks?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">ROAS: </span>
                  <span className="font-semibold text-green-600" data-testid={`text-campaign-roas-${index}`}>
                    {campaign.roas || '0.0'}x
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ActionButton
                    icon={Edit}
                    onClick={() => {}}
                    testId={`button-edit-${index}`}
                  >
                    Edit
                  </ActionButton>
                  <ActionButton
                    icon={Trash2}
                    onClick={() => {}}
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    testId={`button-delete-${index}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns?.length === 0 && (
        <EmptyState
          icon={Target}
          title="No campaigns yet"
          description="Get started by creating your first marketing campaign"
          actionLabel="Create Your First Campaign"
          onAction={() => setIsCreateOpen(true)}
          testId="button-create-first-campaign"
        />
      )}
    </div>
  );
}