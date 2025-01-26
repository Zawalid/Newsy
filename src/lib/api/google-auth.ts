import { google } from "googleapis";
import { cookies } from "next/headers";

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Function to set credentials and handle token refresh
export const setCredentials = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;
  const refreshToken = cookieStore.get("google_refresh_token")?.value;
  const tokenExpiry = cookieStore.get("google_token_expiry")?.value;

  if (!accessToken || !refreshToken) throw new Error("Authentication tokens not found");

  console.log(accessToken)
  // Set initial credentials
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: tokenExpiry ? parseInt(tokenExpiry) : undefined,
  });

  // Check if token needs refresh
  if (shouldRefreshToken(parseInt(tokenExpiry || ""))) await refreshAccessToken();
};

// Helper function to determine if token needs refresh
// Refresh if token is expired or will expire in the next 5 minutes
const shouldRefreshToken = (expiryDate?: number): boolean => {
  if (!expiryDate) return true;
  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() >= expiryDate - fiveMinutes;
};

// Function to refresh the access token
export const refreshAccessToken = async (): Promise<void> => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    const cookieStore = await cookies();

    // Update cookies with new tokens
    if (credentials.access_token) {
      cookieStore.set("google_access_token", credentials.access_token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600, // 1 hour
      });
    }

    if (credentials.expiry_date) {
      cookieStore.set("google_token_expiry", credentials.expiry_date.toString(), {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600, // 1 hour
      });
    }

    // Update OAuth2 client with new credentials
    oauth2Client.setCredentials(credentials);
  } catch (error) {
    console.error("Error refreshing access token:", error);
    // Clear cookies on refresh failure
    const cookieStore = await cookies();
    cookieStore.delete("google_access_token");
    cookieStore.delete("google_refresh_token");
    cookieStore.delete("google_token_expiry");
    throw new Error("Failed to refresh access token. Please sign in again.");
  }
};

// Helper function to store initial tokens after OAuth flow
export const storeCredentials = async (credentials: Credentials) => {
  const { access_token, refresh_token, expiry_date } = credentials;
  const cookieStore = await cookies();

  if (access_token) {
    cookieStore.set("google_access_token", access_token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600, // 1 hour
    });
  }

  if (refresh_token) {
    cookieStore.set("google_refresh_token", refresh_token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  }

  if (expiry_date) {
    cookieStore.set("google_token_expiry", expiry_date.toString(), {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600, // 1 hour
    });
  }
};
