import { toast } from '@/hooks/use-toast';

export function showSuccessToast(message: string) {
  toast({
    title: message,
  });
}

export function showErrorToast(message: string) {
  toast({
    title: message,
    variant: 'destructive',
  });
}

export function showInfoToast(title: string, description?: string) {
  toast({
    title,
    description,
  });
}

export function showWarningToast(message: string) {
  toast({
    title: message,
    variant: 'destructive',
  });
}