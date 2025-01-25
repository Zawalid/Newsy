import { OAuth2Client } from "google-auth-library";
import axios, { AxiosError } from "axios";
import { AddressObject, simpleParser } from "mailparser";

export async function getEmail(
  client: OAuth2Client,
  emailId: string
): Promise<{ email: Email | null; error: { message: string; status: number } | null }> {
  try {
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
      email: {
        id: emailId,
        threadId,
        snippet,
        isRead: !labelIds.includes("UNREAD"),
        isStarred: labelIds.includes("STARRED"),
        labels: labelIds,
        from: from?.value,
        to: (to as AddressObject)?.value,
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
      },
      error: null,
    };
  } catch (error) {
    return {
      email: null,
      error: {
        message: (error as AxiosError).message,
        status: (error as AxiosError).response?.status || 500,
      },
    };
  }
}

export async function listEmails(
  client: OAuth2Client,
  query: string,
  maxResults = 10
): Promise<{ emails: Email[] | null; error: { message: string; status: number } | null }> {
  try {
    const response = await axios.get("https://www.googleapis.com/gmail/v1/users/me/messages", {
      headers: {
        Authorization: `Bearer ${client.credentials.access_token}`,
      },
      params: {
        maxResults,
        q: query,
      },
    });

    const messages = response.data.messages || [];
    const emails = await Promise.all(
      messages.map(async (email: { id: string }) => {
        const { email: emailData, error } = await getEmail(client, email.id);
        if (error) {
          throw new Error(error.message);
        }
        return emailData;
      })
    );

    return {
      emails: emails.filter((email) => email !== null) as Email[],
      error: null,
    };
  } catch (error) {
    return {
      emails: null,
      error: {
        message: (error as AxiosError).message,
        status: (error as AxiosError).response?.status || 500,
      },
    };
  }
}
