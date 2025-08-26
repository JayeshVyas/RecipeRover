import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Zap, Settings, Clock, TrendingUp, AlertTriangle, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface Automation {
  id: string;
  name: string;
  type: 'bid_adjustment' | 'budget_reallocation' | 'pause_underperforming' | 'keyword_optimization';
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  action: string;
  lastRun?: string;
  runsCount: number;
  createdAt: string;
}

const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'Auto Pause Low ROAS Campaigns',
    type: 'pause_underperforming',
    status: 'active',
    trigger: 'ROAS < 2.0 for 3 days',
    action: 'Pause campaign and send alert',
    lastRun: '2025-01-26T10:30:00Z',
    runsCount: 12,
    createdAt: '2025-01-20T09:00:00Z'
  },
  {
    id: '2',
    name: 'Increase Budget for High Performers',
    type: 'budget_reallocation',
    status: 'active',
    trigger: 'ROAS > 4.0 and spend < 80% of budget',
    action: 'Increase budget by 20%',
    lastRun: '2025-01-26T08:15:00Z',
    runsCount: 8,
    createdAt: '2025-01-22T14:30:00Z'
  },
  {
    id: '3',
    name: 'Bid Adjustment for Peak Hours',
    type: 'bid_adjustment',
    status: 'paused',
    trigger: 'Time between 9 AM - 5 PM',
    action: 'Increase bids by 15%',
    runsCount: 156,
    createdAt: '2025-01-18T11:00:00Z'
  },
  {
    id: '4',
    name: 'Keyword Performance Optimizer',
    type: 'keyword_optimization',
    status: 'draft',
    trigger: 'Keyword CTR < 2% for 7 days',
    action: 'Add as negative keyword',
    runsCount: 0,
    createdAt: '2025-01-25T16:45:00Z'
  }
];

export default function AutomationsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const { data: automations = mockAutomations } = useQuery({
    queryKey: ['/api/automations'],
    queryFn: () => Promise.resolve(mockAutomations), // Mock data for now
  });

  const updateAutomationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Mock API call
      return Promise.resolve({ id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automations'] });
      toast({ title: 'Automation status updated' });
    },
  });

  const createAutomation = useMutation({
    mutationFn: async (data: any) => {
      // Mock API call
      return Promise.resolve({ ...data, id: Date.now().toString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automations'] });
      setIsCreateOpen(false);
      toast({ title: 'Automation created successfully' });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bid_adjustment': return <TrendingUp className="h-4 w-4" />;
      case 'budget_reallocation': return <Settings className="h-4 w-4" />;
      case 'pause_underperforming': return <AlertTriangle className="h-4 w-4" />;
      case 'keyword_optimization': return <Zap className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bid_adjustment': return 'bg-blue-500';
      case 'budget_reallocation': return 'bg-green-500';
      case 'pause_underperforming': return 'bg-red-500';
      case 'keyword_optimization': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCreateAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    createAutomation.mutate({
      name: formData.get('name'),
      type: formData.get('type'),
      trigger: formData.get('trigger'),
      action: formData.get('action'),
      status: 'draft',
      runsCount: 0,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Automations
            </h1>
            <p className="text-muted-foreground mt-1">Automated rules and optimizations for your campaigns</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90"
                data-testid="button-new-automation"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Automation
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Automation</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleCreateAutomation} className="space-y-4">
                <div>
                  <Label htmlFor="name">Automation Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Enter automation name" 
                    required 
                    data-testid="input-automation-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Automation Type</Label>
                  <Select name="type" required>
                    <SelectTrigger data-testid="select-automation-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bid_adjustment">Bid Adjustment</SelectItem>
                      <SelectItem value="budget_reallocation">Budget Reallocation</SelectItem>
                      <SelectItem value="pause_underperforming">Pause Underperforming</SelectItem>
                      <SelectItem value="keyword_optimization">Keyword Optimization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="trigger">Trigger Condition</Label>
                  <Textarea 
                    id="trigger" 
                    name="trigger" 
                    placeholder="e.g., ROAS < 2.0 for 3 days" 
                    required 
                    data-testid="textarea-trigger"
                  />
                </div>
                
                <div>
                  <Label htmlFor="action">Action to Take</Label>
                  <Textarea 
                    id="action" 
                    name="action" 
                    placeholder="e.g., Pause campaign and send alert" 
                    required 
                    data-testid="textarea-action"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createAutomation.isPending}
                    data-testid="button-create-automation"
                  >
                    {createAutomation.isPending ? 'Creating...' : 'Create Automation'}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Active</span>
              </div>
              <p className="text-2xl font-bold" data-testid="text-active-count">
                {automations.filter(a => a.status === 'active').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                  <Pause className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Paused</span>
              </div>
              <p className="text-2xl font-bold" data-testid="text-paused-count">
                {automations.filter(a => a.status === 'paused').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Total Runs</span>
              </div>
              <p className="text-2xl font-bold" data-testid="text-total-runs">
                {automations.reduce((sum, a) => sum + a.runsCount, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">This Week</span>
              </div>
              <p className="text-2xl font-bold" data-testid="text-week-runs">42</p>
            </CardContent>
          </Card>
        </div>

        {/* Automations List */}
        <div className="space-y-4">
          {automations.map((automation, index) => (
            <Card 
              key={automation.id}
              className="bg-card border border-border hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`card-automation-${automation.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${getTypeColor(automation.type)} flex items-center justify-center text-white`}>
                      {getTypeIcon(automation.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg" data-testid={`text-automation-name-${index}`}>
                          {automation.name}
                        </h3>
                        <Badge 
                          variant={
                            automation.status === 'active' ? 'default' : 
                            automation.status === 'paused' ? 'secondary' : 'outline'
                          }
                          data-testid={`badge-automation-status-${index}`}
                        >
                          {automation.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Trigger: </span>
                          <span className="text-foreground" data-testid={`text-trigger-${index}`}>
                            {automation.trigger}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Action: </span>
                          <span className="text-foreground" data-testid={`text-action-${index}`}>
                            {automation.action}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold" data-testid={`text-runs-count-${index}`}>
                        {automation.runsCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Runs</p>
                    </div>
                    
                    {automation.lastRun && (
                      <div className="text-center">
                        <p className="text-sm font-medium" data-testid={`text-last-run-${index}`}>
                          {new Date(automation.lastRun).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Last run</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={automation.status === 'active'}
                        onCheckedChange={(checked) => 
                          updateAutomationStatus.mutate({
                            id: automation.id,
                            status: checked ? 'active' : 'paused'
                          })
                        }
                        disabled={updateAutomationStatus.isPending}
                        data-testid={`switch-automation-status-${index}`}
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        data-testid={`button-edit-automation-${index}`}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {automations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No automations yet</h3>
            <p className="text-muted-foreground mb-4">Create automated rules to optimize your campaigns 24/7</p>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90"
              data-testid="button-create-first-automation"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Automation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}