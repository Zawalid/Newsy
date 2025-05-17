/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Inbox, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AnimatedNumber, useAnimatedPercent } from '@/components/ui/animated-number';
import { cn } from '@/lib/utils';

type StatusProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
};

type ProgressBarProps = { percent: number; processed: number; total: number; status: string };

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
};

export type ScanningStatusProps = {
  progressDetails: {
    percent: number;
    processed: number;
    total: number;
    found: number;
    elapsed: string;
    remaining: string;
    status: ScanStatus;
    timeRemaining: string;
    speed: number;
    discoveredNewsletters: DiscoveredNewsletter[];
  };
  isStalled: boolean;
  onCancel: () => void;
};

// === PREPARING COMPONENTS ===

export function PreparingStatus({ onCancel }: { onCancel: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= 3) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <motion.div
      key='preparing'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'>
        Preparing Your Scan
      </h2>

      <p className='mb-6 text-lg text-slate-600 dark:text-slate-300'>
        We&apos;re getting everything ready to scan your inbox. This will just take a moment...
      </p>

      <div className='mb-8 space-y-6'>
        <Status
          icon={<Inbox />}
          title='Connecting to your inbox'
          description='Establishing secure connection'
          status={currentStep >= 0 ? (currentStep > 0 ? 'completed' : 'in-progress') : 'pending'}
        />

        <Status
          icon={<Mail />}
          title='Estimating email count'
          description='Calculating scan parameters'
          status={currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'in-progress') : 'pending'}
        />

        <Status
          icon={<Sparkles />}
          title='Initializing scanner'
          description='Setting up newsletter detection'
          status={currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'in-progress') : 'pending'}
        />
      </div>

      <div className='mt-6 flex items-center justify-between'>
        <p className='text-sm text-slate-500 dark:text-slate-400'>This usually takes less than a minute</p>
        <Button variant='ghost' size='sm' className='text-slate-500 dark:text-slate-400' onClick={onCancel}>
          <X className='mr-2 h-4 w-4' /> Cancel
        </Button>
      </div>
    </motion.div>
  );
}
export function Status({ icon, title, description, status }: StatusProps) {
  return (
    <div className='flex items-center space-x-4'>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          status === 'in-progress'
            ? 'bg-blue-100 dark:bg-blue-900'
            : status === 'completed'
              ? 'bg-green-100 dark:bg-green-900'
              : 'bg-slate-100 dark:bg-slate-800'
        }`}
      >
        {status === 'in-progress' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          >
            <div
              className={`${
                status === 'in-progress'
                  ? 'text-blue-600 dark:text-blue-400'
                  : status === 'completed'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {icon}
            </div>
          </motion.div>
        ) : (
          <div
            className={`${
              status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className='flex-1'>
        <p className='font-medium text-slate-900 dark:text-white'>{title}</p>
        <p className='text-sm text-slate-500 dark:text-slate-400'>{description}</p>
      </div>
      {status === 'in-progress' ? (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <Badge variant='outline' className='bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
            In progress
          </Badge>
        </motion.div>
      ) : status === 'completed' ? (
        <Badge variant='outline' className='bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'>
          Completed
        </Badge>
      ) : (
        <Badge variant='outline' className='bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400'>
          Pending
        </Badge>
      )}
    </div>
  );
}

// === SCANNING COMPONENTS ===

export function ProgressBar({ percent, processed, total, status }: ProgressBarProps) {
  const width = useAnimatedPercent(percent);

  return (
    <div className='mb-6 w-full space-y-2'>
      <div className='flex justify-between text-sm'>
        <span className='text-slate-600 dark:text-slate-400'>
          {status === 'PENDING' ? 'Initializing...' : 'Scanning in progress'}
        </span>
        <span className='font-medium text-slate-900 dark:text-white'>
          <AnimatedNumber value={processed} /> / {total.toLocaleString()} emails
        </span>
      </div>
      <div className='relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'>
        <motion.div
          className='absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500'
          style={{ width }}
        />
        <motion.div
          className='absolute top-0 left-0 h-full w-20 bg-white/20'
          animate={{
            left: ['0%', '100%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
            repeatType: 'loop',
          }}
        />
      </div>
    </div>
  );
}

export function StatCard({ icon, title, value, unit, highlight = false }: StatCardProps) {
  return (
    <motion.div
      className={`rounded-xl p-4 ${
        highlight
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30'
          : 'bg-slate-50 dark:bg-slate-800/50'
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div
        className={`mb-2 flex items-center gap-2 text-sm ${
          highlight ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {icon}
        <span>{title}</span>
      </div>
      <div
        className={cn(
          typeof value === 'number' ? 'text-2xl' : 'text-lg',
          highlight ? 'font-bold text-blue-700 dark:text-blue-300' : 'font-semibold text-slate-900 dark:text-white'
        )}
      >
        {typeof value === 'number' ? (
          <AnimatedNumber
            value={value}
            className={
              highlight ? 'font-bold text-blue-700 dark:text-blue-300' : 'font-semibold text-slate-900 dark:text-white'
            }
          />
        ) : (
          value
        )}
        {unit && <span className='text-sm font-normal text-slate-500 dark:text-slate-400'> {unit}</span>}
      </div>
    </motion.div>
  );
}

export function ScanningStatus({ progressDetails, isStalled, onCancel }: ScanningStatusProps) {
  return (
    <motion.div
      key='scanning'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex items-center justify-between'>
        <h2 className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'>
          Scanning Your Inbox
        </h2>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
          <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
            <AnimatedNumber value={progressDetails.percent} formatter={(val) => `${val}`} />% Complete
          </Badge>
        </motion.div>
      </div>
      <p className='mb-6 text-lg text-slate-600 dark:text-slate-300'>
        We&apos;re analyzing your emails to find all your newsletter subscriptions.
      </p>
      {isStalled && (
        <Alert
          variant='warning'
          className='mb-6 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-300'
        >
          <AlertTriangle className='mr-2 h-4 w-4' />
          <AlertDescription>
            The scan seems to be taking longer than expected. You can continue waiting or cancel and try again later.
          </AlertDescription>
        </Alert>
      )}
      <ProgressBar
        percent={progressDetails.percent}
        processed={progressDetails.processed}
        total={progressDetails.total}
        status={progressDetails.status}
      />
      <div className='mb-6 grid w-full grid-cols-3 gap-4'>
        <StatCard icon={<Mail />} title='Newsletters Found' value={progressDetails.found} highlight={true} />
        <StatCard icon={<Inbox />} title='Processing Speed' value={progressDetails.speed} unit='emails/sec' />
        <StatCard icon={<Clock />} title='Time Remaining' value={progressDetails.timeRemaining} />
      </div>
      <NewsletterShowcase
        discoveredNewsletters={progressDetails.discoveredNewsletters || []}
        isScanning={progressDetails.status === 'PENDING' || progressDetails.status === 'PROCESSING'}
      />

      <Button variant='ghost' size='sm' className='ml-auto flex text-slate-500 dark:text-slate-400' onClick={onCancel}>
        <X className='mr-2 h-4 w-4' /> Cancel Scan
      </Button>
    </motion.div>
  );
}

export function NewsletterShowcase({
  discoveredNewsletters = [],
  isScanning = true,
}: {
  discoveredNewsletters: DiscoveredNewsletter[];
  isScanning?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (discoveredNewsletters.length <= 1 || !isScanning) return;

    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % discoveredNewsletters.length);
        setIsChanging(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, [discoveredNewsletters.length, isScanning]);

  return (
    <div className='mb-6'>
      <h3 className='mb-2 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300'>
        <Sparkles className='mr-1.5 h-4 w-4 text-blue-500' />
        Recently Discovered Newsletters
      </h3>

      <div className='relative h-[76px] overflow-hidden'>
        <AnimatePresence mode='wait'>
          {discoveredNewsletters.length > 0 && !isChanging ? (
            <motion.div
              key={discoveredNewsletters[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NewsletterItem newsletter={discoveredNewsletters[currentIndex]} />
            </motion.div>
          ) : discoveredNewsletters.length === 0 ? (
            <motion.div
              key='no-newsletters'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex h-[76px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
            >
              <p className='text-sm text-slate-500 dark:text-slate-400'>Searching for your newsletters...</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function NewsletterItem({ newsletter }: { newsletter: DiscoveredNewsletter }) {
  return (
    <div className='flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
      <div className='flex-shrink-0'>
        {newsletter.faviconUrl ? (
          <div className='relative h-10 w-10 overflow-hidden rounded-md drop-shadow-md'>
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
          {/* {newsletter.category && (
            <div className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${CATEGORY_COLORS[newsletter.category]}`}>
              {newsletter.category}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
