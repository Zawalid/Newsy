import { NextResponse } from "next/server";
import { listEmails } from "@/lib/api/emails";
import { NEWS_LETTERS_EMAILS, TECH_KEYWORDS } from "@/lib/constants";

const query = `(${TECH_KEYWORDS.join(" OR ")}) OR {${NEWS_LETTERS_EMAILS.map(
  (e) => `from:${e}`
).join(" ")}}`;

export async function GET() {
  const { emails, error } = await listEmails(query, 5);

  if (error) return NextResponse.json({ error: error.message }, { status: error.status });

  const newsletters = [...new Set(emails?.map((e) => e.from?.[0].name))];

  return NextResponse.json({ newsletters, emails });
}
