'use client';

import { X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: APIError['error'];
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className='container mx-auto max-w-7xl px-4 py-6'>
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='bg-destructive/10 mb-4 rounded-full p-6'>
          <X className='text-destructive h-12 w-12' />
        </div>
        <h2 className='mb-2 text-2xl font-bold'>Oops! Something Went Wrong</h2>
        <p className='text-muted-foreground mb-6 max-w-md'>
          {error.message ||
            "We couldn't load your subscriptions. Please try again or contact support if the problem persists."}
        </p>
        <Button>
          <RefreshCw className='mr-2 h-4 w-4' />
          Retry
        </Button>
      </div>
    </div>
  );
}
