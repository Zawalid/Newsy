'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmailsListSkeleton } from './loading-skeletons';
import { useQueryState } from 'nuqs';

function renderEmptyState(filter: string, query: string) {
  const emptyState: Record<string, { alt: string; heading: string; description: string }> = {
    'is:unread': {
      alt: 'No unread emails',
      heading: 'You’re all set! 🎉 No unread emails waiting for you.',
      description: 'Take a break or explore something new while waiting for updates.',
    },
    'is:important': {
      alt: 'No important emails',
      heading: 'No important emails found.',
      description: 'Mark emails as important to easily find them here.',
    },
    'is:starred': {
      alt: 'No starred emails',
      heading: 'No starred emails yet.',
      description: 'Star emails to easily find them later.',
    },
    'is:read': {
      alt: 'No read emails',
      heading: 'You haven’t read any emails yet.',
      description: 'Check your inbox and catch up on your messages.',
    },
    '': {
      alt: 'No emails',
      heading: 'No emails found.',
      description: 'Try adjusting your filters or search for something else.',
    },
    'no-results': {
      alt: 'No results found',
      heading: `No results found for "${query}"`,
      description: 'Try searching for something else or adjust your filters.',
    },
  };

  const { alt, heading, description } = emptyState[query.length ? 'no-results' : filter];

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-3'>
      <Image src={query.length ? '/no-results.png' : '/empty-inbox.png'} alt={alt} width={160} height={160} />
      <div className='space-y-1.5'>
        <h4 className='text-foreground text-center font-medium'>{heading}</h4>
        <p className='text-muted-foreground text-center text-sm'>{description}</p>
      </div>
    </div>
  );
}
type EmailsListProps = {
  emails: Email[];
  isLoading: boolean;
  filter: string;
};
export function EmailsList({ emails, isLoading, filter }: EmailsListProps) {
  const { id } = useParams();
  const [query] = useQueryState('q', { defaultValue: '' });
  const [parent] = useAutoAnimate();
  const searchParams = useSearchParams();

  if (isLoading) return <EmailsListSkeleton />;
  if (!emails.length) return renderEmptyState(filter, query.trim());

  return (
    <ScrollArea className='h-[calc(100vh-220px)] flex-1'>
      <div className='flex flex-col gap-2' ref={parent}>
        {emails.map((email) => (
          <Link
            href={`/app/inbox/${email.id}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
            key={email.id}
            className={cn(
              'hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all',
              id === email.id && 'bg-muted'
            )}
          >
            <div className='flex w-full flex-col gap-1'>
              <div className='flex items-center'>
                <div className='flex items-center gap-2'>
                  <HighlightText className='font-bold' text={email.from?.name || ''} query={query} />
                  {!email.status.isRead && <span className='flex h-2 w-2 rounded-full bg-blue-600' />}
                </div>
                <div className={cn('ml-auto text-xs', id === email.id ? 'text-foreground' : 'text-muted-foreground')}>
                  {email.date &&
                    formatDistanceToNow(new Date(email.date), {
                      addSuffix: true,
                    })}
                </div>
              </div>
              <HighlightText
                className='line-clamp-1 text-xs font-medium text-wrap'
                text={email.subject || ''}
                query={query}
              />
            </div>
            <HighlightText
              className='text-muted-foreground line-clamp-2 text-xs break-all whitespace-normal'
              text={email.snippet}
              query={query}
            />
            {/* Labels List */}
            <div className='flex flex-wrap gap-1'>
              {email.labels
                ?.filter((label) => !['INBOX', 'UNREAD', 'STARRED'].includes(label) && !label.startsWith('CATEGORY_'))
                .map((label) => (
                  <span key={label} className='bg-accent text-foreground rounded-sm px-2 py-1 text-xs font-medium'>
                    {label}
                  </span>
                ))}
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}

interface HighlightTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  query: string;
}

function HighlightText({ text, query, ...props }: HighlightTextProps) {
  if (!query.trim()) return <span {...props}>{text}</span>;

  console.log(query);

  const regex = new RegExp(`(${query.trim()})`, 'gi');
  const parts = text.split(regex);

  return (
    <span {...props}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <span key={index} className='bg-yellow-300 px-1 py-[1px] text-black'>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}
