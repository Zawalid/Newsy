'use client';

import { Star, StarOff, Trash2, MoreHorizontal, Edit, Tag, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';

interface SubscriptionListItemProps {
  subscription: UserSubscriptionWithNewsletter;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUnsubscribe: (subscription: UserSubscriptionWithNewsletter) => void;
  onOpenTagDialog: (subscription: UserSubscriptionWithNewsletter) => void;
}

export function SubscriptionListItem({
  subscription,
  isSelected,
  onToggleSelection,
  onToggleFavorite,
  onUnsubscribe,
  onOpenTagDialog,
}: SubscriptionListItemProps) {
  return (
    <motion.tr
      className='hover:bg-muted/50 border-b transition-colors'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.2,
      }}
      layout
    >
      <td className='p-2'>
        <Checkbox className='rounded-xs' checked={isSelected} onCheckedChange={() => onToggleSelection(subscription.id)} />
      </td>
      <td className='p-2'>
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={subscription.newsletter.faviconUrl || undefined} alt='' />
            <AvatarFallback>{getInitials(subscription.newsletter.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className='flex items-center gap-1 text-sm font-medium'>
              {subscription.customNameForUser || subscription.newsletter.name}
              {subscription.isFavorite && <Star className='h-3 w-3 fill-yellow-500 text-yellow-500' />}
            </div>
            <div className='mt-1 flex flex-col gap-1'>
              {subscription.newsletter.categoryTags && subscription.newsletter.categoryTags.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {subscription.newsletter.categoryTags.map((tag) => (
                    <Badge key={tag} variant='secondary' className='px-1 py-0 text-xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {subscription.userTags && subscription.userTags.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {subscription.userTags.map((tag) => (
                    <Badge key={tag} variant='outline' className='border-primary/30 bg-primary/5 px-1 py-0 text-xs'>
                      <span className='text-primary'>#</span>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className='text-muted-foreground hidden p-2 text-sm md:table-cell'>{subscription.newsletter.address}</td>
      <td className='p-2 text-right'>
        <div className='flex items-center justify-end gap-1'>
          {subscription.status === 'ACTIVE' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={() => onUnsubscribe(subscription)}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-secondary'>
                  <p>Unsubscribe</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={() => onToggleFavorite(subscription.id)}>
                  {subscription.isFavorite ? (
                    <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
                  ) : (
                    <StarOff className='h-4 w-4' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-secondary'>
                <p>{subscription.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenTagDialog(subscription)}>
                <Tag className='mr-2 h-4 w-4' />
                Manage Tags
              </DropdownMenuItem>
              {subscription.newsletter.websiteUrl && (
                <DropdownMenuItem asChild>
                  <a href={subscription.newsletter.websiteUrl} target='_blank' rel='noopener noreferrer'>
                    <ExternalLink className='mr-2 h-4 w-4' />
                    Visit Website
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-destructive'>
                <Trash2 className='mr-2 h-4 w-4' />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </motion.tr>
  );
}
