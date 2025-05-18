import { db } from '@/db';
import { userSubscriptions } from '@/db/schema';
import { getUserIdFromSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized', code: 401 } }, { status: 401 });
  }

  const subscriptions = await db.query.userSubscriptions.findMany({
    where: eq(userSubscriptions.userId, userId),
  });

  if (!subscriptions) {
    return NextResponse.json(
      { success: false, error: { message: 'No subscriptions found', code: 404 } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: subscriptions }, { status: 200 });
}
