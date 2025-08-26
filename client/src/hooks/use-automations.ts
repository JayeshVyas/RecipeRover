import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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

export function useAutomations() {
  return useQuery({
    queryKey: ['/api/automations'],
    queryFn: () => Promise.resolve(mockAutomations), // In real app, this would be an API call
  });
}

export function useCreateAutomation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock implementation - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: Date.now().toString(), ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automations'] });
      toast({ title: 'Automation created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create automation', variant: 'destructive' });
    },
  });
}

export function useUpdateAutomationStatus() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Mock implementation - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automations'] });
      toast({ title: 'Automation status updated' });
    },
  });
}