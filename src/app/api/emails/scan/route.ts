import { NextResponse } from 'next/server';
import { scanInbox } from '@/lib/gmail/scanner';

export async function GET() {
  try {
    const result = await scanInbox({
      maxResults: 400,
      debug: false,
      progressCallback: (progress) => {
        const elapsed = progress.elapsedTime.toFixed(1);
        const remaining = progress.estimatedTimeRemaining ? progress.estimatedTimeRemaining.toFixed(1) : '...';
        const speed = progress.processingSpeed ? progress.processingSpeed.toFixed(1) : '0';

        console.log(
          `[${progress.status.toUpperCase()}] ` +
            `Scanned: ${progress.scannedCount}/${progress.totalToScan} emails ` +
            `(${progress.percentComplete.toFixed(1)}%) | ` +
            `Found: ${progress.newslettersFound} newsletters | ` +
            `Time: ${elapsed}s elapsed, ~${remaining}s remaining | ` +
            `Speed: ${speed} emails/sec`
        );
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
