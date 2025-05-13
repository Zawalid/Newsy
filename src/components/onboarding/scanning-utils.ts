'use client';

// === TIME FORMATTING UTILITIES ===

export const formatTimeForDisplay = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds < 0) return 'Just a moment';
  if (seconds === 0) return 'Almost done';
  if (seconds < 60) return `Less than a minute`;
  if (seconds < 120) return `About 1 minute`;
  if (seconds < 3600) {
    const mins = Math.ceil(seconds / 60);
    return `About ${mins} minutes`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.ceil((seconds % 3600) / 60);
  return `About ${hours}h ${mins}m`;
};

export const formatTimeCompact = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds < 0) return '~';
  if (seconds === 0) return '<1s';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.ceil((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
};

// === CALCULATION HELPERS ===

export function calculateSmoothProcessingSpeed(processed: number, elapsedTime: number) {
  if (elapsedTime <= 0) return 0;

  // Basic calculation - emails per second
  const rawSpeed = processed / elapsedTime;

  // Apply reasonable bounds
  return Math.min(5000, Math.max(1, rawSpeed));
}

export function calculateTimeRemaining(
  status: string,
  emailsProcessedCount: number,
  totalEmailsToScan: number,
  processingSpeed: number,
  percentComplete: number
): number | undefined {
  if (
    status === 'COMPLETED' ||
    status === 'FAILED' ||
    processingSpeed <= 0.01 ||
    emailsProcessedCount <= 10 ||
    totalEmailsToScan <= emailsProcessedCount
  ) {
    return undefined;
  }

  // Calculate remaining time
  const remainingEmails = totalEmailsToScan - emailsProcessedCount;
  let estimatedTimeRemaining = remainingEmails / processingSpeed;

  // Cap / smooth estimation near end
  if (percentComplete > 98 || estimatedTimeRemaining < 1) {
    estimatedTimeRemaining = 0;
  }

  // Apply bounds for very large estimates
  if (estimatedTimeRemaining > 7200) {
    // Cap at 2 hours
    estimatedTimeRemaining = 7200;
  }

  return estimatedTimeRemaining;
}

export function checkIfStalled(scanResponse: ScanResponse | null): boolean {
  if (
    !scanResponse ||
    !scanResponse.updatedAt ||
    scanResponse.status === 'PREPARING' ||
    scanResponse.status === 'PENDING'
  ) {
    return false;
  }

  const lastUpdateTime = new Date(scanResponse.updatedAt).getTime();
  const currentTime = Date.now();
  const timeSinceLastUpdate = (currentTime - lastUpdateTime) / 1000; // in seconds

  // Dynamic stall threshold based on total emails
  const totalEmails = scanResponse.totalEmailsToScan || 0;
  const stallThreshold = Math.min(60, Math.max(30, (totalEmails / 10000) * 30));

  return timeSinceLastUpdate > stallThreshold;
}
