import { NextRequest, NextResponse } from 'next/server';
import { and, eq, notInArray } from 'drizzle-orm';
import { db } from '@/db';
import { scanJobs } from '@/db/schema';
import { getUserIdFromSession } from '@/lib/auth';
import { getGmailProfile } from '@/lib/gmail/operations';
import { DEFAULT_DEPTH_SIZES, DEFAULT_SCAN_SETTINGS } from '@/utils/constants';

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId)
    return NextResponse.json({ success: false, error: { message: 'Unauthorized', code: 401 } }, { status: 401 });
  const settings: ScanSettings = (await request.json()).settings || DEFAULT_SCAN_SETTINGS;

  const existingJob = await db.query.scanJobs.findFirst({
    where: and(eq(scanJobs.userId, userId), notInArray(scanJobs.status, ['COMPLETED', 'FAILED', 'CANCELLED'])),
  });
  if (existingJob) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            'You already have a scan in progress. You can view its status or cancel it before starting a new one.',
          code: 409,
        },
        jobId: existingJob.id,
      },
      { status: 409 }
    );
  }

  try {
    const profile = await getGmailProfile();
    if (!profile.success) {
      console.error('Failed to get Gmail profile:', profile.error);
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "We couldn't access your Gmail account. Please check your Google permissions and try again.",
            code: 500,
          },
        },
        { status: 500 }
      );
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
        .set({ status: 'FAILED', error: "We couldn't start processing your emails. Please try again later." })
        .where(eq(scanJobs.id, jobId))
        .catch((e) => console.error('Failed to mark job as failed after trigger error:', e));
    });

    return NextResponse.json({ success: true, data: { jobId, status: 'PENDING' } }, { status: 200 });
  } catch (error: any) {
    console.error('Error initiating scan:', error);
    const errorMessage = error.message || "We couldn't start your scan right now. Please try again later.";
    return NextResponse.json({ success: false, error: { message: errorMessage, code: 500 } }, { status: 500 });
  }
}
