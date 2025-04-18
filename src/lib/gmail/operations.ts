"use server";

import { DISPLAYED_EMAILS_COUNT } from "@/utils/constants";
import { filterObject } from "../utils";
import { getGmailClient } from "./client";
import { parseEmail } from "./parser";
import { getNewsletterQuery } from "../newsletter/detector";

export const fetchEmail = async (emailId: string): Promise<APIResponse<Email>> => {
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

export const fetchEmails = async (
  query: string,
  maxResults = DISPLAYED_EMAILS_COUNT,
  pageToken?: string
): Promise<APIResponse<EmailsListResponse>> => {
  try {
    const gmail = await getGmailClient();
    const res = await gmail.users.messages.list({
      userId: "me",
      q: getNewsletterQuery(query),
      maxResults,
      pageToken,
    });

    const messages = res.data.messages || [];
    const emails = await Promise.all(messages.map((msg) => fetchEmail(msg.id!)));

    return {
      data: {
        emails: emails
          .filter((e) => e.data)
          .map((e) =>
            filterObject(
              e.data!,
              ["threadId", "attachments", "body", "labels", "priority", "to"],
              "exclude"
            )
          ) as Email[],

        nextPageToken: res.data.nextPageToken,
      },
    };
  } catch (error: any) {
    return { error: { message: error.message, code: error.code || 500 } };
  }
};

export const markEmailAsReadOrUnread = async (id: string, as: "UNREAD" | "READ") => {
  try {
    const gmail = await getGmailClient();
    await gmail.users.messages.modify({
      userId: "me",
      id,
      requestBody: as === "UNREAD" ? { addLabelIds: ["UNREAD"] } : { removeLabelIds: ["UNREAD"] },
    });
    return { success: true };
  } catch (error: any) {
    return { error: { message: error.message, code: error.code || 500 } };
  }
};

export const deleteEmail = async (id: string, isPermanent: boolean = false) => {
  try {
    const gmail = await getGmailClient();
    if (isPermanent) return await gmail.users.messages.delete({ userId: "me", id });
    await gmail.users.messages.trash({ userId: "me", id });
    return { success: true };
  } catch (error: any) {
    return { error: { message: error.message, code: error.code || 500 } };
  }
};

export const untrashEmail = async (id: string) => {
  try {
    const gmail = await getGmailClient();
    await gmail.users.messages.untrash({ userId: "me", id });
    return { success: true };
  } catch (error: any) {
    return { error: { message: error.message, code: error.code || 500 } };
  }
};
