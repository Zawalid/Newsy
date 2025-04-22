import { Headers } from "mailparser";
import { gmail_v1 } from "googleapis";

declare global {
  // Base Gmail type
  type Gmail = gmail_v1.Gmail;

  type EmailPriority = "normal" | "low" | "high";

  type EmailAction =
    | "markAsRead"
    | "markAsUnread"
    | "star"
    | "unstar"
    | "markAsImportant"
    | "markAsUnimportant"
    | "moveToTrash"
    | "removeFromTrash";

  // Email-related interfaces
  interface AddressBody {
    name?: string;
    address: string;
  }

  interface EmailAttachment {
    filename?: string;
    contentType?: string;
    size?: number;
  }

  interface EmailBody {
    html?: string;
    text?: string;
  }

  interface Email {
    id: string;
    threadId: string;
    snippet: string;
    subject?: string;
    body: EmailBody;

    isRead: boolean;
    isStarred: boolean;
    isImportant: boolean;
    labels: string[];
    priority?: EmailPriority;

    from?: AddressBody;
    to?: AddressBody;
    date?: Date;
    headers?: Headers;
    attachments: EmailAttachment[];
  }

  // API response interfaces
  interface APIError {
    message: string;
    code?: number;
  }

  interface APIResponse<T> {
    data?: T;
    error?: APIError;
  }

  interface EmailsListResponse {
    emails: Email[];
    nextPageToken?: string | null;
  }
}
