import { simpleParser, AddressObject } from "mailparser";

export function parseAddress(address?: AddressObject): AddressBody | undefined {
  if (!address) return undefined;
  return {
    name: address.value[0]?.name,
    address: address.value[0]?.address || "",
  };
}

export async function parseEmail(
  raw: string,
  messageId: string,
  labelIds: string[] = []
): Promise<Email> {
  const parsed = await simpleParser(raw);

  // console.log(parsed.headers, parseAddress(parsed.from));

  return {
    id: messageId,
    threadId: "",
    snippet: parsed.text?.substring(0, 100) || "",
    isRead: !labelIds.includes("UNREAD"),
    isStarred: labelIds.includes("STARRED"),
    isImportant: labelIds.includes("IMPORTANT"),
    labels: labelIds,
    from: parseAddress(parsed.from),
    to: parseAddress(parsed.to as AddressObject),
    date: parsed.date,
    subject: parsed.subject,
    body: {
      html: typeof parsed.html === "string" ? parsed.html : undefined,
      text: parsed.text,
    },
    attachments: (parsed.attachments || []).map((att) => ({
      filename: att.filename,
      contentType: att.contentType,
      size: att.size,
    })),
    priority: parsed.priority,
    headers: parsed.headers,
  };
}
