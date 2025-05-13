// app/api/scan/status/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { scanJobs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUserIdFromSession } from '@/lib/auth';

const getChunk = (event: string, data: any): string => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const userId = await getUserIdFromSession();

  if (!jobId || isNaN(parseInt(jobId))) {
    return NextResponse.json({ error: 'Missing or invalid jobId' }, { status: 400 });
  }

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const jobIdNum = parseInt(jobId);

  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout | undefined;

  const readableStream = new ReadableStream({
    async start(controller) {
      const cleanup = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
        // Check if controller is already closed before trying to close
        if (controller.desiredSize !== null && (controller.desiredSize === undefined || controller.desiredSize > 0)) {
          controller.close();
        }
      };

      // Returns true if stream should be closed
      const fetchAndSendData = async (): Promise<boolean> => {
        if (!userId) {
          controller.enqueue(
            encoder.encode(
              getChunk('auth-error', { message: 'Your session has expired. Please sign in again to continue.' })
            )
          );
          return true;
        }
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
              startedAt: true,
              completedAt: true,
            },
          });

          if (!job) {
            controller.enqueue(
              encoder.encode(
                getChunk('job-error', {
                  message:
                    "We couldn't find this scan. It may have been deleted or you don't have permission to view it.",
                })
              )
            );
            return true;
          }

          if (job.status === 'COMPLETED') {
            controller.enqueue(encoder.encode(getChunk('job-completed', job)));
            return true;
          } else if (job.status === 'FAILED') {
            controller.enqueue(encoder.encode(getChunk('job-failed', job)));
            return true;
          } else {
            controller.enqueue(encoder.encode(getChunk('job-status', job)));
            return false;
          }
        } catch (error: any) {
          console.error(`SSE Error (Job ${jobIdNum}): Failed to fetch scan status - ${error.message}`); // Necessary log
          controller.enqueue(
            encoder.encode(
              getChunk('job-error', {
                message: "We're having trouble getting your scan status. Please try refreshing the page.",
              })
            )
          );
          return true;
        }
      };

      const shouldCloseAfterInitialSend = await fetchAndSendData();
      if (shouldCloseAfterInitialSend) {
        cleanup();
        return;
      }

      intervalId = setInterval(async () => {
        const shouldClose = await fetchAndSendData();
        if (shouldClose) cleanup();
      }, 1000);
    },
    cancel() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
