import { simpleParser } from "mailparser";

export async function parseEmail(rawEmail: string) {
  const decodedEmail = Buffer.from(rawEmail, "base64").toString("utf-8");
  const parsed = await simpleParser(decodedEmail);

  const { from, subject } = parsed;

  console.log(parsed);

  if (!from) return null;

  return {
    from: from.value,
    subject,
  };
}
