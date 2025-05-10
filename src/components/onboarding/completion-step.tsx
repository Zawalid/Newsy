'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface CompletionStepProps {
  scanStatus: ScanStatus;
  onViewNewsletters: () => void;
}

export function CompletionStep({ scanStatus, onViewNewsletters }: CompletionStepProps) {
  return (
    <div className='flex max-w-5xl flex-col items-center gap-12 md:flex-row'>
      <div className='flex flex-1 justify-center'>
        <SuccessIllustration />
      </div>
      <div className='flex-1 text-center md:text-left'>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'
        >
          Scan Completed!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 text-lg text-slate-600 dark:text-slate-300'
        >
          We found{' '}
          <span className='font-bold text-blue-600 dark:text-blue-400'>
            {scanStatus.newslettersFoundCount} newsletters
          </span>{' '}
          in your inbox! You&apos;re now ready to start managing your subscriptions.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            onClick={onViewNewsletters}
            className='rounded-xl bg-blue-600 px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md'
          >
            View My Newsletters <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className='mt-8 grid grid-cols-2 gap-4'
        >
          <div className='rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50'>
            <div className='mb-1 text-sm text-slate-500 dark:text-slate-400'>Emails Processed</div>
            <div className='text-xl font-semibold text-slate-900 dark:text-white'>
              {scanStatus.emailsProcessedCount.toLocaleString()}
            </div>
          </div>
          <div className='rounded-xl bg-green-50 p-4 dark:bg-green-900/20'>
            <div className='mb-1 text-sm text-green-600 dark:text-green-400'>Newsletters Found</div>
            <div className='text-xl font-semibold text-green-700 dark:text-green-300'>
              {scanStatus.newslettersFoundCount}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SuccessIllustration() {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#1e293b' : '#dcfce7';
  const accentColor = theme === 'dark' ? '#34d399' : '#10b981';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md'
    >
      <svg viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='200' cy='150' r='100' fill={bgColor} />
        <motion.path
          d='M160 150L190 180L240 130'
          stroke={accentColor}
          strokeWidth='10'
          strokeLinecap='round'
          strokeLinejoin='round'
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        <motion.circle
          cx='200'
          cy='150'
          r='80'
          stroke={accentColor}
          strokeWidth='6'
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d='M280 80L320 40M280 40L320 80M80 220L120 260M80 260L120 220'
          stroke={accentColor}
          strokeWidth='6'
          strokeLinecap='round'
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.path
          d='M200 70v-20M180 70h40v10h-40z'
          stroke={accentColor}
          strokeWidth='4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <circle cx='150' cy='100' r='5' fill={accentColor} />
          <circle cx='250' cy='100' r='5' fill={accentColor} />
          <circle cx='130' cy='200' r='5' fill={accentColor} />
          <circle cx='270' cy='200' r='5' fill={accentColor} />
        </motion.g>
      </svg>
    </motion.div>
  );
}
