import { NextRequest, NextResponse } from "next/server";
import { listEmails } from "@/lib/gmail/emails";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("q") || "";
  const pageToken = searchParams.get("pageToken") || undefined;

  console.log(pageToken,typeof pageToken);

  const { data, nextPageToken, error } = await listEmails(searchQuery, 10, pageToken);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ emails: data, nextPageToken });
}
