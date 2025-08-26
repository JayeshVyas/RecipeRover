import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  testId?: string;
  tooltip?: string;
  children?: React.ReactNode;
}

export function ActionButton({ 
  icon: Icon, 
  onClick, 
  variant = 'outline',
  size = 'sm',
  className = '',
  testId,
  children
}: ActionButtonProps) {
  return (
    <Button 
      size={size} 
      variant={variant} 
      onClick={onClick}
      className={className}
      data-testid={testId}
    >
      <Icon className="h-3 w-3" />
      {children}
    </Button>
  );
}