import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { db } from "../db";

export const getGmailClient = async () => {
  const session = await auth();

  if (!session || !session.user) throw new Error("Not authenticated");

  const account = await db.account.findFirst({
    where: { userId: session.user.id, provider: "google" },
    select: { access_token: true, refresh_token: true },
  });

  if (!account) throw new Error("Google account not found");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
};
