import { Headers } from "mailparser";

declare global {
  interface Email {
    id: string;
    threadId: string;
    snippet: string;
    isRead: boolean;
    isStarred: boolean;
    labels: string[];
    from?: AddressBody;
    to?: AddressBody;
    date?: Date;
    subject?: string;
    body: {
      html?: string;
      text?: string;
    };
    attachments: EmailAttachment[];
    priority?: "normal" | "low" | "high";
    headers?: Headers;
  }

  interface EmailAttachment {
    filename?: string;
    contentType?: string;
    size?: number;
  }

  interface AddressBody {
    name?: string;
    address: string;
  }

  interface APIError {
    message: string;
    code?: number;
  }

  interface APIResponse<T> {
    data?: T;
    error?: APIError;
  }

  type EmailsListResponse = {
    emails: Email[];
    nextPageToken?: string | null;
  };
}
