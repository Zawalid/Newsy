'use server';

import { DEFAULT_EMAILS_DISPLAYED } from '@/utils/constants';
import { getGmailClient } from './client';
import { parseEmail } from './parser';
import { handleGmailError } from './error';
import { extractAddressInfo, getStatusFromLabels } from './utils';

// Helper function for common Gmail operations
const performGmailOperation = async <T>(operation: (gmail: Gmail) => Promise<T>): Promise<APIResponse<T>> => {
  try {
    const gmail = await getGmailClient();
    const result = await operation(gmail);

    if (result !== undefined) return { data: result };
    else return { data: undefined }; // Or return { data: { success: true } } if preferred
  } catch (error: any) {
    console.error('Gmail Operation Error:', error);
    return { error: handleGmailError(error) };
  }
};

/**
 * Fetches and parses a single email by its ID.
 */
export const fetchEmail = async (emailId: string): Promise<APIResponse<Email>> => {
  return performGmailOperation(async (gmail) => {
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      format: 'raw',
    });

    const raw = res.data.raw;
    if (!raw) throw new Error(`Email with ID ${emailId} found but contains no raw data.`);

    const decoded = Buffer.from(raw, 'base64').toString('utf-8');

    try {
      return await parseEmail(decoded, emailId, res.data.labelIds || []);
    } catch (parseError: any) {
      console.error(`Failed to parse email ID ${emailId}:`, parseError);
      throw new Error(`Failed to parse email content for ID ${emailId}: ${parseError.message}`);
    }
  });
};

/**
 * Fetches only essential metadata for an email.
 */
export const fetchEmailMetadataOnly = async (id: string): Promise<APIResponse<EmailMetadata>> => {
  return performGmailOperation(async (gmail) => {
    const res = await gmail.users.messages.get({
      userId: 'me',
      id,
      format: 'metadata',
      metadataHeaders: ['From', 'Subject', 'Date', 'List-Id', 'List-Unsubscribe'],
    });

    const headers = res.data.payload?.headers || [];
    const headerValue = (name: string): string =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

    const labels = res.data.labelIds || [];
    const date = res.data.internalDate ? new Date(parseInt(res.data.internalDate, 10)) : new Date();

    return {
      id,
      from: extractAddressInfo(headerValue('From')),
      fromRaw: headerValue('From'),
      subject: headerValue('Subject') || '(no subject)',
      snippet: res.data.snippet || '',
      date,
      labels: labels,
      status: getStatusFromLabels(labels),
      unsubscribeUrl: headerValue('List-Unsubscribe').replace(/<([^>]+)>/g, '$1'),
      listId: headerValue('List-Id'),
    };
  });
};

/**
 * Fetches a list of email details based on a query.
 */
export const fetchEmails = async (
  query: string | null,
  maxResults = DEFAULT_EMAILS_DISPLAYED,
  pageToken?: string
): Promise<APIResponse<EmailsListResponse<EmailMetadata>>> => {
  return performGmailOperation(async (gmail) => {
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: query || undefined,
      maxResults,
      pageToken,
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) return { emails: [], nextPageToken: listRes.data.nextPageToken };

    const results = await Promise.allSettled(messages.map((msg) => fetchEmailMetadataOnly(msg.id!)));

    const successfulEmails: EmailMetadata[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.data) successfulEmails.push(result.value.data);
      else {
        console.warn(
          `Failed to fetch metadata for email ID ${messages[index].id}:`,
          result.status === 'rejected' ? result.reason : 'No data returned'
        );
      }
    });

    return {
      emails: successfulEmails,
      nextPageToken: listRes.data.nextPageToken,
    };
  });
};

/**
 * Gets the user's Gmail profile information.
 */
export const getGmailProfile = async (): Promise<APIResponse<any>> => {
  return performGmailOperation(async (gmail) => {
    const profile = await gmail.users.getProfile({ userId: 'me' });
    return profile.data;
  });
};

/**
 * Modifies labels on an email. Returns void on success.
 */
export const modifyLabels = async (
  id: string,
  addLabelIds: string[] = [],
  removeLabelIds: string[] = []
): Promise<APIResponse<void>> => {
  return performGmailOperation(async (gmail) => {
    await gmail.users.messages.modify({
      userId: 'me',
      id,
      requestBody: { addLabelIds, removeLabelIds },
    });
  });
};

/**
 * Marks an email as READ or UNREAD by modifying labels.
 */
export const markEmailAsReadOrUnread = async (id: string, as: 'UNREAD' | 'READ'): Promise<APIResponse<void>> => {
  return as === 'UNREAD' ? modifyLabels(id, ['UNREAD'], []) : modifyLabels(id, [], ['UNREAD']);
};

/**
 * Moves an email to Trash or deletes it permanently. Returns void on success.
 */
export const moveEmailToTrash = async (id: string, isPermanent: boolean = false): Promise<APIResponse<void>> => {
  return performGmailOperation(async (gmail) => {
    if (isPermanent) await gmail.users.messages.delete({ userId: 'me', id });
    else await gmail.users.messages.trash({ userId: 'me', id });
  });
};

/**
 * Moves an email out of Trash. Returns void on success.
 */
export const untrashEmail = async (id: string): Promise<APIResponse<void>> => {
  return performGmailOperation(async (gmail) => {
    await gmail.users.messages.untrash({ userId: 'me', id });
  });
};

/**
 * Adds the STARRED label to an email.
 */
export const starEmail = async (id: string): Promise<APIResponse<void>> => modifyLabels(id, ['STARRED'], []);

/**
 * Removes the STARRED label from an email.
 */
export const unstarEmail = async (id: string): Promise<APIResponse<void>> => modifyLabels(id, [], ['STARRED']);
