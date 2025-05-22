'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Search, Settings, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface ScanInitiationStepProps {
  onBack: () => void;
  onStartScan: () => void;
  onShowScanSettings: () => void;
  onSkip: () => void;
}

export function ScanInitiationStep({ onBack, onStartScan, onShowScanSettings, onSkip }: ScanInitiationStepProps) {
  return (
    <div className='flex max-w-5xl flex-col items-center gap-12 md:flex-row'>
      <div className='flex flex-1 justify-center'>
        <ScanIllustration />
      </div>
      <div className='flex-1 text-center md:text-left'>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'
        >
          Ready to See It in Action?
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 text-lg text-slate-600 dark:text-slate-300'
        >
          <p className='mb-4'>
            Let&apos;s scan your Gmail inbox. We&apos;ll look through your email metadata (senders, subjects,
            unsubscribe links) to identify your newsletters. This usually takes a few minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className='flex flex-col gap-3 sm:flex-row'
        >
          <div className='flex flex-row-reverse rounded-xl border'>
            <Button
              className='peer text-foreground rounded-s-none rounded-e-xl bg-transparent hover:text-white'
              onClick={onShowScanSettings}
              size='icon'
            >
              <Settings className='h-4 w-4' />
            </Button>
            <Button
              onClick={onStartScan}
              className='peer-hover:text-foreground rounded-s-xl rounded-e-none px-5 text-base peer-hover:bg-transparent'
            >
              <Search className='mr-2 h-4 w-4' /> Start Scanning
            </Button>
          </div>

          <Button variant='outline' onClick={onBack}>
            <ArrowLeft className='mr-2 h-4 w-4' /> Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className='mt-4'
        >
          <Button
            variant='ghost'
            onClick={onSkip}
            className='text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          >
            <Clock className='mr-2 h-4 w-4' /> Remind Me Later
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className='mt-8 flex items-start gap-3 rounded-xl bg-slate-100 p-4 dark:bg-slate-800/50'
        >
          <div className='mt-1 flex-shrink-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-5 w-5 text-blue-600 dark:text-blue-400'
            >
              <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
              <path d='M7 11V7a5 5 0 0 1 10 0v4' />
            </svg>
          </div>
          <div>
            <h4 className='text-sm font-medium text-slate-900 dark:text-white'>Secure & Private</h4>
            <p className='text-xs text-slate-600 dark:text-slate-300'>
              Your data is encrypted and we never store your email content. We only analyze metadata to identify
              newsletters.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ScanIllustration() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme || 'light';
  const bgColor = theme === 'dark' ? '#1e293b' : '#dbeafe';
  const accentColor = theme === 'dark' ? '#60a5fa' : '#3b82f6';
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
        <rect x='100' y='50' width='200' height='200' rx='12' fill={bgColor} />
        <rect x='120' y='80' width='160' height='20' rx='4' fill={highlightColor} />
        <rect x='120' y='110' width='160' height='20' rx='4' fill={highlightColor} />
        <rect x='120' y='140' width='160' height='20' rx='4' fill={highlightColor} />
        <rect x='120' y='170' width='160' height='20' rx='4' fill={highlightColor} />
        <rect x='120' y='200' width='160' height='20' rx='4' fill={highlightColor} />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: 'loop' }}
          d='M80 50L80 250M320 50L320 250'
          stroke={accentColor}
          strokeWidth='4'
          strokeLinecap='round'
          strokeDasharray='0 10'
        />
        <motion.rect
          x='80'
          y='50'
          width='240'
          height='200'
          rx='12'
          stroke={accentColor}
          strokeWidth='4'
          strokeLinecap='round'
          strokeDasharray='0 10'
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: 'loop', delay: 0.5 }}
        />
        <circle cx='200' cy='30' r='20' fill={accentColor} />
        <circle cx='195' cy='25' r='8' stroke={fillColor} strokeWidth='4' />
        <path d='M201 31L210 40' stroke={fillColor} strokeWidth='4' strokeLinecap='round' />
        <circle cx='135' cy='90' r='5' fill={fillColor} />
        <circle cx='135' cy='120' r='5' fill={fillColor} />
        <circle cx='135' cy='150' r='5' fill={fillColor} />
        <circle cx='135' cy='180' r='5' fill={fillColor} />
        <circle cx='135' cy='210' r='5' fill={fillColor} />
        <rect x='145' y='87' width='100' height='6' rx='1' fill={fillColor} />
        <rect x='145' y='117' width='100' height='6' rx='1' fill={fillColor} />
        <rect x='145' y='147' width='100' height='6' rx='1' fill={fillColor} />
        <rect x='145' y='177' width='100' height='6' rx='1' fill={fillColor} />
        <rect x='145' y='207' width='100' height='6' rx='1' fill={fillColor} />
      </svg>
    </motion.div>
  );
}
