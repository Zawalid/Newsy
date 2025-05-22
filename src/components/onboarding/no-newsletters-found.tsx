'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Search, Info, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NoNewslettersFoundProps {
  emailsProcessed: number;
  onContinue: () => void;
}

export function NoNewslettersFound({ emailsProcessed, onContinue }: NoNewslettersFoundProps) {
  return (
    <div className='mx-auto w-full max-w-3xl px-4'>
      <div className='mb-8 text-center'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800'
        >
          <Inbox className='h-10 w-10 text-slate-500 dark:text-slate-400' />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'
        >
          No Newsletters Found
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-6 flex justify-center'
        >
          <Badge variant='outline' className='bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800'>
            {emailsProcessed.toLocaleString()} emails scanned
          </Badge>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mx-auto mb-8 text-lg text-slate-600 dark:text-slate-300'
        >
          We didn&apos;t find any newsletters that match our current detection criteria in your inbox.
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className='mb-8 grid gap-4 md:grid-cols-2'
      >
        <div className='rounded-lg bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'>
          <div className='flex items-start gap-3'>
            <Search className='mt-1 h-5 w-5 flex-shrink-0 text-slate-500' />
            <div>
              <h3 className='font-medium text-slate-900 dark:text-white'>Why didn&apos;t we find anything?</h3>
              <ul className='mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300'>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 text-slate-400'>•</span>
                  <span>You don&apos;t have newsletter subscriptions</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 text-slate-400'>•</span>
                  <span>Your newsletters are in folders we didn&apos;t scan</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 text-slate-400'>•</span>
                  <span>Our detection algorithm didn&apos;t recognize them</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
          <div className='flex items-start gap-3'>
            <Info className='mt-1 h-5 w-5 flex-shrink-0 text-blue-500' />
            <div>
              <h3 className='font-medium text-slate-900 dark:text-white'>What&apos;s next?</h3>
              <ul className='mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300'>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 text-slate-400'>•</span>
                  <span>Discover and subscribe to new newsletters</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 text-slate-400'>•</span>
                  <span>Manually add your existing subscriptions</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 text-slate-400'>•</span>
                  <span>Try scanning again with different settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className='flex justify-center'
      >
        <Button
          onClick={onContinue}
          className='rounded-xl bg-blue-600 px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md'
        >
          Continue to Dashboard <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </motion.div>
    </div>
  );
}
