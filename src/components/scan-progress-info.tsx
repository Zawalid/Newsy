'use client';

import { Progress } from '@/components/ui/progress';
import { Loader2, Clock, Mail, CheckCircle } from 'lucide-react';

interface ScanProgressInfoProps {
  progress: ScanProgress;
}

export function ScanProgressInfo({ progress }: ScanProgressInfoProps) {
  const { scannedCount, totalToScan, newslettersFound, percentComplete, elapsedTime, estimatedTimeRemaining, status } =
    progress;

  // Format the time remaining or elapsed in a human-readable format
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  // Get status message based on current status
  const getStatusMessage = () => {
    switch (status) {
      case 'initializing':
        return 'Preparing to scan...';
      case 'scanning':
        return 'Fetching emails...';
      case 'processing':
        return 'Finding newsletters...';
      case 'completed':
        return 'Scan complete!';
      case 'error':
        return 'Error during scan';
      default:
        return 'Scanning...';
    }
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-1.5 font-medium'>
          {status === 'completed' ? (
            <CheckCircle className='h-4 w-4 text-green-500' />
          ) : (
            <Loader2 className='h-4 w-4 animate-spin text-blue-500' />
          )}
          <span>{getStatusMessage()}</span>
        </div>
        <div className='text-muted-foreground'>{percentComplete.toFixed(0)}%</div>
      </div>

      <Progress value={percentComplete} className='h-2' />

      <div className='text-muted-foreground grid grid-cols-3 gap-2 text-xs'>
        <div className='flex items-center gap-1.5'>
          <Mail className='h-3.5 w-3.5' />
          <span>
            {scannedCount} / {totalToScan} emails
          </span>
        </div>

        <div className='flex items-center gap-1.5'>
          <Clock className='h-3.5 w-3.5' />
          <span>
            {formatTime(elapsedTime)}
            {estimatedTimeRemaining !== undefined && status !== 'completed' && (
              <> (est. {formatTime(estimatedTimeRemaining)} left)</>
            )}
          </span>
        </div>

        <div className='flex items-center justify-end'>
          <span className='font-medium text-blue-600'>{newslettersFound} newsletters found</span>
        </div>
      </div>
    </div>
  );
}
