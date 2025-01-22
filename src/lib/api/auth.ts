import { OAuth2Client } from "google-auth-library";
import fs from "fs/promises";
import path from "path";

export const createAuthClient = () => {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

const TOKEN_FILE = path.join(process.cwd(), "tokens.json");

async function loadTokensFromFile() {
  try {
    const fileContent = await fs.readFile(TOKEN_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading token file:", error);
    return null;
  }
}

export async function authorize() {
  const tokens = await loadTokensFromFile();
  if (!tokens?.refresh_token) {
    throw new Error("User is not authenticated. Please authenticate first.");
  }

  const client = createAuthClient();
  client.setCredentials(tokens);

  // Refresh the token if it's expired or missing
  if (!client.credentials.access_token || Date.now() > (tokens.expiry_date || 0)) {
    const { credentials } = await client.refreshAccessToken();
    client.setCredentials(credentials);

    // Save refreshed tokens back to file
    await fs.writeFile(TOKEN_FILE, JSON.stringify(credentials, null, 2));
  }

  return client;
}
