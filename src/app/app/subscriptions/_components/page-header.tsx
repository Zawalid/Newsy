'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function PageHeader() {
  return (
    <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <h1 className='text-3xl font-bold'>My Subscriptions</h1>
      <div className='flex gap-2'>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleOpenTagDialog}>
                <TagIcon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  Manage Tags
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-secondary">
              <p>Scan your inbox for new subscriptions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                <span className='hidden sm:inline'>Add Subscription</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-secondary'>
              <p>Manually add a subscription</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
