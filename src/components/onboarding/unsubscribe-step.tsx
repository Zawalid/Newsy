'use client';

import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";

interface UnsubscribeStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function UnsubscribeStep({ onNext, onBack }: UnsubscribeStepProps) {
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
          Unsubscribe with a Single Click.
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 text-lg text-slate-600 dark:text-slate-300'
        >
          Tired of unwanted emails? Newsy finds the unsubscribe links and handles one-click unsubscribes
          for many senders, making it effortless to clean your inbox.
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
              One-click unsubscribe from any newsletter
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
              <CheckCircle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='text-sm text-slate-700 dark:text-slate-300'>
              Batch unsubscribe from multiple newsletters
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
              <CheckCircle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='text-sm text-slate-700 dark:text-slate-300'>
              Verification that unsubscribe was successful
            </span>
          </div>
        </motion.div>
      </div>
      <div className='order-1 flex flex-1 justify-center md:order-2'>
        <UnsubscribeIllustration />
      </div>
    </div>
  );
}

function UnsubscribeIllustration() {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#1e293b' : '#fee2e2';
  const accentColor = theme === 'dark' ? '#f87171' : '#ef4444';
  const strokeColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const fillColor = theme === 'dark' ? '#334155' : '#ffffff';
  const borderColor = theme === 'dark' ? '#475569' : '#e5e7eb';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md'
    >
      <svg viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='50' y='50' width='300' height='200' rx='12' fill={bgColor} />
        <g>
          <rect x='70' y='80' width='260' height='40' rx='6' fill={fillColor} stroke={borderColor} strokeWidth='2' />
          <circle cx='90' cy='100' r='12' fill={bgColor} />
          <rect x='110' y='95' width='120' height='10' rx='2' fill={strokeColor} />
          <rect x='110' y='85' width='60' height='6' rx='1' fill={strokeColor} opacity='0.5' />
          <rect x='250' y='90' width='70' height='20' rx='4' fill={accentColor} />
          <path
            d='M270 100L280 90M270 90L280 100'
            stroke={fillColor}
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <g>
          <rect x='70' y='130' width='260' height='40' rx='6' fill={fillColor} stroke={borderColor} strokeWidth='2' />
          <circle cx='90' cy='150' r='12' fill={bgColor} />
          <rect x='110' y='145' width='120' height='10' rx='2' fill={strokeColor} />
          <rect x='110' y='135' width='60' height='6' rx='1' fill={strokeColor} opacity='0.5' />
          <rect x='250' y='140' width='70' height='20' rx='4' fill={accentColor} />
          <path
            d='M270 150L280 140M270 140L280 150'
            stroke={fillColor}
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <g>
          <rect x='70' y='180' width='260' height='40' rx='6' fill={fillColor} stroke={borderColor} strokeWidth='2' />
          <circle cx='90' cy='200' r='12' fill={bgColor} />
          <rect x='110' y='195' width='120' height='10' rx='2' fill={strokeColor} />
          <rect x='110' y='185' width='60' height='6' rx='1' fill={strokeColor} opacity='0.5' />
          <rect x='250' y='190' width='70' height='20' rx='4' fill={accentColor} />
          <path
            d='M270 200L280 190M270 190L280 200'
            stroke={fillColor}
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <circle cx='200' cy='30' r='20' fill={accentColor} />
        <path
          d='M190 30C190 32.7614 187.761 35 185 35C182.239 35 180 32.7614 180 30C180 27.2386 182.239 25 185 25C187.761 25 190 27.2386 190 30Z'
          fill={fillColor}
        />
        <path
          d='M220 30C220 32.7614 217.761 35 215 35C212.239 35 210 32.7614 210 30C210 27.2386 212.239 25 215 25C217.761 25 220 27.2386 220 30Z'
          fill={fillColor}
        />
        <path d='M190 30L210 20M190 30L210 40' stroke={fillColor} strokeWidth='2' strokeLinecap='round' />
      </svg>
    </motion.div>
  );
}