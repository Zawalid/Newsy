'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useSession } from '@/lib/auth/client';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const session = useSession();

  let name = session.data?.user.name?.split(' ') || '';
  name = name.length > 1 ? name[0] : name;

  return (
    <div className='flex max-w-5xl flex-col items-center gap-12 md:flex-row'>
      <div className='flex flex-1 justify-center'>
        <WelcomeIllustration />
      </div>
      <div className='flex-1 text-center md:text-left'>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white'
        >
          Welcome to Newsy, {name}!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 text-lg text-slate-600 dark:text-slate-300'
        >
          Take Control of Your Newsletter Overload. Newsy is here to help you rediscover, manage, and declutter your
          newsletter subscriptions from Gmail.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button onClick={onNext} effect='shine' size='lg' icon={ArrowRight} iconPlacement='right'>
            Show Me How
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className='mt-4 text-sm text-slate-500 dark:text-slate-400'
        >
          Pro tip: Use arrow keys to navigate ← →
        </motion.p>
      </div>
    </div>
  );
}

function WelcomeIllustration() {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#1e293b' : '#e0f2fe';
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
        <rect x='50' y='50' width='300' height='200' rx='20' fill={bgColor} />
        <rect x='70' y='80' width='260' height='30' rx='6' fill={fillColor} stroke={strokeColor} strokeWidth='1' />
        <rect x='70' y='120' width='260' height='30' rx='6' fill={fillColor} stroke={strokeColor} strokeWidth='1' />
        <rect x='70' y='160' width='260' height='30' rx='6' fill={fillColor} stroke={strokeColor} strokeWidth='1' />
        <rect x='70' y='200' width='120' height='30' rx='6' fill={accentColor} />
        <circle cx='200' cy='30' r='20' fill={accentColor} />
        <path
          d='M190 30L198 38L210 26'
          stroke={fillColor}
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <rect x='80' y='85' width='20' height='20' rx='4' fill={highlightColor} />
        <rect x='80' y='125' width='20' height='20' rx='4' fill={highlightColor} />
        <rect x='80' y='165' width='20' height='20' rx='4' fill={highlightColor} />
        <rect x='110' y='90' width='180' height='10' rx='2' fill={strokeColor} opacity='0.5' />
        <rect x='110' y='130' width='180' height='10' rx='2' fill={strokeColor} opacity='0.5' />
        <rect x='110' y='170' width='180' height='10' rx='2' fill={strokeColor} opacity='0.5' />
        <rect x='100' y='210' width='60' height='10' rx='2' fill={fillColor} />
        <circle cx='320' cy='90' r='5' fill={highlightColor} />
        <circle cx='320' cy='130' r='5' fill={highlightColor} />
        <circle cx='320' cy='170' r='5' fill={highlightColor} />
      </svg>
    </motion.div>
  );
}
