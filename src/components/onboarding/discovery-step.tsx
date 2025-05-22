'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export function DiscoveryStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className='flex max-w-5xl flex-col items-center gap-12 md:flex-row'>
      <div className='order-2 flex-1 text-center md:order-1 md:text-left'>
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className='mb-2 text-sm font-medium text-blue-600 dark:text-blue-400'
        >
          Here&apos;s How Newsy Helps:
        </motion.h3>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='mb-4 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white'
        >
          Find Every Subscription, Instantly.
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 text-lg text-slate-600 dark:text-slate-300'
        >
          Newsy intelligently scans your Gmail to create a complete, organized list of all your newsletter
          subscriptions. No more manual searching!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='flex gap-3'
        >
          <Button className='px-5' onClick={onBack} iconPlacement='left' icon={ArrowLeft} variant='outline'>
            Back
          </Button>
          <Button className='px-5' onClick={onNext} iconPlacement='right' icon={ArrowRight}>
            Next
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className='mt-8 space-y-3'
        >
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
              <CheckCircle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='text-sm text-slate-700 dark:text-slate-300'>
              Smart scanning for all newsletter subscriptions
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
              <CheckCircle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='text-sm text-slate-700 dark:text-slate-300'>
              Organized into categories for easy browsing
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
              <CheckCircle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='text-sm text-slate-700 dark:text-slate-300'>
              Instant access to forgotten subscriptions
            </span>
          </div>
        </motion.div>
      </div>
      <div className='order-1 flex flex-1 justify-center md:order-2'>
        <DiscoveryIllustration />
      </div>
    </div>
  );
}

function DiscoveryIllustration() {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#1e293b' : '#dbeafe';
  const accentColor = theme === 'dark' ? '#60a5fa' : '#3b82f6';
  const strokeColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const fillColor = theme === 'dark' ? '#334155' : '#ffffff';
  const highlightColor = theme === 'dark' ? '#7dd3fc' : '#93c5fd';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md'
    >
      <svg viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='40' y='40' width='320' height='220' rx='12' fill={bgColor} />
        <g>
          <rect x='60' y='70' width='280' height='40' rx='6' fill={fillColor} stroke={accentColor} strokeWidth='2' />
          <circle cx='80' cy='90' r='10' fill={highlightColor} />
          <rect x='100' y='85' width='150' height='10' rx='2' fill={strokeColor} opacity='0.7' />
          <rect x='100' y='75' width='80' height='6' rx='1' fill={accentColor} opacity='0.7' />
          <circle cx='320' cy='90' r='10' fill={accentColor} />
          <path
            d='M315 90L320 95L325 90'
            stroke={fillColor}
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <g>
          <rect x='60' y='120' width='280' height='40' rx='6' fill={fillColor} stroke={accentColor} strokeWidth='2' />
          <circle cx='80' cy='140' r='10' fill={highlightColor} />
          <rect x='100' y='135' width='150' height='10' rx='2' fill={strokeColor} opacity='0.7' />
          <rect x='100' y='125' width='80' height='6' rx='1' fill={accentColor} opacity='0.7' />
          <circle cx='320' cy='140' r='10' fill={accentColor} />
          <path
            d='M315 140L320 145L325 140'
            stroke={fillColor}
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <g>
          <rect x='60' y='170' width='280' height='40' rx='6' fill={fillColor} stroke={accentColor} strokeWidth='2' />
          <circle cx='80' cy='190' r='10' fill={highlightColor} />
          <rect x='100' y='185' width='150' height='10' rx='2' fill={strokeColor} opacity='0.7' />
          <rect x='100' y='175' width='80' height='6' rx='1' fill={accentColor} opacity='0.7' />
          <circle cx='320' cy='190' r='10' fill={accentColor} />
          <path
            d='M315 190L320 195L325 190'
            stroke={fillColor}
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <circle cx='200' cy='30' r='20' fill={accentColor} />
        <circle cx='195' cy='25' r='8' stroke={fillColor} strokeWidth='4' />
        <path d='M201 31L210 40' stroke={fillColor} strokeWidth='4' strokeLinecap='round' />
      </svg>
    </motion.div>
  );
}
