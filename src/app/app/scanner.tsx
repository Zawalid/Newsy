/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Inbox, Loader2, Search, Trash2, AlertCircle, RefreshCw, CheckCircle2, X, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Define the expected shape of the status response
type ScanStatusResponse = {
  id: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  emailsProcessedCount: number;
  totalEmailsToScan: number;
  newslettersFoundCount: number;
  error?: string;
  result?: Newsletter[];
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
};

const startScan = async (): Promise<{ message: string; jobId: number }> => {
  const res = await fetch('/api/scan/start', { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to start scan');
  }
  return res.json();
};

export function NewsletterScanner() {
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [deletedNewsletters, setDeletedNewsletters] = useState<Set<string>>(new Set());
  const [scanStatus, setScanStatus] = useState<ScanStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeJobId) return;

    const eventSource = new EventSource(`/api/scan/status?jobId=${activeJobId}`);

    // Event listeners for different SSE events
    eventSource.addEventListener('job-status', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SSE status update:', data);
        setScanStatus(data);
        setError(null);
      } catch (e) {
        console.error('Error parsing SSE status data:', e);
      }
    });

    eventSource.addEventListener('job-completed', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SSE job completed:', data);
        setScanStatus(data);
        setError(null);
        eventSource.close();
      } catch (e) {
        console.error('Error parsing SSE completed data:', e);
      }
    });

    eventSource.addEventListener('job-error', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.error('SSE job error:', data);
        setError(data.message || 'An error occurred during scanning');
        setScanStatus((prev) => (prev ? { ...prev, status: 'FAILED', error: data.message } : null));
        eventSource.close();
      } catch (e) {
        console.error('Error parsing SSE error data:', e);
      }
    });

    // Generic error handler
    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      setError('Connection error. Please try again.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [activeJobId]);

  // Mutation for starting the scan
  const startScanMutation = useMutation({
    mutationFn: startScan,
    onSuccess: (data) => {
      console.log('Scan started, Job ID:', data.jobId);
      setActiveJobId(data.jobId);
      setDeletedNewsletters(new Set());
      setError(null);
      toast.success('Scan started', { description: "We're now scanning your inbox for newsletters." });
    },
    onError: (error: Error) => {
      console.error('Error starting scan:', error);
      setError(error.message);
      toast.error('Error starting scan', { description: error.message });
    },
  });

  // Derived state for UI display
  const progressDetails = useMemo(() => {
    if (!scanStatus || !scanStatus.startedAt) return null;

    const { emailsProcessedCount, totalEmailsToScan, newslettersFoundCount, startedAt, status } = scanStatus;

    const startTime = new Date(startedAt).getTime();
    const elapsedTime = Math.max(0.001, (Date.now() - startTime) / 1000); // in seconds
    const percentComplete = totalEmailsToScan > 0 ? (emailsProcessedCount / totalEmailsToScan) * 100 : 0;
    const processingSpeed = elapsedTime > 0 ? emailsProcessedCount / elapsedTime : 0; // emails per second

    let estimatedTimeRemaining: number | undefined = undefined;
    if (
      status !== 'COMPLETED' &&
      status !== 'FAILED' &&
      processingSpeed > 0.01 &&
      emailsProcessedCount > 10 &&
      totalEmailsToScan > emailsProcessedCount
    ) {
      estimatedTimeRemaining = (totalEmailsToScan - emailsProcessedCount) / processingSpeed;
      // Cap / smooth estimation near end
      if (percentComplete > 98 || estimatedTimeRemaining < 1) {
        estimatedTimeRemaining = 0;
      }
    }

    // Simple formatting for display
    const formatTime = (seconds: number | undefined): string => {
      if (seconds === undefined || seconds < 0) return '-';
      if (seconds === 0) return '<1s';
      if (seconds < 60) return `${Math.ceil(seconds)}s`;
      return `${Math.ceil(seconds / 60)}m`;
    };

    return {
      percent: percentComplete.toFixed(1),
      processed: emailsProcessedCount,
      total: totalEmailsToScan,
      found: newslettersFoundCount,
      elapsed: formatTime(elapsedTime),
      remaining: formatTime(estimatedTimeRemaining),
      status: status,
    };
  }, [scanStatus]);

  const handleStartScan = () => {
    startScanMutation.mutate();
  };

  const handleDeleteNewsletter = (address: string) => {
    setDeletedNewsletters((prev) => {
      const updated = new Set(prev);
      updated.add(address);
      return updated;
    });

    toast.success('Newsletter removed', { description: 'The newsletter has been removed from your list.' });
  };

  const filteredNewsletters = useMemo(() => {
    if (!scanStatus?.result) return [];
    return scanStatus.result.filter((newsletter) => !deletedNewsletters.has(newsletter.address));
  }, [scanStatus?.result, deletedNewsletters]);

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
          <div>
            <h1 className='mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Newsletter Discovery
            </h1>
            <p className='max-w-2xl text-gray-600 dark:text-gray-300'>
              Find and organize all your newsletter subscriptions in one place. We&apos;ll securely scan your inbox and
              help you manage your reading.
            </p>
          </div>

          {!activeJobId && (
            <Button
              onClick={handleStartScan}
              disabled={startScanMutation.isPending}
              size='lg'
              className='rounded-xl bg-blue-600 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md'
            >
              {startScanMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Starting...
                </>
              ) : (
                <>
                  <Search className='mr-2 h-5 w-5' /> Scan My Inbox
                </>
              )}
            </Button>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            >
              <AlertCircle className='h-5 w-5 flex-shrink-0' />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Progress */}
        <AnimatePresence>
          {activeJobId &&
            progressDetails &&
            progressDetails.status !== 'COMPLETED' &&
            progressDetails.status !== 'FAILED' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className='overflow-hidden rounded-xl border border-gray-200 shadow-md dark:border-gray-800'>
                  <CardContent className='p-0'>
                    {/* Progress Header */}
                    <div className='border-b border-gray-200 bg-gradient-to-r from-blue-500/10 to-blue-500/5 p-6 dark:border-gray-800 dark:from-blue-500/20 dark:to-blue-500/10'>
                      <div className='flex items-center gap-4'>
                        <div className='rounded-full bg-blue-100 p-3 dark:bg-blue-900/50'>
                          <RefreshCw className='h-6 w-6 animate-spin text-blue-600 dark:text-blue-400' />
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Scanning Your Inbox</h3>
                          <p className='text-gray-600 dark:text-gray-300'>
                            Found {progressDetails.found} newsletters so far
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Content */}
                    <div className='space-y-6 p-6'>
                      {/* Progress Stats */}
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50'>
                          <div className='mb-1 text-sm text-gray-500 dark:text-gray-400'>Emails Scanned</div>
                          <div className='text-2xl font-semibold text-gray-900 dark:text-white'>
                            {progressDetails.processed.toLocaleString()}
                            <span className='ml-1 text-sm font-normal text-gray-500 dark:text-gray-400'>
                              / {progressDetails.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className='rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50'>
                          <div className='mb-1 text-sm text-gray-500 dark:text-gray-400'>Newsletters Found</div>
                          <div className='text-2xl font-semibold text-gray-900 dark:text-white'>
                            {progressDetails.found}
                          </div>
                        </div>
                        <div className='rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50'>
                          <div className='mb-1 text-sm text-gray-500 dark:text-gray-400'>Time</div>
                          <div className='text-2xl font-semibold text-gray-900 dark:text-white'>
                            {progressDetails.elapsed}
                            {progressDetails.remaining !== '-' && (
                              <span className='ml-1 text-sm font-normal text-gray-500 dark:text-gray-400'>
                                (est. {progressDetails.remaining} remaining)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {progressDetails.status === 'PENDING' ? 'Initializing...' : 'Scanning in progress'}
                          </div>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {Number.parseFloat(progressDetails.percent).toFixed(0)}%
                          </div>
                        </div>
                        <Progress value={Number.parseFloat(progressDetails.percent)} className='h-2' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {scanStatus?.status === 'COMPLETED' && filteredNewsletters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <div className='flex items-center justify-between'>
                <h2 className='flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white'>
                  <CheckCircle2 className='h-6 w-6 text-green-500' />
                  <span>Found {filteredNewsletters.length} Newsletters</span>
                </h2>
                <Button
                  onClick={handleStartScan}
                  variant='outline'
                  className='border border-gray-200 dark:border-gray-800'
                >
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Scan Again
                </Button>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <AnimatePresence>
                  {filteredNewsletters.map((newsletter, index) => (
                    <NewsletterCard
                      key={newsletter.address}
                      newsletter={newsletter}
                      index={index}
                      onDelete={() => handleDeleteNewsletter(newsletter.address)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        <AnimatePresence>
          {scanStatus?.status === 'COMPLETED' && filteredNewsletters.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='py-12 text-center'
            >
              <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <Inbox className='h-8 w-8 text-gray-500 dark:text-gray-400' />
              </div>
              <h3 className='mb-2 text-xl font-medium text-gray-900 dark:text-white'>No Newsletters Found</h3>
              <p className='mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300'>
                We couldn&apos;t find any newsletters in your inbox. Try scanning again or check a different email
                account.
              </p>
              <Button onClick={handleStartScan} className='bg-blue-600 text-white hover:bg-blue-700'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Scan Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Failed Scan */}
        <AnimatePresence>
          {scanStatus?.status === 'FAILED' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='py-12 text-center'
            >
              <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
                <X className='h-8 w-8 text-red-600 dark:text-red-400' />
              </div>
              <h3 className='mb-2 text-xl font-medium text-gray-900 dark:text-white'>Scan Failed</h3>
              <p className='mx-auto mb-6 max-w-md text-red-600 dark:text-red-400'>
                {scanStatus.error || 'An error occurred while scanning your inbox.'}
              </p>
              <Button onClick={handleStartScan} className='bg-blue-600 text-white hover:bg-blue-700'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!activeJobId && !scanStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col items-center justify-center py-16 text-center'
            >
              <div className='mb-6 rounded-full bg-blue-100 p-6 dark:bg-blue-900/30'>
                <Inbox className='h-12 w-12 text-blue-600 dark:text-blue-400' />
              </div>
              <h2 className='mb-3 text-2xl font-bold text-gray-900 dark:text-white'>
                Discover Your Newsletter Subscriptions
              </h2>
              <p className='mb-8 max-w-lg text-gray-600 dark:text-gray-300'>
                Find all your newsletter subscriptions with a quick inbox scan. We&apos;ll help you organize your
                reading and manage your subscriptions in one place.
              </p>
              <Button
                onClick={handleStartScan}
                disabled={startScanMutation.isPending}
                size='lg'
                className='rounded-xl bg-blue-600 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md'
              >
                {startScanMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Starting...
                  </>
                ) : (
                  <>
                    <Search className='mr-2 h-5 w-5' /> Start Scanning
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Newsletter Card Component
function NewsletterCard({
  newsletter,
  index,
  onDelete,
}: {
  newsletter: Newsletter;
  index: number;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * Math.min(index, 5) }}
    >
      <Card className='h-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
        <CardContent className='p-0'>
          <div className='p-5'>
            <div className='flex items-start gap-4'>
              {/* Logo */}
              <div className='flex-shrink-0'>
                {newsletter.faviconUrl ? (
                  <div className='relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700'>
                    <img
                      src={newsletter.faviconUrl || '/placeholder.svg'}
                      alt={`${newsletter.name} logo`}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Crect width='20' height='16' x='2' y='4' rx='2'/%3E%3Cpath d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                ) : (
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-lg font-bold text-white dark:from-teal-600 dark:to-teal-700'>
                    {newsletter.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className='min-w-0 flex-1'>
                <h3 className='mb-0.5 truncate text-base font-medium text-slate-900 dark:text-white'>
                  {newsletter.name}
                </h3>
                <p className='truncate text-sm text-slate-500 dark:text-slate-400'>{newsletter.address}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-between border-t border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50'>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-2 text-slate-600 dark:text-slate-300'
              onClick={onDelete}
            >
              <Trash2 className='h-4 w-4' />
              <span className='sr-only'>Delete</span>
            </Button>

            {newsletter.unsubscribeUrl ? (
              <a
                href={newsletter.unsubscribeUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:hover:bg-teal-900/60'
              >
                Unsubscribe
                <ExternalLink className='h-3 w-3' />
              </a>
            ) : (
              <Badge variant='outline' className='text-xs'>
                No unsubscribe link
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
