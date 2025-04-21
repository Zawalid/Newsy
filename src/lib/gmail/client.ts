import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { getAccountByUserId } from "@/data-access/accounts";

export const getGmailClient = async () => {
  const session = await auth();

  if (!session || !session.user) throw new Error("Not authenticated");

  const account = await getAccountByUserId(session.user.id!);

  if (!account) throw new Error("Google account not found");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
};
