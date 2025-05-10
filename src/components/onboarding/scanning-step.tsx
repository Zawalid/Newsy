'use client';

import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

const formatTimeForDisplay = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds < 0) return 'calculating...';
  if (seconds === 0) return 'less than a minute';
  if (seconds < 60) return 'less than a minute';
  if (seconds < 120) return 'about 1 minute';
  return `about ${Math.ceil(seconds / 60)} minutes`;
};

export function ScanningStep({ scanStatus, onCancel }: { scanStatus: ScanStatus; onCancel: () => void }) {
  const progressDetails = useMemo(() => {
    if (!scanStatus || !scanStatus.startedAt) {
      return {
        percent: 0,
        processed: 0,
        total: 1000,
        found: 0,
        elapsed: '0s',
        remaining: '~2m',
        status: 'PENDING',
      };
    }

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
      percent: Math.min(100, percentComplete),
      processed: emailsProcessedCount,
      total: totalEmailsToScan,
      found: newslettersFoundCount,
      elapsed: formatTime(elapsedTime),
      remaining: formatTime(estimatedTimeRemaining),
      status: status,
      timeRemaining: formatTimeForDisplay(estimatedTimeRemaining),
    };
  }, [scanStatus]);

  return (
    <div className='flex max-w-5xl flex-col items-center gap-12 md:flex-row'>
      <div className='flex flex-1 justify-center'>
        <ScanningIllustration progress={progressDetails.percent} />
      </div>
      <div className='flex-1'>
        <h2 className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'>
          Scanning Your Inbox...
        </h2>

        <p className='mb-8 text-lg text-slate-600 dark:text-slate-300'>
          We&apos;re analyzing your emails to find all your newsletter subscriptions. This should take just a few
          minutes.
        </p>

        <div className='mb-8 w-full space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-slate-600 dark:text-slate-400'>
              {progressDetails.status === 'PENDING' ? 'Initializing...' : 'Scanning in progress'}
            </span>
            <span className='font-medium text-slate-900 dark:text-white'>{Math.round(progressDetails.percent)}%</span>
          </div>
          <Progress value={progressDetails.percent} className='h-2' />
        </div>

        <div className='mb-6 grid w-full grid-cols-2 gap-4'>
          <div className='rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50'>
            <div className='mb-1 text-sm text-slate-500 dark:text-slate-400'>Emails Scanned</div>
            <div className='text-xl font-semibold text-slate-900 dark:text-white'>
              {progressDetails.processed.toLocaleString()} / {progressDetails.total.toLocaleString()}
            </div>
          </div>
          <div className='rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50'>
            <div className='mb-1 text-sm text-slate-500 dark:text-slate-400'>Newsletters Found</div>
            <div className='text-xl font-semibold text-slate-900 dark:text-white'>{progressDetails.found}</div>
          </div>
        </div>

        <div className='text-sm text-slate-500 dark:text-slate-400'>
          Estimated time remaining: {progressDetails.timeRemaining}
        </div>

        <Button variant='ghost' size='sm' className='mt-4 text-slate-500 dark:text-slate-400' onClick={onCancel}>
          <X className='mr-2 h-4 w-4' /> Cancel Scan
        </Button>
      </div>
    </div>
  );
}

function ScanningIllustration({ progress }: { progress: number }) {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#1e293b' : '#dbeafe';
  const accentColor = theme === 'dark' ? '#60a5fa' : '#3b82f6';
  const fillColor = theme === 'dark' ? '#334155' : '#ffffff';
  const progressColor = theme === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)';
  const highlightColor = theme === 'dark' ? '#7dd3fc' : '#93c5fd';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md'
    >
      <svg viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='100' y='50' width='200' height='200' rx='12' fill={bgColor} />
        <rect x='120' y='80' width='160' height='20' rx='4' fill={highlightColor} />
        <rect x='120' y='110' width='160' height='20' rx='4' fill={highlightColor} />
        <rect x='120' y='140' width='160' height='20' rx='4' fill={highlightColor} />
        <rect x='120' y='170' width='160' height='20' rx='4' fill={highlightColor} />
        <rect x='120' y='200' width='160' height='20' rx='4' fill={highlightColor} />
        <motion.rect
          x='100'
          y='50'
          width='200'
          height={progress * 2}
          rx='0'
          fill={progressColor}
          initial={{ height: 0 }}
          animate={{ height: (progress / 100) * 200 }}
          transition={{ duration: 0.5 }}
        />
        <motion.line
          x1='100'
          y1={50 + (progress / 100) * 200}
          x2='300'
          y2={50 + (progress / 100) * 200}
          stroke={accentColor}
          strokeWidth='2'
          strokeDasharray='5 5'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          style={{ transformOrigin: '200px 30px' }}
        >
          <circle cx='200' cy='30' r='20' fill={accentColor} />
          <path
            d='M200 20v-5M208 22l3-4M213 30h5M208 38l3 4M200 40v5M192 38l-3 4M187 30h-5M192 22l-3-4'
            stroke={fillColor}
            strokeWidth='2'
            strokeLinecap='round'
          />
        </motion.g>
        <text x='200' y='150' textAnchor='middle' fontSize='24' fontWeight='bold' fill={accentColor}>
          {Math.round(progress)}%
        </text>
      </svg>
    </motion.div>
  );
}
