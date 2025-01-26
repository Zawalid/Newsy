import { EmailAddress } from "mailparser";

declare global {
  type Email = {
    id: string;
    threadId: string | undefined;
    snippet: string | undefined;
    isRead: boolean;
    isStarred: boolean;
    labels: string[];
    from: EmailAddress[] | undefined;
    to: EmailAddress[] | undefined;
    subject: string | undefined;
    date: Date | undefined;
    body: {
      text: string | undefined;
      html?: string | false;
    };
    attachments: {
      filename: string | undefined;
      contentType: string | undefined;
      size: number | undefined;
    }[];
    priority?: "normal" | "low" | "high";
  };

  interface Credentials {
    refresh_token?: string | null;
    expiry_date?: number | null;
    access_token?: string | null;
    token_type?: string | null;
    id_token?: string | null;
    scope?: string;
  }
}
