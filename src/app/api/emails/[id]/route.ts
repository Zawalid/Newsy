import { fetchEmail } from "@/lib/gmail/fetcher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const emailId = (await params).id;

  if (!emailId) return NextResponse.json({ error: "Email ID is required." }, { status: 400 });

  const { data, error } = await fetchEmail(emailId);

  if (error)
    return NextResponse.json({ message: error.message, code: error.code }, { status: error.code });

  return NextResponse.json(data);
}
