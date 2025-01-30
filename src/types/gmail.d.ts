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
  priority?: string;
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

type GmailResponse<T> = {
  data?: T;
  error?: {
    message: string;
    code?: number;
  };
  nextPageToken?: string | null;
};


