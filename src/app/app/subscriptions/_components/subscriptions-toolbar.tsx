'use client';

import { Search, Grid3x3, List, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SubscriptionsToolbarProps {
  totalCount: number;
  filteredCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SubscriptionsToolbar({
  totalCount,
  filteredCount,
  viewMode,
  setViewMode,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: SubscriptionsToolbarProps) {
  return (
    <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
      <div className='text-muted-foreground text-sm'>
        {filteredCount} of {totalCount} subscriptions
      </div>
      <div className='flex flex-wrap gap-2'>
        <div className='border-border/50 flex rounded-full border p-0.5'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className={cn('h-8 w-8 rounded-full',viewMode === 'grid' ? 'bg-accent' : '')}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-secondary'>
                <p>Grid View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className={cn('h-8 w-8 rounded-full',viewMode === 'list' ? 'bg-accent' : '')}
                  onClick={() => setViewMode('list')}
                >
                  <List className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-secondary'>
                <p>List View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-[180px]'>
            <div className='flex items-center'>
              <Filter className='mr-2 h-4 w-4' />
              <SelectValue placeholder='Filter by status' />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Subscriptions</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='unsubscribed'>Unsubscribed</SelectItem>
            <SelectItem value='ignored'>Ignored</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className='w-[180px]'>
            <div className='flex items-center'>
              {sortBy.includes('asc') ? <SortAsc className='mr-2 h-4 w-4' /> : <SortDesc className='mr-2 h-4 w-4' />}
              <SelectValue placeholder='Sort by' />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name-asc'>Name (A-Z)</SelectItem>
            <SelectItem value='name-desc'>Name (Z-A)</SelectItem>
            <SelectItem value='date-added-newest'>Date Added (Newest)</SelectItem>
            <SelectItem value='date-added-oldest'>Date Added (Oldest)</SelectItem>
            {/* <SelectItem value='last-email-newest'>Last Email (Newest)</SelectItem> */}
            {/* <SelectItem value='last-email-oldest'>Last Email (Oldest)</SelectItem> */}
          </SelectContent>
        </Select>

        <div className='relative w-full md:w-64'>
          <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
          <Input
            type='search'
            placeholder='Search subscriptions...'
            className='w-full pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
