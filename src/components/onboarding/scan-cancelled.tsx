'use client';

import { motion } from 'framer-motion';
import { SkipForward, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface ScanCancelledProps {
  onRestartScan: () => void;
  onSkip: () => void;
}

export function ScanCancelled({ onRestartScan, onSkip }: ScanCancelledProps) {
  return (
    <div className='flex max-w-5xl flex-col items-center gap-12 text-center md:flex-row'>
      <div className='flex flex-1 justify-center'>
        <CancelledIllustration />
      </div>
      <div className='flex-1 md:text-left'>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'
        >
          Scan Cancelled
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 text-lg text-slate-600 dark:text-slate-300'
        >
          You&apos;ve cancelled the inbox scan. No problem! You can start it again when you&apos;re ready or proceed to
          the app.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className='mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20'
        >
          <div className='flex items-start gap-3'>
            <Clock className='mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400' />
            <div>
              <h3 className='font-medium text-amber-800 dark:text-amber-300'>Why scan your inbox?</h3>
              <p className='mt-1 text-sm text-amber-700 dark:text-amber-400'>
                Scanning helps Newsy identify all your newsletter subscriptions so you can manage them in one place,
                discover new content, and declutter your inbox.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start'
        >
          <Button onClick={onRestartScan} className='bg-blue-600 hover:bg-blue-700'>
            <RotateCcw className='mr-2 h-4 w-4' /> Start Scan Again
          </Button>
          <Button variant='outline' onClick={onSkip}>
            <SkipForward className='mr-2 h-4 w-4' /> Skip to App
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function CancelledIllustration() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const bgColor = isDark ? '#334155' : '#f8fafc';
  const accentColor = isDark ? '#f87171' : '#ef4444';
  const secondaryColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md'
    >
      <svg viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='200' cy='150' r='100' fill={bgColor} />

        {/* X mark */}
        <motion.path
          d='M150 100 L250 200'
          stroke={accentColor}
          strokeWidth='12'
          strokeLinecap='round'
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        <motion.path
          d='M250 100 L150 200'
          stroke={accentColor}
          strokeWidth='12'
          strokeLinecap='round'
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />

        {/* Circle around X */}
        <motion.circle
          cx='200'
          cy='150'
          r='80'
          stroke={secondaryColor}
          strokeWidth='4'
          strokeDasharray='4 6'
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Decorative elements */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <circle cx='150' cy='90' r='6' fill={secondaryColor} />
          <circle cx='250' cy='90' r='6' fill={secondaryColor} />
          <circle cx='150' cy='210' r='6' fill={secondaryColor} />
          <circle cx='250' cy='210' r='6' fill={secondaryColor} />
        </motion.g>
      </svg>
    </motion.div>
  );
}
