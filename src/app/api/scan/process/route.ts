import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { newslettersCatalog, scanJobs, users, userSubscriptions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getGmailClient } from '@/lib/gmail/client';
import { fetchEmailMetadataOnly } from '@/lib/gmail/operations';
import { getFaviconFromEmail, isNewsletter } from '@/lib/gmail/utils';
import { DEFAULT_GMAIL_LIST_PAGE_SIZE, DEFAULT_CHUNK_SIZE } from '@/utils/constants';

const chunkArray = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

const mergeUniqueSenders = (existing: DiscoveredNewsletter[], newSenders: DiscoveredNewsletter[]) => {
  const uniqueMap = new Map<string, DiscoveredNewsletter>();
  existing.forEach((n) => uniqueMap.set(n.address, n));
  newSenders.forEach((n) => {
    if (!uniqueMap.has(n.address)) uniqueMap.set(n.address, n);
    else {
      // Update existing entry if new one has more info
      const current = uniqueMap.get(n.address)!;
      if (!current.faviconUrl && n.faviconUrl) current.faviconUrl = n.faviconUrl;
      if (!current.unsubscribeUrl && n.unsubscribeUrl) current.unsubscribeUrl = n.unsubscribeUrl;
    }
  });
  return Array.from(uniqueMap.values());
};

const buildGmailQueryString = (categories?: ScanSettings['categories'] | null): string | undefined => {
  const queryParts: string[] = [];
  const categoryQueryParts: string[] = [];

  if (categories) {
    if (categories.primary) categoryQueryParts.push('category:primary');
    if (categories.promotions) categoryQueryParts.push('category:promotions');
    if (categories.social) categoryQueryParts.push('category:social');
    if (categories.updates) categoryQueryParts.push('category:updates');
    if (categories.forums) categoryQueryParts.push('category:forums');
  }

  if (categoryQueryParts.length > 0 && categoryQueryParts.length < 5) {
    queryParts.push(`(${categoryQueryParts.join(' OR ')})`);
  }

  return queryParts.length > 0 ? queryParts.join(' ') : undefined;
};

