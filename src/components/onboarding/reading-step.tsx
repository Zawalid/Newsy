'use client';

import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";

interface ReadingStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ReadingStep({ onNext, onBack }: ReadingStepProps) {
  return (
    <div className='flex max-w-5xl flex-col items-center gap-12 md:flex-row'>
      <div className='flex flex-1 justify-center'>
        <ReadingIllustration />
      </div>
      <div className='flex-1 text-center md:text-left'>
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
          Read in Peace, Distraction-Free.
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 text-lg text-slate-600 dark:text-slate-300'
        >
          Enjoy your favorite newsletters in Newsy&apos;s clean reading interface, away from the clutter
          of your main inbox. Customize your reading experience!
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
              Distraction-free reading environment
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
              <CheckCircle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='text-sm text-slate-700 dark:text-slate-300'>
              Customizable font size and theme
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50'>
              <CheckCircle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='text-sm text-slate-700 dark:text-slate-300'>
              Save articles for later reading
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ReadingIllustration() {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#1e293b' : '#dcfce7';
  const accentColor = theme === 'dark' ? '#34d399' : '#10b981';
  const strokeColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const fillColor = theme === 'dark' ? '#334155' : '#ffffff';
  const textColor = theme === 'dark' ? '#94a3b8' : '#d1d5db';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md'
    >
      <svg viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='50' y='30' width='300' height='240' rx='12' fill={bgColor} />
        <rect x='70' y='50' width='260' height='40' rx='4' fill={accentColor} fillOpacity='0.2' />
        <circle cx='90' cy='70' r='12' fill={accentColor} />
        <rect x='110' y='65' width='120' height='10' rx='2' fill={strokeColor} />
        <rect x='240' y='65' width='70' height='10' rx='2' fill={accentColor} />
        <rect x='70' y='100' width='260' height='4' rx='2' fill={textColor} />
        <rect x='70' y='114' width='260' height='4' rx='2' fill={textColor} />
        <rect x='70' y='128' width='260' height='4' rx='2' fill={textColor} />
        <rect x='70' y='142' width='260' height='4' rx='2' fill={textColor} />
        <rect x='70' y='156' width='260' height='4' rx='2' fill={textColor} />
        <rect x='70' y='170' width='260' height='4' rx='2' fill={textColor} />
        <rect x='70' y='184' width='260' height='4' rx='2' fill={textColor} />
        <rect x='70' y='198' width='180' height='4' rx='2' fill={textColor} />
        <rect x='70' y='220' width='80' height='30' rx='6' fill={accentColor} />
        <path
          d='M90 235L100 245L120 225'
          stroke={fillColor}
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <circle cx='300' cy='235' r='15' fill={fillColor} stroke={strokeColor} strokeWidth='1' />
        <path
          d='M295 235L300 240L305 230'
          stroke={accentColor}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <circle cx='260' cy='235' r='15' fill={fillColor} stroke={strokeColor} strokeWidth='1' />
        <path
          d='M255 235H265M260 230V240'
          stroke={accentColor}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </motion.div>
  );
}