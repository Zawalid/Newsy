import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { scanJobs } from '@/db/schema';
import { getUserIdFromSession } from '@/lib/auth';
import { getGmailProfile } from '@/lib/gmail/operations';
import { DEFAULT_MAX_EMAILS } from '@/utils/constants';

export async function POST(request: Request) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check for existing active job
  const existingJob = await db.query.scanJobs.findFirst({
    where: sql`${scanJobs.userId} = ${userId} AND ${scanJobs.status} NOT IN ('COMPLETED', 'FAILED')`,
  });
  if (existingJob) {
    return NextResponse.json({ error: 'Scan already in progress', jobId: existingJob.id }, { status: 409 });
  }

  try {
    // Determine scan scope
    const profile = await getGmailProfile();
    if (profile.error || !profile.data) {
      console.error('Failed to get Gmail profile:', profile.error);
      return NextResponse.json({ error: 'Failed to get Gmail profile to start scan.' }, { status: 500 });
    }
    const inboxTotalEmails = profile.data.messagesTotal || 0;
    const totalEmailsToScan = Math.min(DEFAULT_MAX_EMAILS, inboxTotalEmails); // Default can be selected from UI later

    // Create Job
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
      })
      .returning({ id: scanJobs.id });

    const jobId = newJob.id;

    // Trigger the first processing step asynchronously
    const processUrl = `${process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin}/api/scan/process`;
    fetch(processUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' /* Add internal auth header if needed */ },
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
