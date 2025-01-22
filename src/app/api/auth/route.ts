import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/api/auth";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

export async function GET(request: NextRequest) {
  console.log(request.url);
  const client = createAuthClient();

  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  return NextResponse.redirect(authUrl);
}
