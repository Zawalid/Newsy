'use client';

import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import root from 'react-shadow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { EmailActions } from './email-actions';
import { sanitize } from '@/lib/utils';
import { formatEmailText } from '@/lib/gmail/utils';

export function EmailDisplay({ email }: { email: Email }) {
  return (
    <>
      <div className='flex h-full flex-col overflow-auto [&_img]:inline-block'>
        <div className='flex flex-1 flex-col'>
          <div className='flex items-baseline justify-between gap-10 p-4'>
            <div className='flex items-start gap-5'>
              <div className='grid gap-4'>
                <h3 className='text-xl font-medium'>{email.subject}</h3>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarImage alt={email.from?.name} />
                    <AvatarFallback>
                      {email.from?.name
                        ?.split(' ')
                        .map((chunk) => chunk[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className=''>
                    <div className='flex items-center gap-2'>
                      <p className='line-clamp-1 text-sm font-bold'>{email.from?.name}</p>
                      <span className='text-xs font-medium'>{`<${email.from?.address}>`}</span>
                    </div>
                    <div className='text-muted-foreground line-clamp-1 text-xs'>
                      <span className='font-medium'>To:</span> {email.to?.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {email.date && (
              <div className='text-muted-foreground text-xs font-medium text-nowrap'>
                {format(new Date(email.date), 'PPpp')}
              </div>
            )}
          </div>
          <Separator />
          <EmailBody body={email.body} />
        </div>
      </div>
      {createPortal(<EmailActions email={email} />, document.getElementById('actions') as HTMLElement)}
    </>
  );
}

export default function EmailBody({ body }: { body: Email['body'] }) {
  if (!body) return null;

  if (body.html)
    return (
      <root.div className='flex-1'>
        <div dangerouslySetInnerHTML={{ __html: sanitize(body.html) || '' }} />
      </root.div>
    );

  if (body.text)
    return (
      <div
        dangerouslySetInnerHTML={{ __html: formatEmailText(body.text || '') }}
        className='text-muted-foreground p-4 text-base leading-relaxed break-words whitespace-pre-wrap'
      ></div>
    );

  return <div className='text-muted-foreground'>No content</div>;
}
