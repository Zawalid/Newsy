'use client';

import { motion } from 'motion/react';
import { ArrowRight, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NoNewslettersFound } from './no-newsletters-found';
import { NewsletterItem } from './scanning-components';

interface ScanCompletedProps {
  scanResponse: ScanResponse;
  onViewNewsletters: () => void;
}

export function ScanCompleted({ scanResponse, onViewNewsletters }: ScanCompletedProps) {
  const newslettersFound = scanResponse?.newslettersFoundCount || 0;
  const emailsProcessed = scanResponse?.emailsProcessedCount || 0;
  const sampleNewsletters = scanResponse?.discoveredNewsletters.slice(0, 4) || [];

  if (newslettersFound === 0) {
    return <NoNewslettersFound emailsProcessed={emailsProcessed} onContinue={onViewNewsletters} />;
  }

  return (
    <div className='flex max-w-5xl flex-col items-center gap-12 md:flex-row'>
      <div className='flex-1 text-center md:text-left'>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Badge className='mb-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'>
            <Sparkles className='mr-1 h-3 w-3' /> Scan Complete
          </Badge>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'
        >
          {newslettersFound > 10 ? 'Wow! ' : ''}
          {newslettersFound} Newsletter{newslettersFound === 1 ? '' : 's'} Found!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-6 text-lg text-slate-600 dark:text-slate-300'
        >
          We&apos;ve discovered {newslettersFound} newsletter{newslettersFound === 1 ? '' : 's'} after analyzing{' '}
          {emailsProcessed.toLocaleString()} emails. Your personalized newsletter dashboard is ready!
        </motion.p>

        {sampleNewsletters.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className='mb-6'
          >
            <p className='mb-2 font-medium text-slate-700 dark:text-slate-300'>
              Here&apos;s a preview of what we found:
            </p>
            <div className='grid grid-cols-2 gap-3'>
              {sampleNewsletters.map((newsletter, index) => (
                <motion.div
                  key={newsletter.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * Math.min(index, 5) + 0.5 }}
                >
                  <NewsletterItem newsletter={newsletter} />
                </motion.div>
              ))}
            </div>
            {newslettersFound > 4 && (
              <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>And {newslettersFound - 4} more...</p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='mb-8 flex items-start gap-3 rounded-md bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        >
          <Info className='mt-0.5 h-5 w-5 flex-shrink-0' />
          <div>
            <p className='font-medium'>Smart Detection</p>
            <p className='mt-1'>
              Newsy uses pattern recognition to identify newsletters. You can help improve our detection by marking any
              misclassified items in your dashboard.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className='flex flex-col gap-3 sm:flex-row'
        >
          <Button
            onClick={onViewNewsletters}
            className='ml-auto rounded-xl bg-blue-600 px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md'
          >
            Explore My Newsletters <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
