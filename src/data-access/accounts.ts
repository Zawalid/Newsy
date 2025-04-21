import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { accounts } from "@/db/schema";

export async function getAccountByUserId(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: (accounts, { eq }) => and(eq(accounts.userId, userId), eq(accounts.provider, "google")),
    columns: { accessToken: true, refreshToken: true, expiresAt: true, providerAccountId: true },
  });

  return account;
}

export const updateAccountTokens = async (
  newTokens: { access_token: string; expires_at: number; refresh_token?: string },
  googleId: string
) => {
  await db
    .update(accounts)
    .set({
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token,
      expiresAt: newTokens.expires_at,
    })
    .where(and(eq(accounts.provider, "google"), eq(accounts.providerAccountId, googleId)));
};
