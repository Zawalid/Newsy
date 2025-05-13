'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Inbox, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// === UTILITIES ===
const formatTimeForDisplay = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds < 0) return 'calculating...';
  if (seconds === 0) return 'less than a minute';
  if (seconds < 60) return 'less than a minute';
  if (seconds < 120) return 'about 1 minute';
  return `about ${Math.ceil(seconds / 60)} minutes`;
};

const formatTimeCompact = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds < 0) return '-';
  if (seconds === 0) return '<1s';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  return `${Math.ceil(seconds / 60)}m`;
};

// === SUB-COMPONENTS ===

function PreparingStatus({ onCancel }: { onCancel: () => void }) {
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
          status='in-progress'
        />

        <Status
          icon={<Mail />}
          title='Estimating email count'
          description='Calculating scan parameters'
          status='pending'
        />

        <Status
          icon={<Sparkles />}
          title='Initializing scanner'
          description='Setting up newsletter detection'
          status='pending'
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

type StatusProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
};

function Status({ icon, title, description, status }: StatusProps) {
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

type ProgressBarProps = { percent: number; processed: number; total: number; status: string };

function ProgressBar({ percent, processed, total, status }: ProgressBarProps) {
  return (
    <div className='mb-6 w-full space-y-2'>
      <div className='flex justify-between text-sm'>
        <span className='text-slate-600 dark:text-slate-400'>
          {status === 'PENDING' ? 'Initializing...' : 'Scanning in progress'}
        </span>
        <span className='font-medium text-slate-900 dark:text-white'>
          {processed.toLocaleString()} / {total.toLocaleString()} emails
        </span>
      </div>
      <div className='relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'>
        <motion.div
          className='absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500'
          style={{ width: `${percent}%` }}
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
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

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
};

function StatCard({ icon, title, value, unit, highlight = false }: StatCardProps) {
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
          <AnimatePresence mode='wait'>
            <motion.span
              key={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        ) : (
          value
        )}
        {unit && <span className='text-sm font-normal text-slate-500 dark:text-slate-400'> {unit}</span>}
      </div>
    </motion.div>
  );
}

type ScanningStatusProps = {
  progressDetails: {
    percent: number;
    processed: number;
    total: number;
    found: number;
    elapsed: string;
    remaining: string;
    status: string;
    timeRemaining: string;
    speed: number;
  };
  discoveryRate: number;
  isStalled: boolean;
  onCancel: () => void;
  tip: {
    text: string;
    show: boolean;
    isChanging: boolean;
  };
};

function ScanningStatus({ progressDetails, discoveryRate, isStalled, onCancel, tip }: ScanningStatusProps) {
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
            {Math.round(progressDetails.percent)}% Complete
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

      <div className='relative mb-6 h-18 overflow-hidden'>
        <AnimatePresence>
          {tip.show && !tip.isChanging && (
            <motion.div
              className='absolute inset-0 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className='flex items-start'>
                <Sparkles className='mr-2 h-5 w-5 text-blue-600 dark:text-blue-400' />
                <div>
                  <p className='text-sm font-medium text-blue-800 dark:text-blue-300'>Did you know?</p>
                  <p className='text-sm text-blue-700 dark:text-blue-400'>{tip.text}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='mt-6 flex items-center justify-between'>
        <div className='text-sm text-slate-500 dark:text-slate-400'>
          Discovery rate: <span className='font-medium'>{discoveryRate}</span> newsletters per 1000 emails
        </div>
        <Button variant='ghost' size='sm' className='text-slate-500 dark:text-slate-400' onClick={onCancel}>
          <X className='mr-2 h-4 w-4' /> Cancel Scan
        </Button>
      </div>
    </motion.div>
  );
}

// === MAIN COMPONENT ===
export function Scanning({ scanResponse, onCancel }: { scanResponse: ScanResponse; onCancel: () => void }) {
  const isPreparing = scanResponse?.status === 'PREPARING';
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isChangingTip, setIsChangingTip] = useState(false);

  // Tips to show during scanning
  const tips = [
    'Newsletters are identified by analyzing sender patterns and email content',
    'We use machine learning to categorize your newsletters automatically',
    'You&apos;ll be able to manage all your newsletters in one place after the scan',
    'You can always re-scan your inbox later to find new newsletters',
    'Newsy helps you discover newsletters you might have forgotten about',
  ];

  // Rotate through tips every 8 seconds with smooth transitions
  useEffect(() => {
    if (!isPreparing) {
      const timer = setTimeout(() => {
        setShowTip(true);

        const interval = setInterval(() => {
          setIsChangingTip(true);
          setTimeout(() => {
            setTipIndex((prev) => (prev + 1) % tips.length);
            setIsChangingTip(false);
          }, 500); // Wait for exit animation to complete
        }, 8000);

        return () => {
          clearInterval(interval);
        };
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isPreparing, tips.length]);

  const progressDetails = useMemo(() => {
    if (!scanResponse || !scanResponse.startedAt) {
      return {
        percent: 0,
        processed: 0,
        total: 1000,
        found: 0,
        elapsed: '0s',
        remaining: '~2m',
        status: 'PENDING',
        timeRemaining: 'calculating...',
        speed: 0,
      };
    }

    const { emailsProcessedCount, totalEmailsToScan, newslettersFoundCount, startedAt, status } = scanResponse;

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

    return {
      percent: Math.min(100, percentComplete),
      processed: emailsProcessedCount,
      total: totalEmailsToScan,
      found: newslettersFoundCount,
      elapsed: formatTimeCompact(elapsedTime),
      remaining: formatTimeCompact(estimatedTimeRemaining),
      status: status,
      timeRemaining: formatTimeForDisplay(estimatedTimeRemaining),
      speed: Math.round(processingSpeed),
    };
  }, [scanResponse]);

  const isStalled = useMemo(() => {
    if (
      !scanResponse ||
      !scanResponse.updatedAt ||
      scanResponse.status === 'PREPARING' ||
      scanResponse.status === 'PENDING'
    )
      return false;

    const lastUpdateTime = new Date(scanResponse.updatedAt).getTime();
    const currentTime = Date.now();
    const timeSinceLastUpdate = (currentTime - lastUpdateTime) / 1000; // in seconds

    // If no update for more than 30 seconds, consider it stalled
    return timeSinceLastUpdate > 30;
  }, [scanResponse]);

  // Calculate newsletter discovery rate (newsletters per 1000 emails)
  const discoveryRate = useMemo(() => {
    if (progressDetails.processed < 100) return 0;
    return Math.round((progressDetails.found / progressDetails.processed) * 1000);
  }, [progressDetails.found, progressDetails.processed]);

  return (
    <div className='w-full max-w-5xl items-center'>
      <AnimatePresence mode='wait'>
        {isPreparing ? (
          <PreparingStatus onCancel={onCancel} />
        ) : (
          <ScanningStatus
            progressDetails={progressDetails}
            discoveryRate={discoveryRate}
            isStalled={isStalled}
            onCancel={onCancel}
            tip={{
              text: tips[tipIndex],
              show: showTip,
              isChanging: isChangingTip,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
