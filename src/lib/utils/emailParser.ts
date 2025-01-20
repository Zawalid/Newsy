import { simpleParser } from 'mailparser';

export async function parseEmail(rawEmail: string): Promise<ParsedEmail> {
  const decodedEmail = Buffer.from(rawEmail, 'base64').toString('utf-8');
  const parsed = await simpleParser(decodedEmail);

  const { from, subject } = parsed;

  return {
    from: from.value,
    subject,
  };
}