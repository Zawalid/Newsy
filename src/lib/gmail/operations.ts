"use server";

import { DISPLAYED_EMAILS_COUNT } from "@/utils/constants";
import { filterObject } from "../utils";
import { getGmailClient } from "./client";
import { parseEmail } from "./parser";
import { getNewsletterQuery } from "../newsletter/detector";

// Helper function to handle errors consistently
const handleGmailError = (error: any): APIError => ({
  message: error.message,
  code: error.code || 500,
});

// Helper function for common Gmail operations
const performGmailOperation = async <T>(
  operation: (gmail: Gmail) => Promise<T>,
): Promise<APIResponse<T>> => {
  try {
    const gmail = await getGmailClient();
    const result = await operation(gmail);
    return { data: result };
  } catch (error: any) {
    return { error: handleGmailError(error) };
  }
};

export const fetchEmail = async (
  emailId: string,
): Promise<APIResponse<Email>> => {
  return performGmailOperation(async (gmail) => {
    const res = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "raw",
    });

    const raw = res.data.raw || "";
    const decoded = Buffer.from(raw, "base64").toString("utf-8");
    return await parseEmail(decoded, emailId, res.data.labelIds || []);
  });
};

export const fetchEmails = async (
  query: string,
  maxResults = DISPLAYED_EMAILS_COUNT,
  pageToken?: string,
): Promise<APIResponse<EmailsListResponse>> => {
  return performGmailOperation(async (gmail) => {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: getNewsletterQuery(query),
      maxResults,
      pageToken,
    });

    const messages = res.data.messages || [];
    const emails = await Promise.all(
      messages.map((msg) => fetchEmail(msg.id!)),
    );

    return {
      emails: emails
        .filter((e) => e.data)
        .map((e) =>
          filterObject(
            e.data!,
            ["threadId", "attachments", "body", "priority", "to"],
            "exclude",
          ),
        ) as Email[],
      nextPageToken: res.data.nextPageToken,
    };
  });
};

export const modifyLabels = async (
  id: string,
  addLabelIds: string[] = [],
  removeLabelIds: string[] = [],
) => {
  return performGmailOperation(async (gmail) => {
    await gmail.users.messages.modify({
      userId: "me",
      id,
      requestBody: { addLabelIds, removeLabelIds },
    });
    return { success: true };
  });
};

export const markEmailAsReadOrUnread = async (
  id: string,
  as: "UNREAD" | "READ",
) => {
  return as === "UNREAD"
    ? modifyLabels(id, ["UNREAD"])
    : modifyLabels(id, [], ["UNREAD"]);
};

export const moveEmailToTrash = async (
  id: string,
  isPermanent: boolean = false,
) => {
  return performGmailOperation(async (gmail) => {
    if (isPermanent) {
      await gmail.users.messages.delete({ userId: "me", id });
    } else {
      await gmail.users.messages.trash({ userId: "me", id });
    }
    return { success: true };
  });
};

export const untrashEmail = async (id: string) => {
  return performGmailOperation(async (gmail) => {
    await gmail.users.messages.untrash({ userId: "me", id });
    return { success: true };
  });
};

export const starEmail = async (id: string) => {
  return modifyLabels(id, ["STARRED"]);
};

export const unstarEmail = async (id: string) => {
  return modifyLabels(id, [], ["STARRED"]);
};
