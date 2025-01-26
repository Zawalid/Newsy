import { NextRequest, NextResponse } from "next/server";
import { oauth2Client, storeCredentials } from "@/lib/api/google-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) return NextResponse.json({ error: "Authorization failed" }, { status: 400 });
  if (!code) return NextResponse.json({ error: "Authorization code not found" }, { status: 400 });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    await storeCredentials(tokens);

    return NextResponse.redirect(new URL("/app", request.url).toString());
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 });
  }
}
