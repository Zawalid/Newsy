import { google } from "googleapis";
import { getSession } from "@/lib/auth";
import { getAccountByUserId } from "@/data-access/accounts";
import { env } from "@/env";

export const getGmailClient = async () => {
  const session = await getSession();

  if (!session || !session.user) throw new Error("Not authenticated");

  const account = await getAccountByUserId(session.user.id!);

  if (!account) throw new Error("Google account not found");

  const oauth2Client = new google.auth.OAuth2(
    env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
};
