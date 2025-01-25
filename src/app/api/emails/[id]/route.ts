import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/api/auth";
import { getEmail } from "@/lib/api/emails";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const emailId = (await params).id;

  if (!emailId) return NextResponse.json({ error: "Email ID is required." }, { status: 400 });

  const client = await authorize();
  const { email, error } = await getEmail(client, emailId);

  if (error) return NextResponse.json({ error: error.message }, { status: error.status });

  return NextResponse.json(email);
}
