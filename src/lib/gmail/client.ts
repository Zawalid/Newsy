import { google } from "googleapis";
import { auth } from "@/lib/auth";

export const getGmailClient = async () => {
  const session = await auth();
  if (!session?.access_token) throw new Error("Not authenticated");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  return google.gmail({
    version: "v1",
    auth: oauth2Client,
  });
};
