'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getUserIdFromSession } from '@/lib/auth';

export async function markOnboardingFlowCompleted() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) throw new Error('User not authenticated.');

    await db.update(users).set({ hasOnboarded: true }).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    console.error('Error marking onboarding as completed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update onboarding status',
    };
  }
}

export async function markScanAsSkippedDuringOnboarding() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) throw new Error('User not authenticated.');

    await db.update(users).set({ hasSkippedOnboardingScan: true, hasOnboarded: true }).where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error marking scan as skipped:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark scan as skipped',
    };
  }
}
