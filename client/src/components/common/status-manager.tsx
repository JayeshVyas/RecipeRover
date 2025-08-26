import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface StatusManagerProps {
  status: 'active' | 'paused' | 'draft' | 'completed';
  onStatusChange: (newStatus: string) => void;
  disabled?: boolean;
  testId?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    variant: 'default' as const,
    color: 'text-green-600',
    icon: Pause,
    nextStatus: 'paused',
    actionLabel: 'Pause'
  },
  paused: {
    label: 'Paused',
    variant: 'secondary' as const,
    color: 'text-yellow-600',
    icon: Play,
    nextStatus: 'active',
    actionLabel: 'Resume'
  },
  draft: {
    label: 'Draft',
    variant: 'outline' as const,
    color: 'text-gray-600',
    icon: Play,
    nextStatus: 'active',
    actionLabel: 'Activate'
  },
  completed: {
    label: 'Completed',
    variant: 'secondary' as const,
    color: 'text-blue-600',
    icon: Play,
    nextStatus: 'active',
    actionLabel: 'Reactivate'
  }
};

export function StatusManager({ 
  status, 
  onStatusChange, 
  disabled = false,
  testId 
}: StatusManagerProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onStatusChange(config.nextStatus)}
        disabled={disabled}
        data-testid={`${testId}-status-toggle`}
      >
        <Icon className="h-3 w-3" />
      </Button>
    </div>
  );
}