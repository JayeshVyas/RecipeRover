import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Play, Pause, Edit, Trash2, Target, DollarSign, Eye, MousePointer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import type { Campaign } from '@/shared/schema';

export default function CampaignsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['/api/campaigns'],
  });

  const createCampaign = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create campaign');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      setIsCreateOpen(false);
      toast({ title: 'Campaign created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create campaign', variant: 'destructive' });
    },
  });

  const updateCampaignStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/campaigns/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update campaign');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      toast({ title: 'Campaign status updated' });
    },
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    createCampaign.mutate({
      name: formData.get('name'),
      platform: formData.get('platform'),
      budget: parseFloat(formData.get('budget') as string),
      objective: formData.get('objective'),
      targetAudience: formData.get('targetAudience'),
      status: 'draft',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Campaigns
            </h1>
            <p className="text-muted-foreground mt-1">Manage your marketing campaigns across all platforms</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90"
                data-testid="button-new-campaign"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Enter campaign name" 
                    required 
                    data-testid="input-campaign-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select name="platform" required>
                    <SelectTrigger data-testid="select-platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google-ads">Google Ads</SelectItem>
                      <SelectItem value="meta">Meta Ads</SelectItem>
                      <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                      <SelectItem value="tiktok">TikTok Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input 
                    id="budget" 
                    name="budget" 
                    type="number" 
                    step="0.01" 
                    placeholder="1000.00" 
                    required 
                    data-testid="input-budget"
                  />
                </div>
                
                <div>
                  <Label htmlFor="objective">Campaign Objective</Label>
                  <Select name="objective" required>
                    <SelectTrigger data-testid="select-objective">
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="awareness">Brand Awareness</SelectItem>
                      <SelectItem value="traffic">Website Traffic</SelectItem>
                      <SelectItem value="conversions">Conversions</SelectItem>
                      <SelectItem value="leads">Lead Generation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea 
                    id="targetAudience" 
                    name="targetAudience" 
                    placeholder="Describe your target audience..." 
                    data-testid="textarea-audience"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createCampaign.isPending}
                    data-testid="button-create-campaign"
                  >
                    {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign: Campaign, index: number) => (
            <Card 
              key={campaign.id} 
              className="bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`card-campaign-${campaign.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1" data-testid={`text-campaign-name-${index}`}>
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={campaign.platform === 'google-ads' ? 'default' : 'secondary'}
                        data-testid={`badge-platform-${index}`}
                      >
                        {campaign.platform === 'google-ads' && '🔍 Google Ads'}
                        {campaign.platform === 'meta' && '📘 Meta'}
                        {campaign.platform === 'linkedin' && '💼 LinkedIn'}
                        {campaign.platform === 'tiktok' && '🎵 TikTok'}
                      </Badge>
                      <Badge 
                        variant={
                          campaign.status === 'active' ? 'default' : 
                          campaign.status === 'paused' ? 'secondary' : 'outline'
                        }
                        data-testid={`badge-status-${index}`}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={campaign.status === 'active' ? 'secondary' : 'default'}
                    onClick={() => updateCampaignStatus.mutate({
                      id: campaign.id,
                      status: campaign.status === 'active' ? 'paused' : 'active'
                    })}
                    disabled={updateCampaignStatus.isPending}
                    data-testid={`button-toggle-status-${index}`}
                  >
                    {campaign.status === 'active' ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      Budget
                    </div>
                    <span className="font-medium" data-testid={`text-budget-${index}`}>
                      ${campaign.budget?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      Impressions
                    </div>
                    <span className="font-medium" data-testid={`text-impressions-${index}`}>
                      {campaign.impressions?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MousePointer className="h-3 w-3" />
                      Clicks
                    </div>
                    <span className="font-medium" data-testid={`text-clicks-${index}`}>
                      {campaign.clicks?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="h-3 w-3" />
                      Conversions
                    </div>
                    <span className="font-medium" data-testid={`text-conversions-${index}`}>
                      {campaign.conversions?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ROAS</span>
                      <span className={`font-semibold ${
                        (campaign.roas || 0) >= 3 ? 'text-green-500' : 
                        (campaign.roas || 0) >= 2 ? 'text-yellow-500' : 'text-red-500'
                      }`} data-testid={`text-roas-${index}`}>
                        {campaign.roas ? `${campaign.roas}x` : '0x'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1" data-testid={`button-edit-${index}`}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" data-testid={`button-delete-${index}`}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first marketing campaign</p>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90"
              data-testid="button-create-first-campaign"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}