'use client';

import * as React from 'react';
import { CornerUpRight, MailOpen, MessageSquareDot, MoreHorizontal, Star, Trash2, UserMinus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useEmailActions } from '@/app/app/inbox/_hooks/use-email-actions';
import { useAlert } from '@/hooks/use-alert';
import { useRouter } from 'next/navigation';

export function EmailActions({ email }: { email: Email }) {
  const { markAsRead, markAsUnread, starEmail, unstarEmail, moveToTrash } = useEmailActions();
  const { showAlert, AlertComponent } = useAlert();
  const router = useRouter();

  if (!email) return null;

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='ghost'
        size='icon'
        className='size-8'
        onClick={() => {
          if (email.status.isStarred) unstarEmail(email.id);
          else starEmail(email.id);
        }}
      >
        <Star className={email.status.isStarred ? 'fill-yellow-500 text-yellow-500' : ''} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='size-8'>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-56 p-2'>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                if (email.status.isRead) markAsUnread(email.id);
                else markAsRead(email.id);
              }}
            >
              {email?.status.isRead ? <MessageSquareDot className='mr-2' /> : <MailOpen className='mr-2' />}
              {email?.status.isRead ? 'Mark as unread' : 'Mark as read'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <CornerUpRight className='mr-2' /> Move to
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (email.unsubscribeUrl) router.push(email.unsubscribeUrl);
              }}
            >
              <UserMinus className='mr-2' /> Unsubscribe
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                showAlert({
                  title: 'Confirm Deletion',
                  description: 'Are you sure you want to move this email to trash?',
                  confirmText: 'Confirm',
                  onConfirm: async () => {
                    moveToTrash(email.id, true);
                  },
                });
              }}
            >
              <Trash2 className='mr-2' /> Move to Trash
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertComponent />
    </div>
  );
}
