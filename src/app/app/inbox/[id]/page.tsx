'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { EmailDisplay } from '../_components/email-display';
import { EmailDisplaySkeleton } from '../_components/loading-skeletons';
import { useEmail } from '../_hooks/use-emails';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const { email, error, isLoading } = useEmail(id);

  useDocumentTitle(email?.subject, isLoading, error, { notFoundTitle: 'Email Not Found' });

  if (isLoading) return <EmailDisplaySkeleton />;
  if (error) return error.code === 404 ? <EmailNotFound /> : <Error />;
  if (!email) return <EmailNotFound />;

  return <EmailDisplay email={email} />;
}

function EmailNotFound() {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <Image src='/404.png' alt='Email not found' width={350} height={200} />
      <div className='space-y-1.5'>
        <h4 className='text-foreground text-center text-xl font-bold'>Email Not Found</h4>
        <p className='text-muted-foreground text-center'>
          We couldn&apos;t find the email you were looking for. It might have been moved or deleted.
        </p>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <Image src='/error.png' alt='Email not found' width={200} height={200} />
      <div className='space-y-1.5'>
        <h4 className='text-foreground text-center text-xl font-bold'>Oops! Something went wrong</h4>
        <p className='text-muted-foreground text-center'>
          There was an error loading the email. Please try again later.
        </p>
      </div>
    </div>
  );
}
