import { gmail_v1 } from 'googleapis';

declare global {
  // Base Gmail type
  type Gmail = gmail_v1.Gmail;

  type EmailPriority = 'normal' | 'low' | 'high';

  type EmailAction = 'markAsRead' | 'markAsUnread' | 'star' | 'unstar' | 'moveToTrash' | 'removeFromTrash';

  // Email-related interfaces
  interface AddressBody {
    name: string;
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

  interface EmailListHeader {
    id: {
      name: string;
      id: string;
    };
    'unsubscribe-post': {
      name: string;
    };
    unsubscribe: {
      url: string;
    };
  }
  interface Email {
    id: string;
    threadId: string;
    from: AddressBody;
    date?: Date;

    snippet: string;
    subject: string;
    body: EmailBody;

    status: { isRead: boolean; isStarred: boolean; isImportant: boolean };
    labels: string[];
    priority?: EmailPriority;

    attachments?: EmailAttachment[];
    to?: AddressBody;

    unsubscribeUrl?: string;
    listId?: string;
  }

  interface EmailMetadata
    extends Pick<
      Email,
      'id' | 'from' | 'snippet' | 'subject' | 'unsubscribeUrl' | 'listId' | 'date' | 'labels' | 'status'
    > {
    fromRaw: string;
  }

  interface EmailsListResponse<T = EmailMetadata> {
    emails: T[];
    nextPageToken?: string | null;
  }
}

export {};
