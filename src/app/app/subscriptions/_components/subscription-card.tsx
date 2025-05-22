import { useState } from 'react';
import { Star, StarOff, Trash2, ExternalLink, MoreHorizontal, Edit, Tag, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { HoverEffect } from '@/components/ui/hover-effect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { getInitials } from '@/lib/utils';

// Maximum number of tags to display before showing a "more" badge
const MAX_VISIBLE_TAGS = 3;

interface SubscriptionCardProps {
  subscription: UserSubscriptionWithNewsletter;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUnsubscribe: (subscription: UserSubscriptionWithNewsletter) => void;
  onOpenTagDialog: (subscription: UserSubscriptionWithNewsletter) => void;
}

export function SubscriptionCard({
  subscription,
  isSelected,
  onToggleSelection,
  onToggleFavorite,
  onUnsubscribe,
  onOpenTagDialog,
}: SubscriptionCardProps) {
  const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState(false);

  const categoryTags = subscription.newsletter.categoryTags || [];
  const visibleCategoryTags = categoryTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCategoryTags = categoryTags.slice(MAX_VISIBLE_TAGS);
  const hasHiddenCategoryTags = hiddenCategoryTags.length > 0;

  const userTags = subscription.userTags || [];
  const visibleUserTags = userTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenUserTags = userTags.slice(MAX_VISIBLE_TAGS);
  const hasHiddenUserTags = hiddenUserTags.length > 0;

  const showMoreButton = hasHiddenCategoryTags || hasHiddenUserTags;

  return (
      <HoverEffect as={Card} className="h-full flex flex-col">
        <CardContent className='relative flex-1 p-0'>
          <div className='p-4'>
            <div className='flex items-start gap-3'>
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelection(subscription.id)}
                className='data-[state=checked]:border-primary mt-1 rounded-none border-inherit'
              />
              <div className='min-w-0 flex-1'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='mb-1 flex min-w-0 flex-1 items-center gap-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={subscription.newsletter.faviconUrl || undefined} alt='' />
                      <AvatarFallback>{getInitials(subscription.newsletter.name)}</AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='truncate font-medium'>
                          {subscription.customNameForUser || subscription.newsletter.name}
                        </p>
                      </div>
                      <p className='text-muted-foreground mt-1 truncate text-xs'>{subscription.newsletter.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleFavorite(subscription.id)}
                    className='text-muted-foreground :text-yellow-500 transition-colors'
                  >
                    {subscription.isFavorite ? (
                      <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
                    ) : (
                      <StarOff className='h-4 w-4' />
                    )}
                  </button>
                </div>

                <div className='mt-3 flex flex-col gap-2'>
                  {categoryTags.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {visibleCategoryTags.map((tag) => (
                        <Badge key={tag} variant='secondary' className='px-2 py-1 text-xs backdrop-blur-sm'>
                          #{tag}
                        </Badge>
                      ))}

                      {userTags.length > 0 &&
                        visibleUserTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant='outline'
                            className='border-primary/30 bg-primary/5 px-2 py-1 text-xs'
                          >
                            <span className='text-primary'>#</span>
                            {tag}
                          </Badge>
                        ))}

                      {showMoreButton && (
                        <Popover open={isTagsPopoverOpen} onOpenChange={setIsTagsPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Badge
                              variant='secondary'
                              className='hover:bg-secondary/80 cursor-pointer px-2 py-1 text-xs backdrop-blur-sm'
                            >
                              <Plus className='mr-1 h-3 w-3' />
                              {hiddenCategoryTags.length + hiddenUserTags.length} more
                            </Badge>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-2' align='start'>
                            <div className='space-y-2'>
                              {hiddenCategoryTags.length > 0 && (
                                <div className='space-y-1'>
                                  <h4 className='text-muted-foreground text-xs font-medium'>Category Tags</h4>
                                  <div className='flex flex-wrap gap-1'>
                                    {hiddenCategoryTags.map((tag) => (
                                      <Badge key={tag} variant='secondary' className='px-2 py-1 text-xs'>
                                        #{tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {hiddenUserTags.length > 0 && (
                                <div className='space-y-1'>
                                  <h4 className='text-muted-foreground text-xs font-medium'>Your Tags</h4>
                                  <div className='flex flex-wrap gap-1'>
                                    {hiddenUserTags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant='outline'
                                        className='border-primary/30 bg-primary/5 px-2 py-1 text-xs'
                                      >
                                        <span className='text-primary'>#</span>
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  )}

                  {categoryTags.length === 0 && userTags.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {visibleUserTags.map((tag) => (
                        <Badge key={tag} variant='outline' className='border-primary/30 bg-primary/5 px-2 py-1 text-xs'>
                          <span className='text-primary'>#</span>
                          {tag}
                        </Badge>
                      ))}

                      {hasHiddenUserTags && (
                        <Popover open={isTagsPopoverOpen} onOpenChange={setIsTagsPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Badge
                              variant='outline'
                              className='border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer px-2 py-1 text-xs'
                            >
                              <Plus className='mr-1 h-3 w-3' />
                              {hiddenUserTags.length} more
                            </Badge>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-2' align='start'>
                            <div className='space-y-1'>
                              <h4 className='text-muted-foreground text-xs font-medium'>Your Tags</h4>
                              <div className='flex flex-wrap gap-1'>
                                {hiddenUserTags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant='outline'
                                    className='border-primary/30 bg-primary/5 px-2 py-1 text-xs'
                                  >
                                    <span className='text-primary'>#</span>
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  )}
                </div>

                {subscription.newsletter.description && (
                  <p className='text-muted-foreground mt-2 line-clamp-2 text-sm'>
                    {subscription.newsletter.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='mt-auto border-t p-0'>
          <div className='flex w-full'>
            {subscription.status === 'ACTIVE' && (
              <Button
                variant='ghost'
                className='h-10 flex-1 rounded-none text-xs'
                onClick={() => onUnsubscribe(subscription)}
              >
                <Trash2 className='mr-1 h-3 w-3' />
                Unsubscribe
              </Button>
            )}

            {subscription.newsletter.websiteUrl && (
              <Button variant='ghost' className='h-10 flex-1 rounded-none text-xs' asChild>
                <a href={subscription.newsletter.websiteUrl} target='_blank' rel='noopener noreferrer'>
                  <ExternalLink className='mr-1 h-3 w-3' />
                  Visit Site
                </a>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-10 rounded-none'>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-destructive'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </HoverEffect>
  );
}
