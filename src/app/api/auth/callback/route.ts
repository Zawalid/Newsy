import { createAuthClient } from "@/lib/api/auth";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

const TOKEN_FILE = "./tokens.json"; // File to store tokens

async function saveTokensToFile(tokens: any) {
  await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Authorization code not found" }, { status: 400 });
  }

  const client = createAuthClient();

  try {
    const { tokens ,} = await client.getToken(code);
    client.setCredentials(tokens);

    // Save tokens to a file for testing
    await saveTokensToFile(tokens);

    console.log("Authenticated successfully! Tokens saved to file:", tokens);

    return NextResponse.redirect(new URL("/", request.url).toString());
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 });
  }
}
