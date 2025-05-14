import { and } from 'drizzle-orm';
import { db } from '@/db';

export async function getAccountByUserId(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: (accounts, { eq }) => and(eq(accounts.userId, userId), eq(accounts.providerId, 'google')),
    columns: { accessToken: true, refreshToken: true },
  });

  return account;
}
