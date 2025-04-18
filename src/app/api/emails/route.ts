import { NextRequest, NextResponse } from "next/server";
import { fetchEmails } from "@/lib/gmail/operations";
import { DISPLAYED_EMAILS_COUNT } from "@/utils/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("q") || "";
  const pageToken = searchParams.get("pageToken") || undefined;

  const { data, error } = await fetchEmails(searchQuery, DISPLAYED_EMAILS_COUNT, pageToken);

  if (error)
    return NextResponse.json({ message: error.message, code: error.code }, { status: 500 });

  return NextResponse.json(data);
}
