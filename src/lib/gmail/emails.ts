import { getGmailClient } from "./client";
import { parseEmail } from "./parser";

export const getEmail = async (emailId: string): Promise<GmailResponse<Email>> => {
  try {
    const gmail = await getGmailClient();
    const res = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "raw",
    });

    const raw = res.data.raw || "";
    const decoded = Buffer.from(raw, "base64").toString("utf-8");

    return { data: await parseEmail(decoded, emailId, res.data.labelIds || []) };
  } catch (error: any) {
    return { error: { message: error.message, code: error.code || 500 } };
  }
};

export const listEmails = async (
  query: string,
  maxResults = 10,
  pageToken?: string
): Promise<GmailResponse<Email[]>> => {
  console.log(pageToken);

  try {
    const gmail = await getGmailClient();
    const res = await gmail.users.messages.list({ userId: "me", q: query, maxResults, pageToken });

    const messages = res.data.messages || [];
    const emails = await Promise.all(messages.map((msg) => getEmail(msg.id!)));

    return {
      data: emails.filter((e) => e.data).map((e) => e.data!),
      nextPageToken: res.data.nextPageToken,
    };
  } catch (error: any) {
    return { error: { message: error.message, code: error.code || 500 } };
  }
};
