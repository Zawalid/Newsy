import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { scanJobs } from '@/db/schema';
import { getUserIdFromSession } from '@/lib/auth';

export async function POST(request: Request) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: { jobId: number };
  try {
    payload = await request.json();
    if (typeof payload.jobId !== 'number') {
      return NextResponse.json({ error: 'Invalid jobId provided' }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Malformed request body' }, { status: 400 });
  }

  const { jobId } = payload;

  try {
    const job = await db.query.scanJobs.findFirst({
      where: and(eq(scanJobs.id, jobId), eq(scanJobs.userId, userId)),
      columns: { status: true },
    });

    if (!job) return NextResponse.json({ error: 'Scan job not found or access denied' }, { status: 404 });

    if (job.status !== 'PENDING' && job.status !== 'PROCESSING') {
      return NextResponse.json(
        { message: `Scan job is already ${job.status} and cannot be cancelled.` },
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
      return NextResponse.json({ error: 'Failed to cancel scan job, or job already terminal.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Scan job cancelled successfully', jobId: updatedJob.id });
  } catch (error: any) {
    console.error(`Error cancelling scan job ${jobId} for user ${userId}:`, error);
    return NextResponse.json({ error: 'Failed to cancel scan job due to an internal error.' }, { status: 500 });
  }
}
