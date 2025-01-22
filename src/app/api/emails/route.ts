import { NextResponse } from "next/server";
import { authorize } from "@/lib/api/auth";
import { listEmails } from "@/lib/api/emails";
import { NEWS_LETTERS_EMAILS, TECH_KEYWORDS } from "@/lib/constants";

export async function GET() {
  const client = await authorize();
  const query = `(${TECH_KEYWORDS.join(" OR ")}) OR {${NEWS_LETTERS_EMAILS.map(
    (e) => `from:${e}`
  ).join(" ")}}`;

  const emails = await listEmails(client, query, 3);
  const newsLetters = [...new Set(emails.map((e) => e.from?.[0].name))];

  return NextResponse.json({ newsLetters, emails });
}
