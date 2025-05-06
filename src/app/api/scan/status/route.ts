import { NextResponse } from 'next/server';
import { db } from '@/db';
import { scanJobs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUserIdFromSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const userId = await getUserIdFromSession();

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!jobId || isNaN(parseInt(jobId))) {
    return NextResponse.json({ error: 'Missing or invalid jobId' }, { status: 400 });
  }
  const jobIdNum = parseInt(jobId);

  try {
    const job = await db.query.scanJobs.findFirst({
      where: and(eq(scanJobs.id, jobIdNum), eq(scanJobs.userId, userId)),
      columns: {
        id: true,
        status: true,
        emailsProcessedCount: true,
        totalEmailsToScan: true,
        newslettersFoundCount: true,
        error: true,
        result: true,
        // discoveredNewsletters: true, // Optionally return partials during processing? Maybe too much data.
        startedAt: true,
        updatedAt: true,
        completedAt: true,
      },
    });

    if (!job) return NextResponse.json({ error: 'Scan job not found or access denied' }, { status: 404 });
    return NextResponse.json(job);
  } catch (error) {
    console.error(`Error fetching status for job ${jobIdNum}:`, error);
    return NextResponse.json({ error: 'Failed to fetch scan status' }, { status: 500 });
  }
}
