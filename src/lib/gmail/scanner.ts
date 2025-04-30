'use server';

import { getGmailClient } from '@/lib/gmail/client';
import { fetchEmailMetadataOnly, getGmailProfile } from './operations';
import { DEFAULT_CHUNK_SIZE, DEFAULT_MAX_EMAILS } from '@/utils/constants';
import { getFaviconFromEmail } from './utils';

// Define ScanOptions interface to expose settings
interface ScanOptions {
  maxResults?: number;
  batchSize?: number;
  debug?: boolean;
  progressCallback?: (progress: ScanProgress) => void;
}

// Utility functions
const chunkArray = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

const isNewsletter = (email: EmailMetadata): boolean => {
  const { fromRaw, subject, unsubscribeUrl, listId } = email;
  return Boolean(
    unsubscribeUrl || // has List-Unsubscribe header
      listId || // has List-Id header
      /newsletter|update|digest|weekly|monthly|daily/i.test(fromRaw || '') || // name heuristic
      /newsletter|update|digest|weekly|monthly|daily/i.test(subject || '') // subject heuristic
  );
};

const createProgressUpdate = (
  scannedCount: number,
  totalToScan: number,
  newslettersFound: number,
  startTime: number,
  status: ScanProgress['status']
): ScanProgress => {
  const elapsedTime = Math.max(0.001, (Date.now() - startTime) / 1000); // Ensure non-zero elapsed time
  const percentComplete = (scannedCount / totalToScan) * 100;
  const processingSpeed = scannedCount / elapsedTime;

  // Calculate estimatedTimeRemaining with guard against Infinity or tiny values
  let estimatedTimeRemaining: number | undefined;
  if (scannedCount > 0 && processingSpeed > 0.001) {
    estimatedTimeRemaining = (totalToScan - scannedCount) / processingSpeed;
    // Prevent erratic jumps when close to completion
    if (percentComplete > 95 || estimatedTimeRemaining < 0.5) {
      estimatedTimeRemaining = 0;
    }
  }

  return {
    scannedCount,
    totalToScan,
    newslettersFound,
    percentComplete,
    elapsedTime,
    estimatedTimeRemaining,
    processingSpeed,
    status,
  };
};

/**
 * Main function to scan inbox for newsletters with simplified options
 */
export const scanInbox = async ({
  maxResults = DEFAULT_MAX_EMAILS,
  batchSize = DEFAULT_CHUNK_SIZE,
  debug = false,
  progressCallback,
}: ScanOptions = {}): Promise<Newsletter[] | string> => {
  // Debug logging function
  const log = (...args: any[]) => {
    if (debug) console.log('[Newsletter Scanner]', ...args);
  };

  const newsletters = new Map<string, Newsletter>(); // Use Map to deduplicate by email
  const processedIds = new Set<string>(); // Track which message IDs we've already processed
  let nextPageToken: string | undefined;
  let scannedCount = 0;
  let processedCount = 0; // Track emails processed, not just retrieved
  let totalMessages = 0;
  let messagesToScan = maxResults;
  let status: ScanProgress['status'] = 'initializing';
  const startTime = Date.now();

  const updateProgress = (newStatus?: ScanProgress['status']) => {
    if (progressCallback) {
      if (newStatus) status = newStatus;
      progressCallback(createProgressUpdate(processedCount, messagesToScan, newsletters.size, startTime, status));
    }
  };

  try {
    const gmail = await getGmailClient();
    log('Starting inbox scan for newsletters...');

    // Get the profile to get total message count
    const { data: profile } = await getGmailProfile();
    totalMessages = profile?.messagesTotal || 0;

    // Limit to maxResults or total messages, whichever is smaller
    messagesToScan = Math.min(maxResults, totalMessages);
    log(`Total messages in inbox: ${totalMessages}, will scan up to ${messagesToScan}`);

    // Initial progress callback
    updateProgress('initializing');

    do {
      log(`Scanning batch, current newsletters found: ${newsletters.size}`);
      const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 100,
        pageToken: nextPageToken,
      });

      const messages = res.data.messages || [];

      // Filter out messages we've already processed
      const newMessages = messages.filter((msg) => !processedIds.has(msg.id!));

      if (debug && newMessages.length < messages.length) {
        log(`Skipped ${messages.length - newMessages.length} already processed messages`);
      }

      // Add these messages to processed set
      newMessages.forEach((msg) => processedIds.add(msg.id!));
      scannedCount += newMessages.length;

      updateProgress('scanning');
      log(`Retrieved ${newMessages.length} messages, total scanned: ${scannedCount}/${messagesToScan}`);

      const chunks = chunkArray(newMessages, batchSize);

      for (const chunk of chunks) {
        const results = await Promise.allSettled(chunk.map((msg) => fetchEmailMetadataOnly(msg.id!)));

        // Update processed count for each email we attempt to process
        for (let i = 0; i < results.length; i++) {
          processedCount++;

          const r = results[i];
          if (r.status === 'fulfilled' && r.value.data) {
            const email = r.value.data;

            if (isNewsletter(email)) {
              const { id, from, unsubscribeUrl } = email;
              const { name, address } = from;

              if (!newsletters.has(address)) {
                // Get favicon URL for this newsletter
                const faviconUrl = getFaviconFromEmail(address);

                // Using first email ID as newsletter ID
                newsletters.set(address, {
                  id,
                  name,
                  address,
                  unsubscribeUrl,
                  faviconUrl: faviconUrl || undefined,
                });

                // Update progress with new newsletter found
                updateProgress('processing');
              }
            }

            // Update progress every few emails to show incremental progress
            if (processedCount % 5 === 0) {
              updateProgress();
            }
          }
        }

        if (processedCount >= messagesToScan) break;
      }

      nextPageToken = res.data.nextPageToken || undefined;
    } while (nextPageToken && processedCount < messagesToScan);

    const newsletterArray = Array.from(newsletters.values());
    const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    log(
      `Scan complete. Found ${newsletterArray.length} unique newsletters after scanning ${processedCount}/${totalMessages} emails in ${timeElapsed}s`
    );

    // Final progress update
    updateProgress('completed');

    return newsletterArray;
  } catch (error: any) {
    console.error('Newsletter scan failed:', error);
    updateProgress('error');
    return `Scan failed: ${error.message || error}`;
  }
};
