import { google } from "googleapis";
import { simpleParser, AddressObject } from "mailparser";
import { oauth2Client, setCredentials } from "./google-auth";

export async function getEmail(
  emailId: string
): Promise<{ email: Email | null; error: { message: string; status: number } | null }> {
  try {
    setCredentials();

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const res = await gmail.users.messages.get({ userId: "me", id: emailId, format: "raw" });

    const { labelIds, snippet, threadId } = res.data;

    const rawEmail = res.data.raw || "";
    const decodedEmail = Buffer.from(rawEmail, "base64").toString("utf-8");
    const parsed = await simpleParser(decodedEmail);

    const { from, to, subject, text, html, attachments, date, priority } = parsed;

    return {
      email: {
        id: emailId,
        threadId: threadId || "",
        snippet: snippet || "",
        isRead: !(labelIds || []).includes("UNREAD"),
        isStarred: (labelIds || []).includes("STARRED"),
        labels: labelIds || [],
        from: from?.value,
        to: (to as AddressObject)?.value,
        date,
        subject,
        body: {
          html,
          text,
        },
        attachments: (attachments || []).map((att) => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.size,
        })),
        priority,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      email: null,
      error: {
        message: error.message,
        status: error.code || 500,
      },
    };
  }
}

export async function listEmails(
  query: string,
  maxResults = 10
): Promise<{ emails: Email[] | null; error: { message: string; status: number } | null }> {
  try {
    setCredentials();

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.list({ userId: "me", q: query, maxResults });

    const messages = response.data.messages || [];
    console.log("messages", messages.length);

    const emails = await Promise.all(
      messages.map(async (message) => {
        const { email, error } = await getEmail(message.id || "");
        if (error) {
          throw new Error(error.message);
        }
        return email;
      })
    );

    return {
      emails: emails.filter((email) => email !== null) as Email[],
      error: null,
    };
  } catch (error: any) {
    return {
      emails: null,
      error: {
        message: error.message,
        status: error.code || 500,
      },
    };
  }
}
