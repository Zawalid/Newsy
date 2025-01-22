import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { simpleParser } from "mailparser";

export async function getEmail(client: OAuth2Client, emailId: string): Promise<Email> {
  const res = await axios.get(
    `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`,
    {
      headers: {
        Authorization: `Bearer ${client.credentials.access_token}`,
      },
      params: {
        format: "raw",
      },
    }
  );

  const { labelIds, snippet, threadId } = res.data;

  const rawEmail = res.data.raw || "";
  const decodedEmail = Buffer.from(rawEmail, "base64").toString("utf-8");
  const parsed = await simpleParser(decodedEmail);

  const { from, to, subject, text, html, attachments, date, priority } = parsed;

  return {
    id: emailId,
    threadId,
    snippet,
    isRead: !labelIds.includes("UNREAD"),
    isStarred: labelIds.includes("STARRED"),
    labels: labelIds,
    from: from?.value,
    to: Array.isArray(to) ? to.map((address) => address.value) : to?.value,
    date,
    subject,
    body: {
      html,
      text,
    },
    attachments: attachments.map((att) => ({
      filename: att.filename,
      contentType: att.contentType,
      size: att.size,
    })),
    priority,
  };
}

export async function listEmails(client: OAuth2Client, query: string, maxResults = 10): Promise<Email[]> {
  const response = await axios.get(
    "https://www.googleapis.com/gmail/v1/users/me/messages",
    {
      headers: {
        Authorization: `Bearer ${client.credentials.access_token}`,
      },
      params: {
        maxResults,
        q: query,
      },
    }
  );

  const messages = response.data.messages || [];
  return Promise.all(messages.map(async (email: { id: string }) => getEmail(client, email.id)));
}
