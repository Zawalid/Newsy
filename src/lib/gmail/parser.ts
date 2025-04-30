import { simpleParser, AddressObject } from 'mailparser';
import { getStatusFromLabels } from './utils';

export function parseAddress(address?: AddressObject): AddressBody | undefined {
  if (!address) return undefined;
  return {
    name: address.value[0]?.name,
    address: address.value[0]?.address || '',
  };
}

export async function parseEmail(raw: string, messageId: string, labelIds: string[] = []): Promise<Email> {
  const parsed = await simpleParser(raw);

  return {
    id: messageId,
    threadId: '',
    snippet: parsed.text?.substring(0, 100) || '',
    labels: labelIds,
    status: getStatusFromLabels(labelIds),
    from: parseAddress(parsed.from) || { name: '', address: '' },
    to: parseAddress(parsed.to as AddressObject),
    date: parsed.date,
    subject: parsed.subject || '(no subject)',
    body: {
      html: typeof parsed.html === 'string' ? parsed.html : undefined,
      text: parsed.text,
    },
    // attachments: (parsed.attachments || []).map((att) => ({
    //   filename: att.filename,
    //   contentType: att.contentType,
    //   size: att.size,
    // })),
    priority: parsed.priority,
    unsubscribeUrl:
      (parsed.headers.get('list') as unknown as EmailListHeader)?.unsubscribe?.url?.replace(/<([^>]+)>/g, '$1') ||
      undefined,
    listId: (parsed.headers.get('list') as unknown as EmailListHeader)?.id?.id || undefined,
  };
}
