import { NextResponse } from 'next/server';
import { db } from '@/db';
import { scanJobs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getGmailClient } from '@/lib/gmail/client';
import { fetchEmailMetadataOnly } from '@/lib/gmail/operations';
import { getFaviconFromEmail, isNewsletter } from '@/lib/gmail/utils';
import { DEFAULT_GMAIL_LIST_PAGE_SIZE, DEFAULT_CHUNK_SIZE } from '@/utils/constants';

// Helper to chunk arrays (from your original code)
const chunkArray = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

const mergeUniqueSenders = (existing: NewNewsletter[], newSenders: NewNewsletter[]): Newsletter[] => {
  const uniqueMap = new Map<string, Newsletter>();
  existing.forEach((n) => uniqueMap.set(n.address, n as Newsletter));
  newSenders.forEach((n) => {
    if (!uniqueMap.has(n.address)) uniqueMap.set(n.address, n as Newsletter);
    else {
      // Update existing entry if new one has more info
      const current = uniqueMap.get(n.address)!;
      if (!current.faviconUrl && n.faviconUrl) current.faviconUrl = n.faviconUrl;
      if (!current.unsubscribeUrl && n.unsubscribeUrl) current.unsubscribeUrl = n.unsubscribeUrl;
    }
  });
  return Array.from(uniqueMap.values());
};

export async function POST(request: Request) {
  const { jobId } = await request.json();
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

  let job: ScanJob | undefined;
  try {
    const updatedJobs = await db
      .update(scanJobs)
      .set({ status: 'PROCESSING', updatedAt: new Date() })
      // Only process if PENDING, prevents race conditions if triggers overlap
      .where(and(eq(scanJobs.id, jobId), eq(scanJobs.status, 'PENDING')))
      .returning();

    if (updatedJobs.length === 0) {
      // Could be already processing, completed, failed, or non-existent
      console.log(`Job ${jobId} not found or not in PENDING state. Skipping processing.`);
      // Attempt to fetch to see current status for logging/debugging
      const currentJob = await db.query.scanJobs.findFirst({
        where: eq(scanJobs.id, jobId),
        columns: { status: true },
      });
      console.log(`Current status of job ${jobId}: ${currentJob?.status || 'Not Found'}`);
      return NextResponse.json({ message: 'Job not processed (not pending or not found)' });
    }
    job = updatedJobs[0];

    // Initialize startedAt on the first processing run
    if (!job.startedAt) {
      job = (await db.update(scanJobs).set({ startedAt: new Date() }).where(eq(scanJobs.id, jobId)).returning())[0];
    }

    const gmail = await getGmailClient();
    if (!gmail) throw new Error(`Could not get Gmail client for user ${job.userId}`);

    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: DEFAULT_GMAIL_LIST_PAGE_SIZE,
      pageToken: job.currentPageToken ?? undefined,
    });

    const messages = listResponse.data.messages || [];
    const nextPageToken = listResponse.data.nextPageToken;
    const messageIds = messages.map((m) => m.id).filter((id): id is string => !!id);

    let processedInThisChunk = 0;
    const newlyFoundSenders: NewNewsletter[] = [];

    if (messageIds.length > 0) {
      const metadataChunks = chunkArray(messageIds, DEFAULT_CHUNK_SIZE);

      for (const idChunk of metadataChunks) {
        // Check if we've already processed enough emails overall *before* fetching more
        if (job.emailsProcessedCount + processedInThisChunk >= job.totalEmailsToScan) {
          console.log(`Job ${jobId}: Reached scan limit (${job.totalEmailsToScan}), stopping metadata fetch.`);
          break;
        }

        const results = await Promise.allSettled(idChunk.map((id) => fetchEmailMetadataOnly(id)));

        for (const result of results) {
          if (job.emailsProcessedCount + processedInThisChunk >= job.totalEmailsToScan) break;

          processedInThisChunk++;

          if (result.status === 'fulfilled' && result.value.data) {
            const emailMeta = result.value.data;
            if (isNewsletter(emailMeta)) {
              const { from, unsubscribeUrl = null } = emailMeta;
              const { name, address } = from;

              const faviconUrl = getFaviconFromEmail(address);

              // Create potential newsletter object
              newlyFoundSenders.push({
                id: address, // Using email ID, consider if sender address is better
                name: name || address,
                address,
                unsubscribeUrl,
                faviconUrl,
              });
            }
          } else if (result.status === 'rejected') {
            console.warn(`Job ${jobId}: Failed to fetch metadata for an email:`, result.reason);
          }
        }
        if (job.emailsProcessedCount + processedInThisChunk >= job.totalEmailsToScan) break;
      }
    }

    // 5. Update DB State
    const emailsProcessedCount = job.emailsProcessedCount + processedInThisChunk;
    const discoveredNewsletters = mergeUniqueSenders(job.discoveredNewsletters || [], newlyFoundSenders);
    const isComplete = !nextPageToken || emailsProcessedCount >= job.totalEmailsToScan;

    const updateData: Partial<ScanJob> = {
      emailsProcessedCount,
      discoveredNewsletters,
      newslettersFoundCount: discoveredNewsletters.length,
      currentPageToken: nextPageToken || null,
    };

    if (isComplete) {
      updateData.status = 'COMPLETED';
      updateData.result = discoveredNewsletters;
      updateData.discoveredNewsletters = [];
      updateData.completedAt = new Date();
      console.log(
        `Job ${jobId}: Scan completed. Processed ${emailsProcessedCount} emails. Found ${discoveredNewsletters.length} newsletters.`
      );
    } else {
      updateData.status = 'PENDING'; // Set back to pending for the next trigger
      console.log(
        `Job ${jobId}: Chunk processed. Processed ${emailsProcessedCount}/${job.totalEmailsToScan}. Found ${discoveredNewsletters.length}. Next page: ${!!nextPageToken}`
      );
    }

    await db.update(scanJobs).set(updateData).where(eq(scanJobs.id, jobId));

    // 6. Re-trigger if necessary
    if (!isComplete) {
      const processUrl = `${process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin}/api/scan/process`;
      fetch(processUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      }).catch((error) => console.error(`Error triggering next chunk for job ${jobId}:`, error));
    }

    return NextResponse.json({ message: `Job ${jobId} chunk processed.` });
  } catch (error: any) {
    console.error(`Error processing job ${jobId}:`, error);
    if (job) {
      await db
        .update(scanJobs)
        .set({ status: 'FAILED', error: error.message || 'Unknown processing error', updatedAt: new Date() })
        .where(eq(scanJobs.id, jobId));
    }

    return NextResponse.json(
      { message: `Job ${jobId} failed during processing.`, error: error.message },
      { status: 200 }
    );
  }
}
