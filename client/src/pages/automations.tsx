import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Clock, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { useAutomations, useCreateAutomation, useUpdateAutomationStatus } from '@/hooks/use-automations';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { CreateItemDialog } from '@/components/common/create-item-dialog';
import { ActionButton } from '@/components/common/action-button';
import { StatusManager } from '@/components/common/status-manager';

export default function AutomationsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: automations = [], isLoading } = useAutomations();
  const createAutomation = useCreateAutomation();
  const updateAutomationStatus = useUpdateAutomationStatus();

  const automationFields = [
    { name: 'name', label: 'Automation Name', type: 'text' as const, required: true, placeholder: 'Enter automation name' },
    { 
      name: 'type', 
      label: 'Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'bid_adjustment', label: 'Bid Adjustment' },
        { value: 'budget_reallocation', label: 'Budget Reallocation' },
        { value: 'pause_underperforming', label: 'Pause Underperforming' },
        { value: 'keyword_optimization', label: 'Keyword Optimization' }
      ]
    },
    { name: 'trigger', label: 'Trigger Condition', type: 'text' as const, required: true, placeholder: 'ROAS < 2.0 for 3 days' },
    { name: 'action', label: 'Action', type: 'textarea' as const, required: true, placeholder: 'Describe what action to take...' }
  ];

  const handleCreateAutomation = (data: any) => {
    createAutomation.mutate({
      ...data,
      status: 'draft',
      runsCount: 0,
      createdAt: new Date().toISOString()
    });
    setIsCreateOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bid_adjustment': return TrendingUp;
      case 'budget_reallocation': return AlertTriangle;
      case 'pause_underperforming': return Clock;
      case 'keyword_optimization': return Settings;
      default: return Zap;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bid_adjustment': return 'text-blue-600';
      case 'budget_reallocation': return 'text-orange-600';
      case 'pause_underperforming': return 'text-red-600';
      case 'keyword_optimization': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return <LoadingState type="list" count={4} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Automations
          </h1>
          <p className="text-muted-foreground mt-1">Set up automated rules to optimize your campaigns 24/7</p>
        </div>
        
        <CreateItemDialog
          title="Create New Automation"
          fields={automationFields}
          onSubmit={handleCreateAutomation}
          isLoading={createAutomation.isPending}
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button 
              className="bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90"
              data-testid="button-new-automation"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Automation
            </Button>
          }
        />
      </div>

      <div className="space-y-4">
        {automations.map((automation: any, index: number) => {
          const TypeIcon = getTypeIcon(automation.type);
          
          return (
            <Card key={automation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-muted ${getTypeColor(automation.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" data-testid={`text-automation-name-${index}`}>
                          {automation.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {automation.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground font-medium mb-1">Trigger</p>
                        <p className="text-sm" data-testid={`text-automation-trigger-${index}`}>
                          {automation.trigger}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium mb-1">Action</p>
                        <p className="text-sm" data-testid={`text-automation-action-${index}`}>
                          {automation.action}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Runs:</span> {automation.runsCount}
                      </div>
                      {automation.lastRun && (
                        <div>
                          <span className="font-medium">Last run:</span> {new Date(automation.lastRun).toLocaleDateString()}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Created:</span> {new Date(automation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-4">
                    <StatusManager 
                      status={automation.status}
                      onStatusChange={(newStatus) => updateAutomationStatus.mutate({ id: automation.id, status: newStatus })}
                      disabled={updateAutomationStatus.isPending}
                      testId={`automation-${index}`}
                    />
                    <ActionButton
                      icon={Settings}
                      onClick={() => {}}
                      testId={`button-edit-automation-${index}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {automations.length === 0 && (
        <EmptyState
          icon={Zap}
          title="No automations yet"
          description="Create automated rules to optimize your campaigns 24/7"
          actionLabel="Create Your First Automation"
          onAction={() => setIsCreateOpen(true)}
          testId="button-create-first-automation"
        />
      )}
    </div>
  );
}