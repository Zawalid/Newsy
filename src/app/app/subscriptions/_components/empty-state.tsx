'use client';

import { Inbox, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState() {
  return (
    <div className='container mx-auto max-w-7xl px-4 py-6'>
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='bg-primary/10 mb-4 rounded-full p-6'>
          <Inbox className='text-primary h-12 w-12' />
        </div>
        <h2 className='mb-2 text-2xl font-bold'>Your Subscription Slate is Clean!</h2>
        <p className='text-muted-foreground mb-6 max-w-md'>
          We haven&apos;t found any newsletter subscriptions in your inbox yet. Let&apos;s scan your inbox to discover
          your subscriptions.
        </p>
        <div className='flex flex-wrap justify-center gap-4'>
          <Button variant='outline'>
            <Plus className='mr-2 h-4 w-4' />
            Add Subscription Manually
          </Button>
        </div>
      </div>
    </div>
  );
}
