'use client';

import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function NotFound() {
  const router = useRouter();

  return (
    <div className='dark:bg-background flex w-full items-center justify-center bg-white text-center'>
      <div className='flex-col items-center justify-center md:flex dark:text-gray-100'>
        <div className='relative'>
          <h1 className='text-muted-foreground/20 text-[150px] font-bold select-none'>404</h1>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <AlertCircle className='text-muted-foreground h-20 w-20' />
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>Page Not Found</h2>
          <p className='text-muted-foreground'>
            Oops! The page you&aspos;re looking for doesn&aspos;t exist or has been moved.
          </p>
        </div>

        <div className='mt-2 flex gap-2'>
          <Button variant='outline' onClick={() => router.back()} className='text-muted-foreground gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
