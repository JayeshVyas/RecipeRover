import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useCampaigns() {
  return useQuery({
    queryKey: ['/api/campaigns'],
    queryFn: () => fetch('/api/campaigns').then(res => res.json()),
  });
}

export function useCreateCampaign() {
  const { toast } = useToast();
  
  return useMutation({
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
      toast({ title: 'Campaign created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create campaign', variant: 'destructive' });
    },
  });
}

export function useUpdateCampaignStatus() {
  const { toast } = useToast();
  
  return useMutation({
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
}