export async function POST(request: NextRequest) {
  const { jobId } = await request.json();

  if (!jobId || isNaN(parseInt(jobId))) {
    return NextResponse.json(
      { success: false, error: { message: 'Invalid scan ID provided. Please start a new scan.', code: 400 } },
      { status: 400 }
    );
  }

  let job: ScanJob | undefined;
  try {
    const updatedJobs = await db
      .update(scanJobs)
      .set({ status: 'PROCESSING', updatedAt: new Date() })
      .where(and(eq(scanJobs.id, jobId), eq(scanJobs.status, 'PENDING')))
      .returning();

    if (updatedJobs.length === 0) {
      // Could be already processing, completed, failed, or non-existent
      console.log(`Job ${jobId} not found or not in PENDING state. Skipping processing.`);
      const currentJob = await db.query.scanJobs.findFirst({
        where: eq(scanJobs.id, jobId),
        columns: { status: true },
      });
      console.log(`Current status of job ${jobId}: ${currentJob?.status || 'Not Found'}`);
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Your scan is already being processed or has finished.', code: 400 },
        },
        { status: 400 }
      );
    }
    job = updatedJobs[0];

    if (!job.startedAt) {
      job = (await db.update(scanJobs).set({ startedAt: new Date() }).where(eq(scanJobs.id, jobId)).returning())[0];
    }

    const gmail = await getGmailClient(job.userId);
    if (!gmail) {
      throw new Error("We couldn't access your Gmail account. Please check your Google permissions and try again.");
    }

    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: DEFAULT_GMAIL_LIST_PAGE_SIZE,
      pageToken: job.currentPageToken ?? undefined,
      q: buildGmailQueryString(job.categories as ScanSettings['categories']),
    });

    const messages = listResponse.data.messages || [];
    const nextPageToken = listResponse.data.nextPageToken;
    const messageIds = messages.map((m) => m.id).filter((id): id is string => !!id);

    let processedInThisChunk = 0;
    const newlyFoundSenders: DiscoveredNewsletter[] = [];

    if (messageIds.length > 0) {
      const metadataChunks = chunkArray(messageIds, DEFAULT_CHUNK_SIZE);

      for (const idChunk of metadataChunks) {
        if (job.emailsProcessedCount + processedInThisChunk >= job.totalEmailsToScan) {
          console.log(`Job ${jobId}: Reached scan limit (${job.totalEmailsToScan}), stopping metadata fetch.`);
          break;
        }

        const results = await Promise.allSettled(idChunk.map((id) => fetchEmailMetadataOnly(id, job?.userId)));

        for (const result of results) {
          if (job.emailsProcessedCount + processedInThisChunk >= job.totalEmailsToScan) break;

          processedInThisChunk++;

          if (result.status === 'fulfilled' && result.value.success && result.value.data) {
            const emailMeta = result.value.data;
            if (isNewsletter(emailMeta, job.smartFiltering!)) {
              const { from, unsubscribeUrl = null } = emailMeta;
              const { name, address } = from;

              const faviconUrl = getFaviconFromEmail(address);

              newlyFoundSenders.push({
                id: address,
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
      // updateData.discoveredNewsletters = [];
      updateData.completedAt = new Date();
      console.log(
        `Job ${jobId}: Scan completed. Processed ${emailsProcessedCount} emails. Found ${discoveredNewsletters.length} newsletters.`
      );

      if (!job.userId) {
        return NextResponse.json(
          { success: false, error: { message: 'User ID not found.', code: 500 } },
          { status: 500 }
        );
      }

      if (discoveredNewsletters.length > 0) {
        for (const newsletter of discoveredNewsletters) {
          if (!newsletter.address) continue;

          await db
            .insert(newslettersCatalog)
            .values({ name: newsletter.name, address: newsletter.address, faviconUrl: newsletter.faviconUrl })
            .onConflictDoNothing()
            .returning({ id: newslettersCatalog.id, name: newslettersCatalog.name });

          const newCatalogEntry = await db.query.newslettersCatalog.findFirst({
            where: eq(newslettersCatalog.address, newsletter.address),
            columns: { id: true },
          });

          if (!newCatalogEntry || !newCatalogEntry.id) {
            throw new Error(`Failed to insert newsletter ${newsletter.name} into the catalog.`);
          }

          await db
            .insert(userSubscriptions)
            .values({ userId: job.userId, newsletterId: newCatalogEntry.id, unsubscribeUrl: newsletter.unsubscribeUrl })
            .onConflictDoNothing();

          console.log(
            `Job ${jobId}: Added newsletter ${newsletter.name} to user ${job.userId}'s subscriptions and to the catalog.`
          );
        }
      }

      // Mark the user as onboarded anyways if they don't click on the cta button after the scan
      await db.update(users).set({ hasOnboarded: true }).where(eq(users.id, job.userId));
    } else {
      updateData.status = 'PENDING';
      console.log(
        `Job ${jobId}: Chunk processed. Processed ${emailsProcessedCount}/${job.totalEmailsToScan}. Found ${discoveredNewsletters.length}. Next page: ${!!nextPageToken}`
      );
    }

    await db.update(scanJobs).set(updateData).where(eq(scanJobs.id, jobId));

    if (!isComplete) {
      const processUrl = `${process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin}/api/scan/process`;
      fetch(processUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      }).catch((error) => {
        console.error(`Error triggering next chunk for job ${jobId}:`, error);
        db.update(scanJobs)
          .set({
            error: 'We had trouble processing all your emails. The scan results may be incomplete.',
            status: 'FAILED',
          })
          .where(eq(scanJobs.id, jobId))
          .catch((e) => console.error('Failed to update job after continuation error:', e));
      });
    }

    return NextResponse.json({
      success: true,
      data: { jobId, status: isComplete ? 'COMPLETED' : 'PROCESSING' },
      status: isComplete ? 200 : 202,
    });
  } catch (error: any) {
    console.error(`Error processing job ${jobId}:`, error);

    let userFriendlyMessage = "We're having trouble scanning your inbox. Please try again later.";

    // Provide more specific messages for common errors
    if (error.message?.includes('Gmail')) {
      userFriendlyMessage =
        "We couldn't access your Gmail account. Please check your Google permissions and try again.";
    } else if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
      userFriendlyMessage = "We've reached the limit for Gmail requests. Please wait a few minutes and try again.";
    } else if (error.message?.includes('token') || error.message?.includes('auth')) {
      userFriendlyMessage = 'Your Google login has expired. Please sign in again to continue scanning.';
    }

    if (job) {
      await db
        .update(scanJobs)
        .set({ status: 'FAILED', error: userFriendlyMessage, updatedAt: new Date(), completedAt: new Date() })
        .where(eq(scanJobs.id, jobId));
    }

    return NextResponse.json({ success: false, error: { message: userFriendlyMessage, code: 500 } }, { status: 500 });
  }
}
