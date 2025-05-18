import {NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { scanJobs } from '@/db/schema';
import { getUserIdFromSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized', code: 401 } }, { status: 401 });
  }

  let payload: { jobId: number };
  try {
    payload = await request.json();
    if (typeof payload.jobId !== 'number') {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid jobId provided', code: 400 } },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: { message: 'Malformed request body', code: 400 } },
      { status: 400 }
    );
  }

  const { jobId } = payload;

  try {
    const job = await db.query.scanJobs.findFirst({
      where: and(eq(scanJobs.id, jobId), eq(scanJobs.userId, userId)),
      columns: { status: true },
    });

    if (!job)
      return NextResponse.json(
        { success: false, error: { message: 'Scan job not found or access denied', code: 404 } },
        { status: 404 }
      );

    if (job.status !== 'PENDING' && job.status !== 'PROCESSING') {
      return NextResponse.json(
        { success: false, error: { message: `Scan job is already ${job.status} and cannot be cancelled.`, code: 409 } },
        { status: 409 }
      );
    }

    const [updatedJob] = await db
      .update(scanJobs)
      .set({
        status: 'CANCELLED',
        error: 'Scan cancelled by user.',
        completedAt: new Date(),
        currentPageToken: null,
        discoveredNewsletters: [],
      })
      .where(and(eq(scanJobs.id, jobId), eq(scanJobs.userId, userId)))
      .returning({ id: scanJobs.id });

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, error: { message: 'Failed to cancel scan job, or job already terminal.', code: 500 } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { jobId: updatedJob.id, status: 'CANCELLED' } }, { status: 200 });
  } catch (error: any) {
    console.error(`Error cancelling scan job ${jobId} for user ${userId}:`, error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to cancel scan job due to an internal error.', code: 500 } },
      { status: 500 }
    );
  }
}
