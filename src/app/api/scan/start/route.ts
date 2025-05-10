import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { scanJobs } from '@/db/schema';
import { getUserIdFromSession } from '@/lib/auth';
import { getGmailProfile } from '@/lib/gmail/operations';
import { DEFAULT_DEPTH_SIZES, DEFAULT_SCAN_SETTINGS } from '@/utils/constants';

export async function POST(request: Request) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const settings: ScanSettings = (await request.json()).settings || DEFAULT_SCAN_SETTINGS;

  const existingJob = await db.query.scanJobs.findFirst({
    where: sql`${scanJobs.userId} = ${userId} AND ${scanJobs.status} NOT IN ('COMPLETED', 'FAILED')`,
  });
  if (existingJob) {
    return NextResponse.json({ error: 'Scan already in progress', jobId: existingJob.id }, { status: 409 });
  }

  try {
    const profile = await getGmailProfile();
    if (profile.error || !profile.data) {
      console.error('Failed to get Gmail profile:', profile.error);
      return NextResponse.json({ error: 'Failed to get Gmail profile to start scan.' }, { status: 500 });
    }
    const inboxTotalEmails = profile.data.messagesTotal || 0;
    const totalEmailsToScan = Math.min(DEFAULT_DEPTH_SIZES[settings.scanDepth || 'standard'], inboxTotalEmails);

    const [newJob] = await db
      .insert(scanJobs)
      .values({
        userId: userId,
        status: 'PENDING',
        totalEmailsToScan,
        inboxTotalEmails,
        emailsProcessedCount: 0,
        newslettersFoundCount: 0,
        discoveredNewsletters: [],
        ...settings,
      })
      .returning({ id: scanJobs.id });

    const jobId = newJob.id;

    const processUrl = `${process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin}/api/scan/process`;
    fetch(processUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    }).catch((error) => {
      console.error(`Error triggering process for job ${jobId}:`, error);
      db.update(scanJobs)
        .set({ status: 'FAILED', error: 'Failed to trigger initial processing step.' })
        .where(eq(scanJobs.id, jobId))
        .catch((e) => console.error('Failed to mark job as failed after trigger error:', e));
    });

    return NextResponse.json({ message: 'Scan initiated successfully', jobId });
  } catch (error: any) {
    console.error('Error initiating scan:', error);
    const errorMessage = error.message || 'Failed to initiate scan';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
