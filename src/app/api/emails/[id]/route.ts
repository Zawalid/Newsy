import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/api/auth";
import { getEmail } from "@/lib/api/emails";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const emailId = params.id;

    if (!emailId) {
      return NextResponse.json({ error: "Email ID is required." }, { status: 400 });
    }

    const client = await authorize();
    const email = await getEmail(client, emailId);

    return NextResponse.json(email);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch email." }, { status: 500 });
  }
}
