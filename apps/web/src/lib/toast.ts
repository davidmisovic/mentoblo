import { toast } from '@/components/ui/use-toast'

export const showToast = {
  success: (message: string, description?: string) => {
    toast({
      variant: 'success',
      title: message,
      description,
    })
  },
  
  error: (message: string, description?: string) => {
    toast({
      variant: 'destructive',
      title: message,
      description,
    })
  },
  
  info: (message: string, description?: string) => {
    toast({
      title: message,
      description,
    })
  }
}
