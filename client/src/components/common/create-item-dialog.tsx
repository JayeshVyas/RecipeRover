import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface CreateItemDialogProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  isLoading?: boolean;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateItemDialog({ 
  title, 
  fields, 
  onSubmit, 
  isLoading = false,
  trigger,
  isOpen,
  onOpenChange
}: CreateItemDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : localOpen;
  const setOpen = onOpenChange || setLocalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const data: Record<string, any> = {};
    fields.forEach(field => {
      const value = formData.get(field.name);
      if (field.type === 'number') {
        data[field.name] = value ? parseFloat(value as string) : 0;
      } else {
        data[field.name] = value;
      }
    });
    
    onSubmit(data);
  };

  const defaultTrigger = (
    <Button 
      className="bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90"
      data-testid="button-create-new"
    >
      <Plus className="h-4 w-4 mr-2" />
      Create New
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              
              {field.type === 'select' ? (
                <Select name={field.name} required={field.required}>
                  <SelectTrigger data-testid={`select-${field.name}`}>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  data-testid={`textarea-${field.name}`}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  data-testid={`input-${field.name}`}
                />
              )}
            </div>
          ))}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="button-create"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}