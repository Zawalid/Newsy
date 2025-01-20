import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

export async function GET(request: NextRequest) {
  console.log(request);
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return NextResponse.redirect(authUrl);
}
