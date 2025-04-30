'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, ArrowRight, Check, InboxIcon, RefreshCw, Mail } from 'lucide-react';
import { ScanProgressInfo } from '@/components/scan-progress-info';

interface NewsletterScannerProps {
  onComplete?: (results: Newsletter[]) => void;
  maxResults?: number;
  useCache?: boolean;
  incrementalScan?: boolean;
}

// Initial blank progress state
const initialProgress: ScanProgress = {
  scannedCount: 0,
  totalToScan: 0,
  newslettersFound: 0,
  percentComplete: 0,
  elapsedTime: 0,
  status: 'initializing',
};

export function NewsletterScanner({ onComplete }: NewsletterScannerProps) {
  const [progress, setProgress] = useState<ScanProgress>(initialProgress);
  const [error, setError] = useState<string | null>(null);

  // Use React Query to fetch newsletters
  const {
    data: newsletters = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      setProgress({ ...initialProgress, status: 'scanning' });
      setError(null);

      const response = await fetch('/api/emails/scan');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan newsletters');
      }

      const data = await response.json();

      // Update progress with completion data
      setProgress({
        scannedCount: data.length > 0 ? 500 : 0, // Approximation
        totalToScan: 500,
        newslettersFound: data.length,
        percentComplete: 100,
        elapsedTime: 0, // We don't know the actual time from the API
        status: 'completed',
      });

      if (onComplete) {
        onComplete(data);
      }

      return data;
    },
    enabled: false, // Don't run automatically on mount
  });

  const isScanning = isLoading;
  const scanComplete = newsletters.length > 0 && !isScanning;

  const startScan = () => {
    refetch();
  };

  // Handle React Query errors
  if (isError && queryError instanceof Error) {
    setError(queryError.message);
  }

  return (
    <div className='space-y-6'>
      <Card className='overflow-hidden'>
        <div className='flex flex-col gap-4 p-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <InboxIcon className='h-5 w-5 text-blue-500' />
              <h3 className='text-lg font-semibold'>Newsletter Scanner</h3>
            </div>

            {!isScanning && !scanComplete && (
              <Button onClick={startScan} className='flex items-center gap-2'>
                Scan Inbox
                <ArrowRight className='h-4 w-4' />
              </Button>
            )}

            {!isScanning && scanComplete && (
              <Button onClick={startScan} variant='outline' className='flex items-center gap-2'>
                <RefreshCw className='h-4 w-4' />
                Scan Again
              </Button>
            )}

            {isScanning && (
              <Button disabled className='flex items-center gap-2'>
                <RefreshCw className='h-4 w-4 animate-spin' />
                Scanning...
              </Button>
            )}
          </div>

          {isScanning && <ScanProgressInfo progress={progress} />}

          {error && (
            <div className='flex items-center gap-3 rounded-md bg-red-50 p-3 text-red-700'>
              <AlertCircle className='h-5 w-5' />
              <p>{error}</p>
            </div>
          )}

          {scanComplete && (
            <div className='flex items-center gap-3 rounded-md bg-green-50 p-3 text-green-700'>
              <Check className='h-5 w-5' />
              <p>Found {newsletters.length} newsletters after scanning.</p>
            </div>
          )}

          {!isScanning && !scanComplete && !error && (
            <div className='flex items-center gap-3 rounded-md bg-amber-50 p-3 text-amber-700'>
              <AlertTriangle className='h-5 w-5' />
              <p>Click {'Scan Inbox'} to analyze your emails and find newsletters.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Newsletter Cards */}
      {scanComplete && newsletters.length > 0 && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {newsletters.map((newsletter: Newsletter) => (
            <Card key={newsletter.id} className='overflow-hidden transition-shadow hover:shadow-md'>
              <div className='flex items-start space-x-3 p-4'>
                <div className='flex-shrink-0'>
                  {newsletter.faviconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={newsletter.faviconUrl}
                      alt={`${newsletter.name} logo`}
                      className='h-10 w-10 rounded'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='16' x='2' y='4' rx='2'/%3E%3Cpath d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className='flex h-10 w-10 items-center justify-center rounded bg-blue-100'>
                      <Mail className='h-6 w-6 text-blue-500' />
                    </div>
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <h4 className='truncate text-sm font-semibold'>{newsletter.name}</h4>
                  <p className='truncate text-xs text-gray-500'>{newsletter.address}</p>
                  {newsletter.unsubscribeUrl && (
                    <a
                      href={newsletter.unsubscribeUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='mt-1 inline-block text-xs text-blue-500 hover:underline'
                    >
                      Unsubscribe
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
