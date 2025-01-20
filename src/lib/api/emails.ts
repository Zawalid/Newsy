import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { simpleParser } from "mailparser";

interface Email {
  id: string;
}

export async function getEmail(client: OAuth2Client, email: Email) {
  const res = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${email.id}`, {
    headers: {
      Authorization: `Bearer ${client.credentials.access_token}`,
    },
    params: {
      format: "raw",
    },
  });
  const rawEmail = res.data.raw || ""; // Assume this is the Base64-encoded raw email
  const decodedEmail = Buffer.from(rawEmail, "base64").toString("utf-8");
  const parsed = await simpleParser(decodedEmail);

  // const { from, subject } = parsed;

  console.log(parsed);
}
