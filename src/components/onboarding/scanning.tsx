'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { PreparingStatus, ScanningStatus } from './scanning-components';
import {
  formatTimeCompact,
  formatTimeForDisplay,
  calculateSmoothProcessingSpeed,
  calculateTimeRemaining,
  checkIfStalled,
} from './scanning-utils';

// === MAIN COMPONENT ===
export function Scanning({ scanResponse, onCancel }: { scanResponse: ScanResponse; onCancel: () => void }) {
  const isPreparing = scanResponse?.status === 'PREPARING';

  const progressDetails = useMemo(() => {
    if (!scanResponse || !scanResponse.startedAt) {
      return {
        percent: 0,
        processed: 0,
        total: scanResponse?.totalEmailsToScan || 0,
        found: scanResponse?.newslettersFoundCount || 0,
        elapsed: '0s',
        remaining: '',
        status: scanResponse?.status || 'PENDING',
        timeRemaining: 'Just a moment',
        speed: 0,
        discoveredNewsletters: [],
      };
    }

    const { emailsProcessedCount, totalEmailsToScan, newslettersFoundCount, startedAt, status } = scanResponse;

    const startTime = new Date(startedAt).getTime();
    const elapsedTime = Math.max(0.001, (Date.now() - startTime) / 1000); // in seconds

    // Improved percent calculation with proper bounds checking
    const percentComplete =
      totalEmailsToScan > 0 ? Math.min(99.9, (emailsProcessedCount / totalEmailsToScan) * 100) : 0;

    // Smoothed processing speed calculation
    const processingSpeed = calculateSmoothProcessingSpeed(emailsProcessedCount, elapsedTime);

    // Calculate time remaining
    const estimatedTimeRemaining = calculateTimeRemaining(
      status,
      emailsProcessedCount,
      totalEmailsToScan,
      processingSpeed,
      percentComplete
    );

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
      discoveredNewsletters: scanResponse.discoveredNewsletters || [],
    };
  }, [scanResponse]);

  const isStalled = useMemo(() => checkIfStalled(scanResponse), [scanResponse]);

  return (
    <div className='w-full max-w-5xl items-center'>
      <AnimatePresence mode='wait'>
        {isPreparing ? (
          <PreparingStatus onCancel={onCancel} />
        ) : (
          <ScanningStatus progressDetails={progressDetails} isStalled={isStalled} onCancel={onCancel} />
        )}
      </AnimatePresence>
    </div>
  );
}
