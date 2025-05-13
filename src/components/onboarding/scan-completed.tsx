/* eslint-disable @next/next/no-img-element */
'use client';

import { motion } from 'motion/react';
import { ArrowRight, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NoNewslettersFound } from './no-newsletters-found';
import { CATEGORY_COLORS } from '@/data-access/sample.data';

interface ScanCompletedProps {
  scanResponse: ScanResponse;
  onViewNewsletters: () => void;
}

export function ScanCompleted({ scanResponse, onViewNewsletters }: ScanCompletedProps) {
  const newslettersFound = scanResponse?.newslettersFoundCount || 0;
  const emailsProcessed = scanResponse?.emailsProcessedCount || 0;
  const sampleNewsletters = scanResponse?.result?.slice(0, 3) || [];

  
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
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * Math.min(index, 5) + 0.5 }}
                  className='flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
                >
                  <div className='flex-shrink-0'>
                    {newsletter.faviconUrl ? (
                      <div className='relative h-10 w-10 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700'>
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
                      <div className='flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-teal-500 to-teal-600 text-sm font-bold text-white dark:from-teal-600 dark:to-teal-700'>
                        {newsletter.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 flex-grow'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <h3 className='truncate font-medium text-slate-900 dark:text-white'>{newsletter.name}</h3>
                        <p className='truncate text-xs text-slate-500 dark:text-slate-400'>{newsletter.address}</p>
                      </div>
                      {newsletter.category && (
                        <div
                          className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${CATEGORY_COLORS[newsletter.category]}`}
                        >
                          {newsletter.category}
                        </div>
                      )}
                    </div>
                  </div>
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
              Newsy uses AI to identify newsletters. You can help improve our detection by marking any misclassified
              items in your dashboard.
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
