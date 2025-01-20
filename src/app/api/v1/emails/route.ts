import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { authorize } from "@/lib/api/auth";
import { NEWS_LETTERS_EMAILS, TECH_KEYWORDS } from "@/lib/constants";
import { getEmail } from "@/lib/api/emails";

export async function GET(request: NextRequest) {
  console.log(request);
  const client = await authorize();
  const response = await axios.get("https://www.googleapis.com/gmail/v1/users/me/messages", {
    headers: {
      Authorization: `Bearer ${client.credentials.access_token}`,
    },
    params: {
      maxResults: 10,
      q: `(${TECH_KEYWORDS.join(" OR ")}) OR {${NEWS_LETTERS_EMAILS.map((e) => `from:${e}`).join(
        " "
      )}}`,
    },
  });
  const emails = await Promise.all(
    (response.data.messages || []).map(async (email: { id: string }) => getEmail(client, email))
  );
  const newsLetters = [...new Set(emails.map((e) => e.from[0].name))];
  return NextResponse.json({ newsLetters, emails });
}
